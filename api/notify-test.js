import { neon } from '@neondatabase/serverless';
import { sendPush } from '../lib/apns.js';

export default async function handler(req, res) {
  try {
    const sql = neon(process.env.DATABASE_URL);

    const tokens = await sql`
      SELECT pt.token, pt.group_code, pt.player_name, pt.prefs,
             sg.plan, sg.group_name
      FROM push_tokens pt
      LEFT JOIN sweepstake_groups sg ON sg.group_code = pt.group_code
      LIMIT 30
    `;

    if (!tokens.length) return res.json({ sent: 0, message: 'No tokens registered' });

    // Build per-token diagnostics: what teams does this player have?
    const diagnostics = tokens.map(t => {
      const playerTeams = [];
      if (t.plan) {
        for (const entry of t.plan) {
          if (entry.p === t.player_name) playerTeams.push(entry.team);
        }
      }
      return {
        group: t.group_name || t.group_code,
        group_code: t.group_code,
        player: t.player_name,
        teams: playerTeams,
        token_tail: t.token.slice(-8),
      };
    });

    // Send test push to each token
    const results = await Promise.allSettled(
      tokens.map(t => sendPush(t.token, {
        title: `🔔 Test — ${t.group_name || t.group_code}`,
        body: `Hi ${t.player_name || 'there'} — Sweetsteak push is working!`,
      }))
    );

    const details = results.map((r, i) => ({
      ...diagnostics[i],
      push: r.status === 'fulfilled' ? r.value : { error: r.reason?.message },
    }));

    const sent = results.filter(r => r.status === 'fulfilled' && r.value?.ok !== false).length;
    return res.json({ sent, total: tokens.length, details });
  } catch (err) {
    return res.status(500).json({ error: err.message, stack: err.stack });
  }
}
