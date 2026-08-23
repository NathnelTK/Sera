import { NextResponse } from 'next/server'
import { pool } from '@/lib/db'

export const runtime = 'nodejs'

export async function GET() {
  try {
    await pool.query('SELECT 1')
    return NextResponse.json({ status: 'ok', database: 'connected', timestamp: new Date().toISOString() })
  } catch (error) {
    console.error('[v0] health database check failed', error)
    return NextResponse.json({ status: 'error', database: 'unavailable' }, { status: 503 })
  }
}
