import { NextResponse } from 'next/server'
import { pool } from '@/lib/db'
import { verifyAccessToken } from '@/lib/auth'

export const runtime = 'nodejs'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
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

    const result = await pool.query(
      `SELECT a.*, j.title as job_title, j.company as job_company, j.description as job_description,
              j.requirements as job_requirements, j.location as job_location,
              ap.name as applicant_name, ap.headline as applicant_headline, 
              ap.summary as applicant_summary,
              u.email as applicant_email
       FROM public.applications a
       JOIN public.jobs j ON a.job_id = j.id
       JOIN public.users u ON a.applicant_id = u.id
       LEFT JOIN public.applicant_profiles ap ON u.id = ap.user_id
       WHERE a.id = $1`,
      [params.id]
    )

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 })
    }

    // Check if user has access to this application
    const application = result.rows[0]
    if (decoded.role === 'Applicant' && application.applicant_id !== decoded.userId) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    // Get applicant skills
    const skillsResult = await pool.query(
      `SELECT s.name, s.proficiency 
       FROM public.skills s
       JOIN public.applicant_profiles ap ON s.applicant_profile_id = ap.id
       WHERE ap.user_id = $1`,
      [application.applicant_id]
    )

    const applicationWithSkills = {
      ...application,
      skills: skillsResult.rows
    }

    return NextResponse.json(applicationWithSkills)
  } catch (error) {
    console.error('[Applications] GET by ID failed', error)
    return NextResponse.json({ error: 'Unable to fetch application' }, { status: 500 })
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
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
      return NextResponse.json({ error: 'Only recruiters can update application status' }, { status: 403 })
    }

    const body = await request.json()
    const { status } = body

    if (!status || !['Pending', 'Reviewed', 'Shortlisted', 'Rejected', 'Accepted'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
    }

    const result = await pool.query(
      `UPDATE public.applications 
       SET status = $1, updated_at = NOW()
       WHERE id = $2
       RETURNING *`,
      [status, params.id]
    )

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 })
    }

    // Create notification for applicant
    const application = result.rows[0]
    await pool.query(
      `INSERT INTO public.notifications (user_id, title, message, type, related_id) 
       VALUES ($1, $2, $3, $4, $5)`,
      [
        application.applicant_id,
        'Application Status Updated',
        `Your application status has been updated to: ${status}`,
        'Application',
        application.id
      ]
    )

    return NextResponse.json(result.rows[0])
  } catch (error) {
    console.error('[Applications] PUT failed', error)
    return NextResponse.json({ error: 'Unable to update application' }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
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
      return NextResponse.json({ error: 'Only applicants can withdraw applications' }, { status: 403 })
    }

    // Check if application belongs to user and can be withdrawn
    const applicationCheck = await pool.query(
      'SELECT applicant_id, status FROM public.applications WHERE id = $1',
      [params.id]
    )

    if (applicationCheck.rows.length === 0) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 })
    }

    const application = applicationCheck.rows[0]
    if (application.applicant_id !== decoded.userId) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    if (['Accepted', 'Rejected'].includes(application.status)) {
      return NextResponse.json({ error: 'Cannot withdraw application after final decision' }, { status: 400 })
    }

    await pool.query('DELETE FROM public.applications WHERE id = $1', [params.id])

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[Applications] DELETE failed', error)
    return NextResponse.json({ error: 'Unable to withdraw application' }, { status: 500 })
  }
}