import { normTeam, TIER_MAP, TIER_RANK } from './team-data.js';

const API_STAGE = {
  GROUP_STAGE: 'group', ROUND_OF_32: 'r32', LAST_32: 'r32',
  ROUND_OF_16: 'r16', LAST_16: 'r16',
  QUARTER_FINALS: 'qf', SEMI_FINALS: 'sf',
  THIRD_PLACE: '3rd', THIRD_PLACE_MATCH: '3rd', FINAL: 'final',
};

const PROG_ORDER = ['r32', 'r16', 'qf', 'sf', 'final', 'champion'];
const PROG_PTS   = { r32: 1, r16: 2, qf: 3, sf: 4, final: 5, champion: 5 };

export function normalizeMatch(m) {
  const homeTeam = normTeam(m.homeTeam?.name, m.homeTeam?.tla);
  const awayTeam = normTeam(m.awayTeam?.name, m.awayTeam?.tla);
  const homeGoals = m.score?.fullTime?.home ?? m.score?.regularTime?.home ?? 0;
  const awayGoals = m.score?.fullTime?.away ?? m.score?.regularTime?.away ?? 0;
  const stage = API_STAGE[m.stage] || 'group';
  const ph = m.score?.penalties?.home, pa = m.score?.penalties?.away;
  const penaltyWinner = (ph != null && pa != null)
    ? (ph > pa ? homeTeam : awayTeam)
    : null;
  return { homeTeam, awayTeam, homeGoals, awayGoals, stage, penaltyWinner };
}

function computeProgress(matches) {
  const prog = {};
  const set_ = (team, stage) => {
    if (!prog[team] || PROG_ORDER.indexOf(stage) > PROG_ORDER.indexOf(prog[team])) prog[team] = stage;
  };
  for (const m of matches) {
    const { homeTeam, awayTeam, homeGoals, awayGoals, stage, penaltyWinner } = m;
    if (stage === 'group' || stage === '3rd') continue;
    set_(homeTeam, stage); set_(awayTeam, stage);
    let winner = null;
    if (homeGoals > awayGoals)      winner = homeTeam;
    else if (awayGoals > homeGoals) winner = awayTeam;
    else if (penaltyWinner)         winner = penaltyWinner;
    if (winner) {
      if (stage === 'r32')    set_(winner, 'r16');
      else if (stage === 'r16') set_(winner, 'qf');
      else if (stage === 'qf')  set_(winner, 'sf');
      else if (stage === 'sf')  set_(winner, 'final');
      else if (stage === 'final') set_(winner, 'champion');
    }
  }
  return prog;
}

// assignments: { playerName: [team, ...] }
// matches: normalised match objects (FINISHED only)
export function computeScores(assignments, matches) {
  const scores = {};
  for (const p of Object.keys(assignments)) {
    scores[p] = { goals: 0, wins: 0, matchPts: 0, progressPts: 0, bonusPts: 0, total: 0 };
  }

  const t2p = {};
  for (const [player, teams] of Object.entries(assignments))
    for (const team of teams) if (team) t2p[team] = player;

  for (const m of matches) {
    const { homeTeam, awayTeam, homeGoals, awayGoals, stage, penaltyWinner } = m;
    const hp = t2p[homeTeam], ap = t2p[awayTeam];
    const isKO = stage !== 'group';

    if (hp) scores[hp].goals += homeGoals;
    if (ap) scores[ap].goals += awayGoals;

    let winner = null, loser = null;
    if (homeGoals > awayGoals)       { winner = homeTeam; loser = awayTeam; }
    else if (awayGoals > homeGoals)  { winner = awayTeam; loser = homeTeam; }
    else if (penaltyWinner)          { winner = penaltyWinner; loser = (penaltyWinner === homeTeam ? awayTeam : homeTeam); }

    if (winner) {
      const wp = t2p[winner];
      if (wp) {
        scores[wp].wins += 1;
        scores[wp].matchPts += 3;
        const tierDiff = TIER_RANK[TIER_MAP[winner]] - TIER_RANK[TIER_MAP[loser]];
        if (tierDiff >= 3)      scores[wp].bonusPts += 10;
        else if (tierDiff >= 2) scores[wp].bonusPts += 6;
        else if (tierDiff >= 1) scores[wp].bonusPts += 3;
      }
    } else if (!isKO) {
      if (hp) scores[hp].matchPts += 1;
      if (ap) scores[ap].matchPts += 1;
    }
  }

  const prog = computeProgress(matches);
  for (const [team, stage] of Object.entries(prog)) {
    const player = t2p[team];
    if (!player) continue;
    for (const ms of PROG_ORDER) {
      if (PROG_PTS[ms]) scores[player].progressPts += PROG_PTS[ms];
      if (ms === stage) break;
    }
  }

  for (const s of Object.values(scores)) s.total = s.goals + s.matchPts + s.progressPts + s.bonusPts;
  return scores;
}
