import { NextResponse } from 'next/server'
import { pool } from '@/lib/db'
import { verifyAccessToken } from '@/lib/auth'

export const runtime = 'nodejs'

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
      return NextResponse.json({ error: 'Only recruiters can update interviews' }, { status: 403 })
    }

    const body = await request.json()
    const { scheduledDate, duration, status, notes } = body

    if (scheduledDate) {
      const interviewDate = new Date(scheduledDate)
      if (interviewDate < new Date()) {
        return NextResponse.json({ error: 'Cannot schedule interview in the past' }, { status: 400 })
      }
    }

    const result = await pool.query(
      `UPDATE public.interviews 
       SET scheduled_date = COALESCE($1, scheduled_date),
           duration = COALESCE($2, duration),
           status = COALESCE($3, status),
           notes = COALESCE($4, notes),
           updated_at = NOW()
       WHERE id = $5
       RETURNING *`,
      [scheduledDate, duration, status, notes, params.id]
    )

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Interview not found' }, { status: 404 })
    }

    // Create notification for applicant if interview was rescheduled
    if (scheduledDate || status === 'Rescheduled') {
      const interview = result.rows[0]
      await pool.query(
        `INSERT INTO public.notifications (user_id, title, message, type, related_id) 
         VALUES ($1, $2, $3, $4, $5)`,
        [
          interview.applicant_id,
          'Interview Updated',
          `Your interview has been updated${scheduledDate ? ` to ${new Date(scheduledDate).toLocaleDateString()}` : ''}`,
          'Interview',
          interview.id
        ]
      )
    }

    return NextResponse.json(result.rows[0])
  } catch (error) {
    console.error('[Interviews] PUT failed', error)
    return NextResponse.json({ error: 'Unable to update interview' }, { status: 500 })
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

    if (decoded.role !== 'Recruiter') {
      return NextResponse.json({ error: 'Only recruiters can cancel interviews' }, { status: 403 })
    }

    // Get interview details before deletion
    const interviewCheck = await pool.query(
      'SELECT applicant_id FROM public.interviews WHERE id = $1',
      [params.id]
    )

    if (interviewCheck.rows.length === 0) {
      return NextResponse.json({ error: 'Interview not found' }, { status: 404 })
    }

    const applicantId = interviewCheck.rows[0].applicant_id

    await pool.query(
      'UPDATE public.interviews SET status = $1, updated_at = NOW() WHERE id = $2',
      ['Cancelled', params.id]
    )

    // Create notification for applicant
    await pool.query(
      `INSERT INTO public.notifications (user_id, title, message, type, related_id) 
       VALUES ($1, $2, $3, $4, $5)`,
      [
        applicantId,
        'Interview Cancelled',
        'Your scheduled interview has been cancelled',
        'Interview',
        params.id
      ]
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[Interviews] DELETE failed', error)
    return NextResponse.json({ error: 'Unable to cancel interview' }, { status: 500 })
  }
}