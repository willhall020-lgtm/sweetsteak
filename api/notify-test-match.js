import { neon } from '@neondatabase/serverless';
import { sendPush } from '../lib/apns.js';
import { teamFlag } from '../lib/team-data.js';

// Tier A vs Tier A: England vs Spain
// Tier C vs Tier A: Canada vs England  (2-tier GK)
// Tier B vs Tier A: Türkiye vs England (1-tier GK)

function notifForType(type, playerTeam) {
  const pf = teamFlag(playerTeam) || '';

  switch (type) {
    case 'kickoff': {
      const opp = 'Spain'; const of = teamFlag(opp);
      return { title: `🏟️ ${pf} ${playerTeam} are playing now`, body: `vs ${of} ${opp}. Come on!` };
    }
    case 'kickoff_underdog': {
      const opp = 'Spain'; const of = teamFlag(opp);
      return { title: `🏟️ ${pf} ${playerTeam} vs ${of} ${opp}`, body: 'Just kicked off. Can they do it?' };
    }
    case 'halftime_win': {
      const opp = 'Spain'; const of = teamFlag(opp);
      return { title: 'Half-time', subtitle: `${pf} ${playerTeam} 1–0 ${of} ${opp}`, body: '' };
    }
    case 'halftime_lose': {
      const opp = 'Spain'; const of = teamFlag(opp);
      return { title: 'Half-time', subtitle: `${of} ${opp} 1–0 ${pf} ${playerTeam}`, body: 'Still 45 to go.' };
    }
    case 'win': {
      const opp = 'Spain'; const of = teamFlag(opp);
      return { title: 'Full time', subtitle: `${pf} ${playerTeam} 2–1 ${of} ${opp}`, body: 'You earned 5pts.' };
    }
    case 'draw': {
      const opp = 'Spain'; const of = teamFlag(opp);
      return { title: 'Full time', subtitle: `${pf} ${playerTeam} 1–1 ${of} ${opp}`, body: 'A point each.' };
    }
    case 'loss': {
      const opp = 'Spain'; const of = teamFlag(opp);
      return { title: 'Full time', subtitle: `${of} ${opp} 2–0 ${pf} ${playerTeam}`, body: '' };
    }
    case 'gk1': {
      const opp = 'Germany'; const of = teamFlag(opp);
      return { title: 'Giant Killing! 🪓', subtitle: `${pf} ${playerTeam} beat ${of} ${opp} 1–0`, body: 'Bonus pts incoming.' };
    }
    case 'gk2': {
      const opp = 'Brazil'; const of = teamFlag(opp);
      return { title: 'GIANT KILLING! 🪓🪓', subtitle: `${pf} ${playerTeam} beat ${of} ${opp} 1–0`, body: 'Massive.' };
    }
    default:
      return null;
  }
}

const ALL_TYPES = ['kickoff','kickoff_underdog','halftime_win','halftime_lose','win','draw','loss','gk1','gk2'];

export default async function handler(req, res) {
  try {
    const type = req.query.type;

    const sql = neon(process.env.DATABASE_URL);
    const tokens = await sql`SELECT token, group_code, player_name FROM push_tokens ORDER BY updated_at DESC`;
    if (!tokens.length) return res.json({ sent: 0, message: 'No tokens' });

    const groupCodes = [...new Set(tokens.map(t => t.group_code))];
    const groups = await sql`
      SELECT group_code, plan FROM sweepstake_groups
      WHERE group_code = ANY(${groupCodes}) AND completed = TRUE
    `;

    const tokenTeam = {};
    for (const g of groups) {
      const playerTeams = {};
      for (const entry of g.plan || []) {
        if (!playerTeams[entry.p]) playerTeams[entry.p] = [];
        playerTeams[entry.p].push(entry.team);
      }
      for (const t of tokens.filter(t => t.group_code === g.group_code)) {
        if (!tokenTeam[t.token]) {
          const teams = playerTeams[t.player_name] || [];
          if (teams.length) tokenTeam[t.token] = teams[0];
        }
      }
    }

    if (!type) {
      // No type — return links for all types
      const base = req.headers['x-forwarded-proto']
        ? `${req.headers['x-forwarded-proto']}://${req.headers['x-forwarded-host'] || req.headers.host}`
        : `https://www.sweetsteak.co.uk`;
      const links = ALL_TYPES.map(t => `${base}/api/notify-test-match?type=${t}`);
      return res.json({ types: ALL_TYPES, links });
    }

    const typesToSend = type === 'all' ? ALL_TYPES : [type];

    // Deduplicate: one send per unique token regardless of how many groups it's in
    const uniqueTokens = [...new Map(tokens.map(t => [t.token, t])).values()];

    const results = [];
    for (const t of typesToSend) {
      for (const tok of uniqueTokens) {
        const team = tokenTeam[tok.token];
        if (!team) { results.push({ type: t, token_tail: tok.token.slice(-8), skipped: 'no team' }); continue; }
        const notif = notifForType(t, team);
        if (!notif) { results.push({ type: t, token_tail: tok.token.slice(-8), skipped: 'unknown type' }); continue; }
        notif.title = `[TEST] ${notif.title}`;
        const r = await sendPush(tok.token, notif).catch(err => ({ error: err.message }));
        results.push({ type: t, token_tail: tok.token.slice(-8), team, push: r });
      }
    }

    const sent = results.filter(r => r.push?.ok === true).length;
    return res.json({ sent, total: results.length, results });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
