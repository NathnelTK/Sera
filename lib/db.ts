import { Pool } from 'pg'

const globalForDb = globalThis as unknown as { talentOsPool?: Pool }

export const pool = globalForDb.talentOsPool ?? new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  max: 5,
})

if (process.env.NODE_ENV !== 'production') globalForDb.talentOsPool = pool

export async function ensureJobsTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS public.jobs (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      title TEXT NOT NULL,
      company TEXT NOT NULL,
      location TEXT NOT NULL DEFAULT 'Remote',
      status TEXT NOT NULL DEFAULT 'Draft',
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `)

  const result = await pool.query('SELECT COUNT(*)::int AS count FROM public.jobs')
  if (result.rows[0].count === 0) {
    await pool.query(
      `INSERT INTO public.jobs (title, company, location, status) VALUES
       ($1, $2, $3, $4), ($5, $6, $7, $8)`,
      [
        'Senior Product Designer', 'TalentOS Labs', 'Remote', 'Published',
        'Full-stack Engineer', 'Northstar Health', 'New York, NY', 'Published',
      ],
    )
  }
}
