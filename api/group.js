import { neon } from '@neondatabase/serverless';
import { randomBytes, scrypt, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';

const scryptAsync = promisify(scrypt);

async function hashPin(pin) {
  const salt = randomBytes(16).toString('hex');
  const hash = await scryptAsync(String(pin), salt, 64);
  return `${salt}:${hash.toString('hex')}`;
}

export async function verifyPin(pin, stored) {
  const [salt, hash] = stored.split(':');
  if (!salt || !hash) return stored === String(pin); // legacy plain-text PIN
  const hashBuf = Buffer.from(hash, 'hex');
  const inputHash = await scryptAsync(String(pin), salt, 64);
  return timingSafeEqual(hashBuf, inputHash);
}

function generateCode() {
  // omit confusable chars: 0/O, 1/l/I
  const chars = 'abcdefghjkmnpqrstuvwxyz23456789';
  return Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

async function getDb() {
  const sql = neon(process.env.DATABASE_URL);
  await sql`
    CREATE TABLE IF NOT EXISTS sweepstake_groups (
      group_code   TEXT PRIMARY KEY,
      group_name   TEXT NOT NULL DEFAULT 'Sweepstake',
      entry_price  TEXT NOT NULL DEFAULT '£5',
      player_count INT  NOT NULL DEFAULT 14,
      admin_pin    TEXT NOT NULL,
      completed    BOOLEAN NOT NULL DEFAULT FALSE,
      names        JSONB NOT NULL DEFAULT '[]'::jsonb,
      plan         JSONB NOT NULL DEFAULT '[]'::jsonb,
      idx          INT  NOT NULL DEFAULT 0,
      updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;
  await sql`ALTER TABLE sweepstake_groups ADD COLUMN IF NOT EXISTS player_count INT NOT NULL DEFAULT 14`;
  return sql;
}

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { g: code, pin } = req.query;
    if (!code || !pin) return res.status(400).json({ error: 'Missing code or pin' });
    const sql = await getDb();
    const rows = await sql`SELECT admin_pin FROM sweepstake_groups WHERE group_code = ${code}`;
    if (!rows.length) return res.status(404).json({ error: 'Game not found' });
    const ok = await verifyPin(pin, rows[0].admin_pin);
    if (!ok) return res.status(403).json({ error: 'Incorrect PIN' });
    return res.json({ ok: true });
  }

  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { group_name, entry_price, admin_pin, player_count } = req.body || {};
  if (!admin_pin || String(admin_pin).length < 4) {
    return res.status(400).json({ error: 'PIN must be at least 4 characters' });
  }
  const pc = parseInt(player_count);
  if (!pc || pc < 2 || pc > 48) {
    return res.status(400).json({ error: 'player_count must be between 2 and 48' });
  }

  const sql = await getDb();

  let code;
  for (let i = 0; i < 10; i++) {
    const candidate = generateCode();
    const existing = await sql`SELECT 1 FROM sweepstake_groups WHERE group_code = ${candidate}`;
    if (!existing.length) { code = candidate; break; }
  }
  if (!code) return res.status(500).json({ error: 'Could not generate unique code, try again' });

  const hashedPin = await hashPin(admin_pin);

  await sql`
    INSERT INTO sweepstake_groups (group_code, group_name, entry_price, player_count, admin_pin)
    VALUES (${code}, ${group_name || 'Sweepstake'}, ${entry_price || '£5'}, ${pc}, ${hashedPin})
  `;

  return res.json({ code });
}
