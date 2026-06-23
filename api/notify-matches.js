import { neon } from '@neondatabase/serverless';
import { sendPush } from '../lib/apns.js';
import { normTeam, teamFlag, giantKillTiers, TIER_MAP, TIER_RANK } from '../lib/team-data.js';

const KNOCKOUT_STAGES = new Set([
  'ROUND_OF_16', 'LAST_16', 'QUARTER_FINALS', 'SEMI_FINALS',
  'FINAL', 'THIRD_PLACE', 'THIRD_PLACE_MATCH',
]);

function score(m) {
  const h = m.score?.fullTime?.home  ?? m.score?.regularTime?.home ?? m.score?.halfTime?.home ?? 0;
  const a = m.score?.fullTime?.away  ?? m.score?.regularTime?.away ?? m.score?.halfTime?.away ?? 0;
  return { home: h, away: a };
}

function htScore(m) {
  return { home: m.score?.halfTime?.home ?? 0, away: m.score?.halfTime?.away ?? 0 };
}

function kickoffCopy(playerTeam, homeTeam, awayTeam) {
  const opponent = playerTeam === homeTeam ? awayTeam : homeTeam;
  const pf = teamFlag(playerTeam);
  const of = teamFlag(opponent);
  const pt = TIER_MAP[playerTeam];
  const ot = TIER_MAP[opponent];
  const isUnderdog = pt && ot && TIER_RANK[pt] > TIER_RANK[ot];
  if (isUnderdog) {
    return { title: `🏟️ ${pf} ${playerTeam} vs ${of} ${opponent}`, body: 'Just kicked off. Can they do it?' };
  }
  return { title: `🏟️ ${pf} ${playerTeam} are playing now`, body: `vs ${of} ${opponent}. Come on!` };
}

function halftimeCopy(playerTeam, homeTeam, awayTeam, s) {
  const isHome     = playerTeam === homeTeam;
  const opponent   = isHome ? awayTeam : homeTeam;
  const pf         = teamFlag(playerTeam);
  const of         = teamFlag(opponent);
  const myGoals    = isHome ? s.home : s.away;
  const theirGoals = isHome ? s.away : s.home;
  const scoreStr   = isHome
    ? `${pf} ${playerTeam} ${s.home}–${s.away} ${of} ${awayTeam}`
    : `${of} ${homeTeam} ${s.home}–${s.away} ${pf} ${playerTeam}`;
  const body = myGoals < theirGoals ? 'Still 45 to go.' : '';
  return { title: 'Half-time', subtitle: scoreStr, body };
}

function fulltimeCopy(playerTeam, homeTeam, awayTeam, s) {
  const isHome     = playerTeam === homeTeam;
  const opponent   = isHome ? awayTeam : homeTeam;
  const pf         = teamFlag(playerTeam);
  const of         = teamFlag(opponent);
  const myGoals    = isHome ? s.home : s.away;
  const theirGoals = isHome ? s.away : s.home;
  const scoreStr   = isHome
    ? `${pf} ${playerTeam} ${s.home}–${s.away} ${of} ${awayTeam}`
    : `${of} ${homeTeam} ${s.home}–${s.away} ${pf} ${playerTeam}`;

  if (myGoals > theirGoals) {
    const gk = giantKillTiers(playerTeam, opponent);
    if (gk >= 2) return { title: 'GIANT KILLING! 🪓🪓', subtitle: `${pf} ${playerTeam} beat ${of} ${opponent} ${myGoals}–${theirGoals}`, body: 'Massive.' };
    if (gk === 1) return { title: 'Giant Killing! 🪓', subtitle: `${pf} ${playerTeam} beat ${of} ${opponent} ${myGoals}–${theirGoals}`, body: 'Bonus pts incoming.' };
    const pts = 3 + myGoals;
    return { title: 'Full time', subtitle: scoreStr, body: `You earned ${pts}pts.` };
  }
  if (myGoals === theirGoals) return { title: 'Full time', subtitle: scoreStr, body: 'A point each.' };
  return { title: 'Full time', subtitle: scoreStr, body: '' };
}

export default async function handler(req, res) {
  if (!['GET', 'POST'].includes(req.method)) return res.status(405).end();

  const secret = process.env.NOTIFY_SECRET;
  if (secret && req.headers['x-notify-secret'] !== secret) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const footballKey = process.env.FOOTBALL_API_KEY;
  if (!footballKey) return res.status(500).json({ error: 'FOOTBALL_API_KEY not set' });

  const sql = neon(process.env.DATABASE_URL);

  try {
    // 1. Fetch registered tokens
    const tokens = await sql`SELECT token, group_code, player_name, prefs FROM push_tokens`;
    if (!tokens.length) return res.json({ sent: 0, message: 'No registered tokens' });

    const groupCodes = [...new Set(tokens.map(t => t.group_code))];

    // 2. Fetch draw plans for groups that have tokens
    const groups = await sql`
      SELECT group_code, plan FROM sweepstake_groups
      WHERE group_code = ANY(${groupCodes}) AND completed = TRUE
    `;

    // Build team → [{ token, group_code, prefs }]
    const teamSubs = {};
    for (const g of groups) {
      // player_name → [team]
      const playerTeams = {};
      for (const entry of g.plan || []) {
        if (!playerTeams[entry.p]) playerTeams[entry.p] = [];
        playerTeams[entry.p].push(entry.team);
      }
      for (const t of tokens.filter(t => t.group_code === g.group_code)) {
        for (const team of playerTeams[t.player_name] || []) {
          if (!teamSubs[team]) teamSubs[team] = [];
          teamSubs[team].push({ token: t.token, group_code: t.group_code, prefs: t.prefs });
        }
      }
    }

    // 3. Fetch current WC matches
    const matchRes = await fetch('https://api.football-data.org/v4/competitions/WC/matches', {
      headers: { 'X-Auth-Token': footballKey },
    });
    if (!matchRes.ok) return res.status(502).json({ error: 'Football API error' });
    const { matches } = await matchRes.json();

    // 4. Load recent notification log to prevent double-sends
    const logs = await sql`
      SELECT group_code, match_id, notif_type FROM notif_log
      WHERE sent_at > NOW() - INTERVAL '48 hours'
    `;
    const logSet = new Set(logs.map(l => `${l.group_code}|${l.match_id ?? ''}|${l.notif_type}`));

    let sent = 0;
    const pushPromises = [];
    const toLog = [];
    const sentThisRun = new Set(); // deduplicate per device within a single run

    for (const m of matches) {
      const { status } = m;
      if (!['IN_PLAY', 'PAUSED', 'FINISHED'].includes(status)) continue;

      const homeTeam  = normTeam(m.homeTeam?.name, m.homeTeam?.tla);
      const awayTeam  = normTeam(m.awayTeam?.name, m.awayTeam?.tla);
      const matchId   = String(m.id);
      const s         = score(m);
      const ht        = htScore(m);

      for (const playerTeam of [homeTeam, awayTeam]) {
        const subs = teamSubs[playerTeam];
        if (!subs?.length) continue;

        let notifType;
        if (status === 'IN_PLAY')  notifType = 'kickoff';
        else if (status === 'PAUSED')   notifType = 'halftime';
        else if (status === 'FINISHED') notifType = 'fulltime';
        else continue;

        // Build notification copy
        let notif;
        if (notifType === 'kickoff')  notif = kickoffCopy(playerTeam, homeTeam, awayTeam);
        if (notifType === 'halftime') notif = halftimeCopy(playerTeam, homeTeam, awayTeam, ht);
        if (notifType === 'fulltime') notif = fulltimeCopy(playerTeam, homeTeam, awayTeam, s);

        for (const sub of subs) {
          const logKey = `${sub.group_code}|${matchId}_${playerTeam}|${notifType}`;
          if (logSet.has(logKey)) continue;

          const prefs = sub.prefs || {};
          if (notifType === 'kickoff'  && prefs.kickoff  === false) continue;
          if (notifType === 'halftime' && prefs.halftime === false) continue;
          if (notifType === 'fulltime' && prefs.fulltime === false) continue;

          // Don't send the same notification twice to the same device in one run
          const deviceKey = `${sub.token}|${matchId}_${playerTeam}|${notifType}`;
          if (sentThisRun.has(deviceKey)) {
            logSet.add(logKey); // still mark as logged so DB stays in sync
            toLog.push({ group_code: sub.group_code, match_id: `${matchId}_${playerTeam}`, notif_type: notifType });
            continue;
          }
          sentThisRun.add(deviceKey);

          pushPromises.push(sendPush(sub.token, notif));
          toLog.push({ group_code: sub.group_code, match_id: `${matchId}_${playerTeam}`, notif_type: notifType });
          logSet.add(logKey);
          sent++;
        }
      }
    }

    await Promise.allSettled(pushPromises);

    for (const entry of toLog) {
      await sql`
        INSERT INTO notif_log (group_code, match_id, notif_type)
        VALUES (${entry.group_code}, ${entry.match_id}, ${entry.notif_type})
        ON CONFLICT DO NOTHING
      `;
    }

    return res.json({ sent, checked: matches.length });
  } catch (err) {
    console.error('[notify-matches]', err);
    return res.status(500).json({ error: err.message });
  }
}
