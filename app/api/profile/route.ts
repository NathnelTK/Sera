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

    if (decoded.role === 'Applicant') {
      const result = await pool.query(
        `SELECT ap.*, u.email, u.created_at as user_created_at,
         (SELECT ARRAY_AGG(json_build_object('name', s.name, 'proficiency', s.proficiency)) 
          FROM public.skills s 
          WHERE s.applicant_profile_id = ap.id) as skills
         FROM public.applicant_profiles ap
         JOIN public.users u ON ap.user_id = u.id
         WHERE ap.user_id = $1`,
        [decoded.userId]
      )

      if (result.rows.length === 0) {
        return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
      }

      return NextResponse.json(result.rows[0])
    } else if (decoded.role === 'Recruiter') {
      const result = await pool.query(
        `SELECT rp.*, u.email, u.created_at as user_created_at
         FROM public.recruiter_profiles rp
         JOIN public.users u ON rp.user_id = u.id
         WHERE rp.user_id = $1`,
        [decoded.userId]
      )

      if (result.rows.length === 0) {
        return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
      }

      return NextResponse.json(result.rows[0])
    }

    return NextResponse.json({ error: 'Invalid role' }, { status: 400 })
  } catch (error) {
    console.error('[Profile] GET failed', error)
    return NextResponse.json({ error: 'Unable to fetch profile' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
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

    const body = await request.json()

    if (decoded.role === 'Applicant') {
      const { name, headline, summary, openToWork, links, skills } = body

      const result = await pool.query(
        `UPDATE public.applicant_profiles 
         SET name = COALESCE($1, name),
             headline = COALESCE($2, headline),
             summary = COALESCE($3, summary),
             open_to_work = COALESCE($4, open_to_work),
             links = COALESCE($5, links),
             updated_at = NOW()
         WHERE user_id = $6
         RETURNING *`,
        [name, headline, summary, openToWork, links, decoded.userId]
      )

      if (result.rows.length === 0) {
        return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
      }

      // Update skills if provided
      if (skills && Array.isArray(skills)) {
        const profileId = result.rows[0].id
        
        // Delete existing skills
        await pool.query('DELETE FROM public.skills WHERE applicant_profile_id = $1', [profileId])
        
        // Insert new skills
        for (const skill of skills) {
          await pool.query(
            `INSERT INTO public.skills (applicant_profile_id, name, proficiency) 
             VALUES ($1, $2, $3)`,
            [profileId, skill.name, skill.proficiency]
          )
        }
      }

      return NextResponse.json(result.rows[0])
    } else if (decoded.role === 'Recruiter') {
      const { name, company, position, contactInfo } = body

      const result = await pool.query(
        `UPDATE public.recruiter_profiles 
         SET name = COALESCE($1, name),
             company = COALESCE($2, company),
             position = COALESCE($3, position),
             contact_info = COALESCE($4, contact_info),
             updated_at = NOW()
         WHERE user_id = $5
         RETURNING *`,
        [name, company, position, contactInfo, decoded.userId]
      )

      if (result.rows.length === 0) {
        return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
      }

      return NextResponse.json(result.rows[0])
    }

    return NextResponse.json({ error: 'Invalid role' }, { status: 400 })
  } catch (error) {
    console.error('[Profile] PUT failed', error)
    return NextResponse.json({ error: 'Unable to update profile' }, { status: 500 })
  }
}