import { neon } from '@neondatabase/serverless';
import { sendPush } from '../lib/apns.js';

export default async function handler(req, res) {
  const sql = neon(process.env.DATABASE_URL);
  const tokens = await sql`SELECT token, group_code, player_name FROM push_tokens LIMIT 20`;
  if (!tokens.length) return res.json({ sent: 0, message: 'No tokens registered' });

  const results = await Promise.allSettled(
    tokens.map(t => sendPush(t.token, {
      title: '🔔 Test notification',
      body: `Hi ${t.player_name || 'there'} — Sweetsteak notifications are working!`,
    }))
  );

  const sent = results.filter(r => r.status === 'fulfilled').length;
  return res.json({ sent, total: tokens.length, tokens: tokens.map(t => t.player_name) });
}
