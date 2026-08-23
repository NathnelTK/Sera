import { NextResponse } from 'next/server'
import { pool } from '@/lib/db'

export const runtime = 'nodejs'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const result = await pool.query(
      `SELECT id, title, company, description, requirements, responsibilities, qualifications, 
              location, salary_min, salary_max, status, created_at, updated_at 
       FROM public.jobs 
       WHERE id = $1`,
      [params.id]
    )

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Job not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(result.rows[0])
  } catch (error) {
    console.error('[Jobs] GET by ID failed', error)
    return NextResponse.json(
      { error: 'Unable to fetch job' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { title, company, description, requirements, responsibilities, qualifications, location, salary_min, salary_max, status } = body

    const result = await pool.query(
      `UPDATE public.jobs 
       SET title = COALESCE($1, title),
           company = COALESCE($2, company),
           description = COALESCE($3, description),
           requirements = COALESCE($4, requirements),
           responsibilities = COALESCE($5, responsibilities),
           qualifications = COALESCE($6, qualifications),
           location = COALESCE($7, location),
           salary_min = COALESCE($8, salary_min),
           salary_max = COALESCE($9, salary_max),
           status = COALESCE($10, status),
           updated_at = NOW()
       WHERE id = $11
       RETURNING *`,
      [title, company, description, requirements, responsibilities, qualifications, location, salary_min, salary_max, status, params.id]
    )

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Job not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(result.rows[0])
  } catch (error) {
    console.error('[Jobs] PUT failed', error)
    return NextResponse.json(
      { error: 'Unable to update job' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const result = await pool.query(
      'DELETE FROM public.jobs WHERE id = $1 RETURNING id',
      [params.id]
    )

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Job not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[Jobs] DELETE failed', error)
    return NextResponse.json(
      { error: 'Unable to delete job' },
      { status: 500 }
    )
  }
}