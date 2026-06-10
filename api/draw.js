import { neon } from '@neondatabase/serverless';

async function getDb() {
  const sql = neon(process.env.DATABASE_URL);
  await sql`
    CREATE TABLE IF NOT EXISTS sweepstake_groups (
      group_code  TEXT PRIMARY KEY,
      group_name  TEXT NOT NULL DEFAULT 'Sweepstake',
      entry_price TEXT NOT NULL DEFAULT '£5',
      admin_pin   TEXT NOT NULL DEFAULT 'admin',
      completed   BOOLEAN NOT NULL DEFAULT FALSE,
      names       JSONB NOT NULL DEFAULT '[]'::jsonb,
      plan        JSONB NOT NULL DEFAULT '[]'::jsonb,
      idx         INT  NOT NULL DEFAULT 0,
      updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;
  return sql;
}

async function authOk(req, sql, code) {
  const pin = req.headers['x-admin-pin'];
  if (!pin) return false;
  const rows = await sql`SELECT admin_pin FROM sweepstake_groups WHERE group_code = ${code}`;
  if (!rows.length) return false;
  return rows[0].admin_pin === pin;
}

export default async function handler(req, res) {
  const code = req.query.g;
  if (!code) return res.status(400).json({ error: 'Missing group code (?g=)' });

  const sql = await getDb();

  if (req.method === 'GET') {
    const rows = await sql`
      SELECT completed, names, plan, idx, group_name, entry_price
      FROM sweepstake_groups WHERE group_code = ${code}
    `;
    if (!rows.length) return res.status(404).json({ error: 'Group not found' });
    const { completed, names, plan, idx, group_name, entry_price } = rows[0];
    return res.json({ completed, names, plan, idx, group_name, entry_price });
  }

  if (req.method === 'POST') {
    if (!await authOk(req, sql, code)) return res.status(401).json({ error: 'Invalid PIN' });
    const { completed, names, plan, idx } = req.body;
    await sql`
      UPDATE sweepstake_groups SET
        completed  = ${completed},
        names      = ${JSON.stringify(names)}::jsonb,
        plan       = ${JSON.stringify(plan)}::jsonb,
        idx        = ${idx},
        updated_at = NOW()
      WHERE group_code = ${code}
    `;
    return res.json({ ok: true });
  }

  if (req.method === 'DELETE') {
    if (!await authOk(req, sql, code)) return res.status(401).json({ error: 'Invalid PIN' });
    await sql`DELETE FROM sweepstake_groups WHERE group_code = ${code}`;
    return res.json({ ok: true });
  }

  res.status(405).json({ error: 'Method not allowed' });
}
