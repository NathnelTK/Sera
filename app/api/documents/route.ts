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

    if (decoded.role !== 'Applicant') {
      return NextResponse.json({ error: 'Only applicants can access documents' }, { status: 403 })
    }

    const result = await pool.query(
      'SELECT id, name, file_url, file_type, file_size, document_type, uploaded_at FROM public.documents WHERE applicant_id = $1 ORDER BY uploaded_at DESC',
      [decoded.userId]
    )

    return NextResponse.json({ items: result.rows, total: result.rowCount ?? 0 })
  } catch (error) {
    console.error('[Documents] GET failed', error)
    return NextResponse.json({ error: 'Unable to fetch documents' }, { status: 500 })
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
      return NextResponse.json({ error: 'Only applicants can upload documents' }, { status: 403 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File
    const documentType = formData.get('documentType') as string

    if (!file) {
      return NextResponse.json({ error: 'File is required' }, { status: 400 })
    }

    if (!documentType || !['CV', 'Certificate', 'Other'].includes(documentType)) {
      return NextResponse.json({ error: 'Valid document type is required' }, { status: 400 })
    }

    // In a real implementation, you would upload the file to a storage service
    // For now, we'll use a placeholder URL
    const fileUrl = `https://example.com/documents/${decoded.userId}/${file.name}`
    const fileSize = file.size

    const result = await pool.query(
      `INSERT INTO public.documents (applicant_id, name, file_url, file_type, file_size, document_type) 
       VALUES ($1, $2, $3, $4, $5, $6) 
       RETURNING *`,
      [decoded.userId, file.name, fileUrl, file.type, fileSize, documentType]
    )

    return NextResponse.json(result.rows[0], { status: 201 })
  } catch (error) {
    console.error('[Documents] POST failed', error)
    return NextResponse.json({ error: 'Unable to upload document' }, { status: 500 })
  }
}