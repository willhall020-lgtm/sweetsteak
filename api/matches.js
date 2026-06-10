const TEST_MATCHES = [
  {
    status: 'FINISHED', stage: 'GROUP_STAGE',
    homeTeam: { name: 'Spain',   tla: 'ESP' },
    awayTeam: { name: 'Germany', tla: 'GER' },
    score: { fullTime: { home: 3, away: 1 }, penalties: { home: null, away: null } }
  },
  {
    status: 'FINISHED', stage: 'GROUP_STAGE',
    homeTeam: { name: 'Brazil', tla: 'BRA' },
    awayTeam: { name: 'Canada', tla: 'CAN' },
    score: { fullTime: { home: 2, away: 0 }, penalties: { home: null, away: null } }
  },
  {
    status: 'FINISHED', stage: 'GROUP_STAGE',
    homeTeam: { name: 'England',   tla: 'ENG' },
    awayTeam: { name: 'Argentina', tla: 'ARG' },
    score: { fullTime: { home: 2, away: 1 }, penalties: { home: null, away: null } }
  }
];

export default async function handler(req, res) {
  const key = process.env.FOOTBALL_API_KEY;
  if (!key) return res.status(500).json({ error: 'FOOTBALL_API_KEY not set' });

  try {
    const r = await fetch('https://api.football-data.org/v4/competitions/WC/matches', {
      headers: { 'X-Auth-Token': key }
    });
    if (!r.ok) {
      const text = await r.text();
      return res.status(r.status).json({ error: `API ${r.status}`, detail: text });
    }
    const data = await r.json();
    const realMatches = (data.matches || []).filter(m => m.status === 'FINISHED');
    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=120');
    res.json({ matches: [...TEST_MATCHES, ...realMatches], lastUpdated: new Date().toISOString() });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
