import { neon } from '@neondatabase/serverless';
import { verifyPin } from './group.js';
import { createPostHogClient } from '../lib/posthog.js';
import { sendPush } from '../lib/apns.js';
import { teamFlag } from '../lib/team-data.js';

async function getDb() {
  const sql = neon(process.env.DATABASE_URL);
  await sql`
    CREATE TABLE IF NOT EXISTS sweepstake_groups (
      group_code   TEXT PRIMARY KEY,
      group_name   TEXT NOT NULL DEFAULT 'Sweepstake',
      entry_price  TEXT NOT NULL DEFAULT '£5',
      player_count INT  NOT NULL DEFAULT 14,
      admin_pin    TEXT NOT NULL DEFAULT 'admin',
      completed    BOOLEAN NOT NULL DEFAULT FALSE,
      names        JSONB NOT NULL DEFAULT '[]'::jsonb,
      plan         JSONB NOT NULL DEFAULT '[]'::jsonb,
      idx          INT  NOT NULL DEFAULT 0,
      updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;
  await sql`ALTER TABLE sweepstake_groups ADD COLUMN IF NOT EXISTS player_count INT NOT NULL DEFAULT 14`;
  await sql`ALTER TABLE sweepstake_groups ADD COLUMN IF NOT EXISTS admin_apple_id TEXT`;
  return sql;
}

async function sendDrawNotifications(sql, groupCode, plan) {
  const already = await sql`
    SELECT id FROM notif_log
    WHERE group_code = ${groupCode} AND notif_type = 'draw' AND match_id IS NULL
    LIMIT 1
  `;
  if (already.length) return; // already sent for this draw

  const tokens = await sql`
    SELECT token, player_name, prefs FROM push_tokens WHERE group_code = ${groupCode}
  `;
  if (!tokens.length) return;

  // Build player → first team mapping
  const playerFirstTeam = {};
  for (const entry of plan) {
    if (!playerFirstTeam[entry.p]) playerFirstTeam[entry.p] = entry.team;
  }

  const pushes = tokens
    .filter(t => (t.prefs?.draw ?? true) !== false)
    .map(t => {
      const team = playerFirstTeam[t.player_name];
      if (!team) return null;
      const flag = teamFlag(team);
      return sendPush(t.token, {
        title: 'The draw is done! 🎲',
        body: `You've got ${flag} ${team} — check the leaderboard.`,
      });
    })
    .filter(Boolean);

  await Promise.allSettled(pushes);

  await sql`
    INSERT INTO notif_log (group_code, notif_type)
    VALUES (${groupCode}, 'draw')
    ON CONFLICT DO NOTHING
  `;
}

async function authOk(req, sql, code) {
  const pin = req.headers['x-admin-pin'];
  if (!pin) return false;
  const rows = await sql`SELECT admin_pin FROM sweepstake_groups WHERE group_code = ${code}`;
  if (!rows.length) return false;
  return verifyPin(pin, rows[0].admin_pin);
}

export default async function handler(req, res) {
  const code = req.query.g;
  if (!code) return res.status(400).json({ error: 'Missing group code (?g=)' });

  const posthog = createPostHogClient();
  const sql = await getDb();

  try {
    if (req.method === 'GET') {
      const rows = await sql`
        SELECT completed, names, plan, idx, group_name, entry_price, player_count, admin_apple_id
        FROM sweepstake_groups WHERE group_code = ${code}
      `;
      if (!rows.length) return res.status(404).json({ error: 'Group not found' });
      const { completed, names, plan, idx, group_name, entry_price, player_count, admin_apple_id } = rows[0];
      posthog.capture({
        distinctId: code,
        event: 'draw viewed',
        properties: { group_code: code, completed, player_count },
      });
      return res.json({ completed, names, plan, idx, group_name, entry_price, player_count, admin_apple_id });
    }

    if (req.method === 'POST') {
      if (!await authOk(req, sql, code)) return res.status(401).json({ error: 'Invalid PIN' });
      const { completed, names, plan, idx } = req.body;
      await sql`
        UPDATE sweepstake_groups SET
          completed  = ${completed},
          names      = ${JSON.stringify(names)}::jsonb,
          plan       = ${JSON.stringify(plan)}::jsonb,
          idx        = ${idx},
          updated_at = NOW()
        WHERE group_code = ${code}
      `;
      posthog.capture({
        distinctId: code,
        event: 'draw saved',
        properties: { group_code: code, completed, names_count: Array.isArray(names) ? names.length : 0 },
      });

      // Send draw-complete push notifications (fire-and-forget)
      if (completed && Array.isArray(plan) && plan.length) {
        sendDrawNotifications(sql, code, plan).catch(err => console.error('[draw notif]', err));
      }

      return res.json({ ok: true });
    }

    if (req.method === 'DELETE') {
      if (!await authOk(req, sql, code)) return res.status(401).json({ error: 'Invalid PIN' });
      await sql`UPDATE sweepstake_groups SET completed = FALSE, names = '[]'::jsonb, plan = '[]'::jsonb, idx = 0, updated_at = NOW() WHERE group_code = ${code}`;
      posthog.capture({ distinctId: code, event: 'draw reset', properties: { group_code: code } });
      return res.json({ ok: true });
    }

    res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    posthog.captureException(err);
    throw err;
  } finally {
    await posthog.shutdown();
  }
}
