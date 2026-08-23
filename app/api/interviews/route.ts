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
    const recruiterId = searchParams.get('recruiterId')

    let query = `
      SELECT i.*, j.title as job_title, j.company as job_company,
             ap.name as applicant_name, ap.email as applicant_email,
             rp.name as recruiter_name, rp.company as recruiter_company
      FROM public.interviews i
      JOIN public.jobs j ON i.job_id = j.id
      JOIN public.users ap ON i.applicant_id = ap.id
      JOIN public.users rp ON i.recruiter_id = rp.id
    `
    const params: any[] = []
    const conditions: string[] = []

    if (decoded.role === 'Applicant') {
      conditions.push('i.applicant_id = $' + (params.length + 1))
      params.push(decoded.userId)
    } else if (decoded.role === 'Recruiter') {
      conditions.push('i.recruiter_id = $' + (params.length + 1))
      params.push(decoded.userId)
    }

    if (applicantId) {
      conditions.push('i.applicant_id = $' + (params.length + 1))
      params.push(applicantId)
    }

    if (recruiterId) {
      conditions.push('i.recruiter_id = $' + (params.length + 1))
      params.push(recruiterId)
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ')
    }

    query += ' ORDER BY i.scheduled_date ASC'

    const result = await pool.query(query, params)
    return NextResponse.json({ items: result.rows, total: result.rowCount ?? 0 })
  } catch (error) {
    console.error('[Interviews] GET failed', error)
    return NextResponse.json({ error: 'Unable to fetch interviews' }, { status: 500 })
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

    if (decoded.role !== 'Recruiter') {
      return NextResponse.json({ error: 'Only recruiters can schedule interviews' }, { status: 403 })
    }

    const body = await request.json()
    const { applicationId, jobId, applicantId, scheduledDate, duration, notes } = body

    if (!applicationId || !jobId || !applicantId || !scheduledDate) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const interviewDate = new Date(scheduledDate)
    if (interviewDate < new Date()) {
      return NextResponse.json({ error: 'Cannot schedule interview in the past' }, { status: 400 })
    }

    const result = await pool.query(
      `INSERT INTO public.interviews (application_id, job_id, applicant_id, recruiter_id, scheduled_date, duration, status, notes) 
       VALUES ($1, $2, $3, $4, $5, $6, 'Scheduled', $7) 
       RETURNING *`,
      [applicationId, jobId, applicantId, decoded.userId, scheduledDate, duration || 60, notes]
    )

    // Create notification for applicant
    await pool.query(
      `INSERT INTO public.notifications (user_id, title, message, type, related_id) 
       VALUES ($1, $2, $3, $4, $5)`,
      [
        applicantId,
        'Interview Scheduled',
        `You have an interview scheduled on ${new Date(scheduledDate).toLocaleDateString()}`,
        'Interview',
        result.rows[0].id
      ]
    )

    return NextResponse.json(result.rows[0], { status: 201 })
  } catch (error) {
    console.error('[Interviews] POST failed', error)
    return NextResponse.json({ error: 'Unable to schedule interview' }, { status: 500 })
  }
}