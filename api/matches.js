import { createPostHogClient } from '../lib/posthog.js';

export default async function handler(req, res) {
  const key = process.env.FOOTBALL_API_KEY;
  if (!key) return res.status(500).json({ error: 'FOOTBALL_API_KEY not set' });

  const posthog = createPostHogClient();

  try {
    const r = await fetch('https://api.football-data.org/v4/competitions/WC/matches', {
      headers: { 'X-Auth-Token': key }
    });
    if (!r.ok) {
      const text = await r.text();
      posthog.capture({
        distinctId: 'server',
        event: 'matches fetch errored',
        properties: { status: r.status, detail: text.slice(0, 200) },
      });
      return res.status(r.status).json({ error: `API ${r.status}`, detail: text });
    }
    const data = await r.json();
    const matches = (data.matches || []);
    res.setHeader('Cache-Control', 's-maxage=30');
    res.json({ matches, lastUpdated: new Date().toISOString() });
  } catch (err) {
    posthog.captureException(err);
    res.status(500).json({ error: err.message });
  } finally {
    await posthog.shutdown();
  }
}
