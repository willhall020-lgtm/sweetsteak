import { neon } from '@neondatabase/serverless';

const DEFAULT_PREFS = { kickoff: true, halftime: false, fulltime: true, knockout: true, draw: true };

async function getDb() {
  const sql = neon(process.env.DATABASE_URL);
  await sql`
    CREATE TABLE IF NOT EXISTS push_tokens (
      id          SERIAL PRIMARY KEY,
      token       TEXT NOT NULL,
      group_code  TEXT NOT NULL,
      player_name TEXT,
      prefs       JSONB NOT NULL DEFAULT '{"kickoff":true,"halftime":false,"fulltime":true,"knockout":true,"draw":true}',
      created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      UNIQUE(token, group_code)
    )
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS notif_log (
      id          SERIAL PRIMARY KEY,
      group_code  TEXT NOT NULL,
      match_id    TEXT,
      notif_type  TEXT NOT NULL,
      sent_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;
  await sql`
    CREATE UNIQUE INDEX IF NOT EXISTS notif_log_unique
      ON notif_log (group_code, COALESCE(match_id, ''), notif_type)
  `;
  return sql;
}

export default async function handler(req, res) {
  const code = req.query.g;
  if (!code && req.method !== 'DELETE') return res.status(400).json({ error: 'Missing group code' });

  const sql = await getDb();

  // POST — register or update a push token for a player in a group
  if (req.method === 'POST') {
    const { token, player_name, prefs } = req.body || {};
    if (!token) return res.status(400).json({ error: 'Missing token' });
    const mergedPrefs = { ...DEFAULT_PREFS, ...prefs };
    await sql`
      INSERT INTO push_tokens (token, group_code, player_name, prefs, updated_at)
      VALUES (${token}, ${code}, ${player_name ?? null}, ${JSON.stringify(mergedPrefs)}, NOW())
      ON CONFLICT (token, group_code) DO UPDATE
        SET player_name = EXCLUDED.player_name,
            prefs       = EXCLUDED.prefs,
            updated_at  = NOW()
    `;
    return res.json({ ok: true });
  }

  // PATCH — update prefs only (token supplied via header)
  if (req.method === 'PATCH') {
    const token = req.headers['x-push-token'];
    if (!token) return res.status(400).json({ error: 'Missing x-push-token header' });
    const { prefs } = req.body || {};
    if (!prefs) return res.status(400).json({ error: 'Missing prefs' });
    const mergedPrefs = { ...DEFAULT_PREFS, ...prefs };
    await sql`
      UPDATE push_tokens
      SET prefs = ${JSON.stringify(mergedPrefs)}, updated_at = NOW()
      WHERE token = ${token} AND group_code = ${code}
    `;
    return res.json({ ok: true });
  }

  // GET — retrieve prefs for a token+group
  if (req.method === 'GET') {
    const token = req.headers['x-push-token'];
    if (!token) return res.status(400).json({ error: 'Missing x-push-token header' });
    const rows = await sql`
      SELECT prefs FROM push_tokens WHERE token = ${token} AND group_code = ${code}
    `;
    if (!rows.length) return res.status(404).json({ error: 'Not found' });
    return res.json({ prefs: rows[0].prefs });
  }

  // DELETE — remove push token; omit ?g to remove from all groups (e.g. on logout/disable)
  if (req.method === 'DELETE') {
    const token = req.headers['x-push-token'];
    if (!token) return res.status(400).json({ error: 'Missing x-push-token header' });
    if (code) {
      await sql`DELETE FROM push_tokens WHERE token = ${token} AND group_code = ${code}`;
    } else {
      await sql`DELETE FROM push_tokens WHERE token = ${token}`;
    }
    return res.json({ ok: true });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
