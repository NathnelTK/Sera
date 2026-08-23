import { NextResponse } from 'next/server'
import { pool } from '@/lib/db'
import { verifyAccessToken } from '@/lib/auth'

export const runtime = 'nodejs'

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
      return NextResponse.json({ error: 'Only applicants can delete documents' }, { status: 403 })
    }

    // Check if document belongs to user
    const documentCheck = await pool.query(
      'SELECT applicant_id FROM public.documents WHERE id = $1',
      [params.id]
    )

    if (documentCheck.rows.length === 0) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 })
    }

    if (documentCheck.rows[0].applicant_id !== decoded.userId) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    await pool.query('DELETE FROM public.documents WHERE id = $1', [params.id])

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[Documents] DELETE failed', error)
    return NextResponse.json({ error: 'Unable to delete document' }, { status: 500 })
  }
}