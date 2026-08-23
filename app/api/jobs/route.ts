import { NextResponse } from 'next/server'
import { ensureJobsTable, pool } from '@/lib/db'

export const runtime = 'nodejs'

export async function GET() {
  try {
    await ensureJobsTable()
    const result = await pool.query(
      'SELECT id, title, company, location, status, created_at FROM public.jobs ORDER BY created_at DESC',
    )
    return NextResponse.json({ items: result.rows, total: result.rowCount ?? 0 })
  } catch (error) {
    console.error('[v0] jobs GET failed', error)
    return NextResponse.json({ error: 'Unable to read jobs from the database' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null)
  const title = typeof body?.title === 'string' ? body.title.trim() : ''
  const company = typeof body?.company === 'string' ? body.company.trim() : ''
  const location = typeof body?.location === 'string' && body.location.trim() ? body.location.trim() : 'Remote'

  if (!title || !company) {
    return NextResponse.json({ error: 'title and company are required' }, { status: 400 })
  }

  try {
    await ensureJobsTable()
    const result = await pool.query(
      `INSERT INTO public.jobs (title, company, location, status)
       VALUES ($1, $2, $3, 'Draft')
       RETURNING id, title, company, location, status, created_at`,
      [title, company, location],
    )
    return NextResponse.json(result.rows[0], { status: 201 })
  } catch (error) {
    console.error('[v0] jobs POST failed', error)
    return NextResponse.json({ error: 'Unable to create job in the database' }, { status: 500 })
  }
}
