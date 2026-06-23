import { neon } from '@neondatabase/serverless';
import { sendPush } from '../lib/apns.js';

export default async function handler(req, res) {
  try {
    const sql = neon(process.env.DATABASE_URL);

    // Create table if not yet initialised
    await sql`CREATE TABLE IF NOT EXISTS push_tokens (
      id SERIAL PRIMARY KEY, token TEXT NOT NULL, group_code TEXT NOT NULL,
      player_name TEXT, prefs JSONB NOT NULL DEFAULT '{}',
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      UNIQUE(token, group_code)
    )`;

    const tokens = await sql`SELECT token, group_code, player_name FROM push_tokens LIMIT 20`;
    if (!tokens.length) return res.json({ sent: 0, message: 'No tokens registered — enable notifications in the iOS app first' });

    const results = await Promise.allSettled(
      tokens.map(t => sendPush(t.token, {
        title: '🔔 Test notification',
        body: `Hi ${t.player_name || 'there'} — Sweetsteak notifications are working!`,
      }))
    );

    const details = results.map((r, i) => ({
      player: tokens[i].player_name,
      result: r.status === 'fulfilled' ? r.value : { error: r.reason?.message },
    }));

    return res.json({ sent: results.filter(r => r.status === 'fulfilled').length, total: tokens.length, details });
  } catch (err) {
    return res.status(500).json({ error: err.message, stack: err.stack });
  }
}
