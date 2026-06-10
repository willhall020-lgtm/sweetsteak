import { neon } from '@neondatabase/serverless';

async function getDb() {
  const sql = neon(process.env.DATABASE_URL);
  await sql`
    CREATE TABLE IF NOT EXISTS sweepstake_draw (
      id  INT PRIMARY KEY DEFAULT 1,
      completed BOOLEAN NOT NULL DEFAULT FALSE,
      names JSONB NOT NULL DEFAULT '[]'::jsonb,
      plan  JSONB NOT NULL DEFAULT '[]'::jsonb,
      idx   INT  NOT NULL DEFAULT 0,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;
  return sql;
}

function authOk(req) {
  return req.headers['x-admin-pin'] === process.env.ADMIN_PIN;
}

export default async function handler(req, res) {
  const sql = await getDb();

  if (req.method === 'GET') {
    const rows = await sql`SELECT completed, names, plan, idx FROM sweepstake_draw WHERE id = 1`;
    if (!rows.length) return res.json({ completed: false, names: [], plan: [], idx: 0 });
    const { completed, names, plan, idx } = rows[0];
    return res.json({ completed, names, plan, idx });
  }

  if (req.method === 'POST') {
    if (!authOk(req)) return res.status(401).json({ error: 'Invalid PIN' });
    const { completed, names, plan, idx } = req.body;
    await sql`
      INSERT INTO sweepstake_draw (id, completed, names, plan, idx, updated_at)
      VALUES (1, ${completed}, ${JSON.stringify(names)}::jsonb, ${JSON.stringify(plan)}::jsonb, ${idx}, NOW())
      ON CONFLICT (id) DO UPDATE SET
        completed   = EXCLUDED.completed,
        names       = EXCLUDED.names,
        plan        = EXCLUDED.plan,
        idx         = EXCLUDED.idx,
        updated_at  = EXCLUDED.updated_at
    `;
    return res.json({ ok: true });
  }

  if (req.method === 'DELETE') {
    if (!authOk(req)) return res.status(401).json({ error: 'Invalid PIN' });
    await sql`DELETE FROM sweepstake_draw WHERE id = 1`;
    return res.json({ ok: true });
  }

  res.status(405).json({ error: 'Method not allowed' });
}
