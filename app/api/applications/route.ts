import { NextResponse } from 'next/server'
import { pool } from '@/lib/db'
import { verifyAccessToken } from '@/lib/auth'

export const runtime = 'nodejs'

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const token = authHeader.substring(7)
    const decoded = verifyAccessToken(token)
    if (!decoded) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const applicantId = searchParams.get('applicantId')
    const jobId = searchParams.get('jobId')

    let query = `
      SELECT a.*, j.title as job_title, j.company as job_company, 
             u.name as applicant_name, u.email as applicant_email
      FROM public.applications a
      JOIN public.jobs j ON a.job_id = j.id
      JOIN public.users u ON a.applicant_id = u.id
    `
    const params: any[] = []
    const conditions: string[] = []

    if (applicantId) {
      conditions.push('a.applicant_id = $' + (params.length + 1))
      params.push(applicantId)
    }

    if (jobId) {
      conditions.push('a.job_id = $' + (params.length + 1))
      params.push(jobId)
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ')
    }

    query += ' ORDER BY a.submitted_at DESC'

    const result = await pool.query(query, params)
    return NextResponse.json({ items: result.rows, total: result.rowCount ?? 0 })
  } catch (error) {
    console.error('[Applications] GET failed', error)
    return NextResponse.json(
      { error: 'Unable to fetch applications' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const token = authHeader.substring(7)
    const decoded = verifyAccessToken(token)
    if (!decoded) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    if (decoded.role !== 'Applicant') {
      return NextResponse.json({ error: 'Only applicants can submit applications' }, { status: 403 })
    }

    const body = await request.json()
    const { jobId, coverLetter } = body

    if (!jobId) {
      return NextResponse.json({ error: 'Job ID is required' }, { status: 400 })
    }

    // Check if job is published
    const jobCheck = await pool.query(
      'SELECT status FROM public.jobs WHERE id = $1',
      [jobId]
    )

    if (jobCheck.rows.length === 0) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 })
    }

    if (jobCheck.rows[0].status !== 'Published') {
      return NextResponse.json({ error: 'Job is not accepting applications' }, { status: 400 })
    }

    const result = await pool.query(
      `INSERT INTO public.applications (job_id, applicant_id, cover_letter, status) 
       VALUES ($1, $2, $3, 'Pending') 
       RETURNING *`,
      [jobId, decoded.userId, coverLetter]
    )

    // Create notification for recruiter
    const job = await pool.query('SELECT recruiter_id FROM public.jobs WHERE id = $1', [jobId])
    if (job.rows.length > 0) {
      await pool.query(
        `INSERT INTO public.notifications (user_id, title, message, type, related_id) 
         VALUES ($1, $2, $3, $4, $5)`,
        [
          job.rows[0].recruiter_id,
          'New Application Received',
          'A new application has been submitted for your job posting.',
          'Application',
          result.rows[0].id
        ]
      )
    }

    return NextResponse.json(result.rows[0], { status: 201 })
  } catch (error: any) {
    console.error('[Applications] POST failed', error)
    
    if (error.code === '23505') { // Unique violation
      return NextResponse.json(
        { error: 'You have already applied for this job' },
        { status: 409 }
      )
    }
    
    return NextResponse.json(
      { error: 'Unable to submit application' },
      { status: 500 }
    )
  }
}