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
    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=120');
    res.json({ matches: data.matches || [], lastUpdated: new Date().toISOString() });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
