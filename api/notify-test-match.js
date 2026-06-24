import { neon } from '@neondatabase/serverless';
import { sendPush } from '../lib/apns.js';
import { teamFlag } from '../lib/team-data.js';
import { normalizeMatch, computeScores } from '../lib/scores.js';

// Tier A vs Tier A: England vs Spain
// Tier C vs Tier A: Canada vs England  (2-tier GK)
// Tier B vs Tier A: Türkiye vs England (1-tier GK)

function notifForType(type, playerTeam, opponentPlayer) {
  const pf = teamFlag(playerTeam) || '';

  switch (type) {
    case 'kickoff': {
      const opp = 'Spain'; const of = teamFlag(opp);
      const body = opponentPlayer ? `vs ${of} ${opp} (${opponentPlayer}). Come on!` : `vs ${of} ${opp}. Come on!`;
      return { title: `🏟️ ${pf} ${playerTeam} are playing now`, body };
    }
    case 'halftime_win': {
      const opp = 'Spain'; const of = teamFlag(opp);
      return { title: 'Half-time', subtitle: `${pf} ${playerTeam} 1-0 ${of} ${opp}`, body: '' };
    }
    case 'halftime_lose': {
      const opp = 'Spain'; const of = teamFlag(opp);
      return { title: 'Half-time', subtitle: `${of} ${opp} 1-0 ${pf} ${playerTeam}`, body: 'Still 45 to go.' };
    }
    case 'win': {
      const opp = 'Spain'; const of = teamFlag(opp);
      return { title: 'Full time', subtitle: `${pf} ${playerTeam} 2-1 ${of} ${opp}`, body: 'You earned 5pts.' };
    }
    case 'draw': {
      const opp = 'Spain'; const of = teamFlag(opp);
      return { title: 'Full time', subtitle: `${pf} ${playerTeam} 1-1 ${of} ${opp}`, body: 'A point each.' };
    }
    case 'loss': {
      const opp = 'Spain'; const of = teamFlag(opp);
      return { title: 'Full time', subtitle: `${of} ${opp} 2-0 ${pf} ${playerTeam}`, body: '' };
    }
    case 'gk1': {
      const opp = 'Germany'; const of = teamFlag(opp);
      return { title: 'Giant Killing! 🪓', subtitle: `${pf} ${playerTeam} beat ${of} ${opp} 1-0`, body: 'Bonus pts incoming.' };
    }
    case 'gk2': {
      const opp = 'Brazil'; const of = teamFlag(opp);
      return { title: 'GIANT KILLING! 🪓🪓', subtitle: `${pf} ${playerTeam} beat ${of} ${opp} 1-0`, body: 'Massive.' };
    }
    default:
      return null;
  }
}

const ALL_TYPES = ['kickoff','halftime_win','halftime_lose','win','draw','loss','gk1','gk2'];

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
    // team → player_name per group (for opponent attribution in kickoff tests)
    const teamToPlayer = {};
    for (const g of groups) {
      teamToPlayer[g.group_code] = {};
      const playerTeams = {};
      for (const entry of g.plan || []) {
        if (!playerTeams[entry.p]) playerTeams[entry.p] = [];
        playerTeams[entry.p].push(entry.team);
        teamToPlayer[g.group_code][entry.team] = entry.p;
      }
      for (const t of tokens.filter(t => t.group_code === g.group_code)) {
        if (!tokenTeam[t.token]) {
          const teams = playerTeams[t.player_name] || [];
          if (teams.length) tokenTeam[t.token] = { team: teams[0], group_code: g.group_code };
        }
      }
    }

    if (!type) {
      // No type — return links for all types
      const base = req.headers['x-forwarded-proto']
        ? `${req.headers['x-forwarded-proto']}://${req.headers['x-forwarded-host'] || req.headers.host}`
        : `https://www.sweetsteak.co.uk`;
      const links = [...ALL_TYPES, 'top_spot'].map(t => `${base}/api/notify-test-match?type=${t}`);
      return res.json({ types: [...ALL_TYPES, 'top_spot'], links });
    }

    // Special case: top_spot — compute real leaderboard and notify current leader
    if (type === 'top_spot') {
      const footballKey = process.env.FOOTBALL_API_KEY;
      if (!footballKey) return res.status(500).json({ error: 'FOOTBALL_API_KEY not set' });

      const matchRes = await fetch('https://api.football-data.org/v4/competitions/WC/matches', {
        headers: { 'X-Auth-Token': footballKey },
      });
      if (!matchRes.ok) return res.status(502).json({ error: 'Football API error' });
      const { matches: rawMatches } = await matchRes.json();
      const finishedMatches = rawMatches.filter(m => m.status === 'FINISHED').map(normalizeMatch);

      const groupsWithName = await sql`
        SELECT group_code, group_name, plan FROM sweepstake_groups
        WHERE group_code = ANY(${groupCodes}) AND completed = TRUE
      `;

      const leaderResults = [];
      for (const g of groupsWithName) {
        const assignments = {};
        for (const entry of g.plan || []) {
          if (!assignments[entry.p]) assignments[entry.p] = [];
          assignments[entry.p].push(entry.team);
        }
        if (!Object.keys(assignments).length) continue;

        const scores = computeScores(assignments, finishedMatches);
        const ranked = Object.entries(scores).sort(([, a], [, b]) => b.total - a.total);
        if (!ranked.length || ranked[0][1].total === 0) continue;
        const topPts = ranked[0][1].total;
        const leaders = ranked.filter(([, s]) => s.total === topPts);

        leaderResults.push({
          group: g.group_name || g.group_code,
          leader: leaders.length === 1 ? leaders[0][0] : null,
          tied: leaders.length > 1 ? leaders.map(([p]) => p) : null,
          pts: topPts,
          rankings: ranked.map(([p, s]) => ({ player: p, pts: s.total })),
        });

        if (leaders.length !== 1) continue;
        const currentLeader = leaders[0][0];

        const leaderTokens = [...new Map(
          tokens.filter(t => t.group_code === g.group_code && t.player_name === currentLeader)
                .map(t => [t.token, t])
        ).values()];

        for (const t of leaderTokens) {
          const r = await sendPush(t.token, {
            title: '[TEST] 🥇 You\'re leading!',
            subtitle: g.group_name || g.group_code,
            body: `${topPts}pts - you're top of the leaderboard`,
          }).catch(err => ({ error: err.message }));
          leaderResults[leaderResults.length - 1].push = r;
        }
      }

      return res.json({ leaderResults });
    }

    const typesToSend = type === 'all' ? ALL_TYPES : [type];

    // Deduplicate: one send per unique token regardless of how many groups it's in
    const uniqueTokens = [...new Map(tokens.map(t => [t.token, t])).values()];

    const results = [];
    for (const t of typesToSend) {
      for (const tok of uniqueTokens) {
        const entry = tokenTeam[tok.token];
        if (!entry) { results.push({ type: t, token_tail: tok.token.slice(-8), skipped: 'no team' }); continue; }
        const { team, group_code } = entry;
        const opponentPlayer = t === 'kickoff' ? teamToPlayer[group_code]?.['Spain'] : undefined;
        const notif = notifForType(t, team, opponentPlayer);
        if (!notif) { results.push({ type: t, token_tail: tok.token.slice(-8), skipped: 'unknown type' }); continue; }
        notif.title = `[TEST] ${notif.title}`;
        const r = await sendPush(tok.token, notif).catch(err => ({ error: err.message }));
        results.push({ type: t, token_tail: tok.token.slice(-8), team, opponentPlayer, push: r });
      }
    }

    const sent = results.filter(r => r.push?.ok === true).length;
    return res.json({ sent, total: results.length, results });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
