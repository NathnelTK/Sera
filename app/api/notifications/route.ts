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
    const unreadOnly = searchParams.get('unreadOnly') === 'true'

    let query = `
      SELECT id, title, message, type, related_id, is_read, created_at 
      FROM public.notifications 
      WHERE user_id = $1
    `
    const params: any[] = [decoded.userId]

    if (unreadOnly) {
      query += ' AND is_read = false'
    }

    query += ' ORDER BY created_at DESC'

    const result = await pool.query(query, params)
    return NextResponse.json({ items: result.rows, total: result.rowCount ?? 0 })
  } catch (error) {
    console.error('[Notifications] GET failed', error)
    return NextResponse.json({ error: 'Unable to fetch notifications' }, { status: 500 })
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
    const { notificationIds, markAsRead } = body

    if (!notificationIds || !Array.isArray(notificationIds)) {
      return NextResponse.json({ error: 'Notification IDs are required' }, { status: 400 })
    }

    if (markAsRead) {
      await pool.query(
        `UPDATE public.notifications 
         SET is_read = true 
         WHERE id = ANY($1) AND user_id = $2`,
        [notificationIds, decoded.userId]
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[Notifications] PUT failed', error)
    return NextResponse.json({ error: 'Unable to update notifications' }, { status: 500 })
  }
}