import { neon } from '@neondatabase/serverless';

export default async function handler(req, res) {
  if (req.method !== 'DELETE') return res.status(405).json({ error: 'Method not allowed' });

  const { apple_id } = req.body || {};
  if (!apple_id) return res.status(400).json({ error: 'Missing apple_id' });

  const sql = neon(process.env.DATABASE_URL);
  await sql`
    UPDATE sweepstake_groups
    SET admin_apple_id = NULL
    WHERE admin_apple_id = ${String(apple_id)}
  `;

  return res.json({ ok: true });
}
