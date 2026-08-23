import { NextResponse } from 'next/server'
import { logout } from '@/lib/auth'

export const runtime = 'nodejs'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { refreshToken } = body

    if (!refreshToken) {
      return NextResponse.json(
        { error: 'Refresh token is required' },
        { status: 400 }
      )
    }

    await logout(refreshToken)
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[Auth] Logout failed', error)
    return NextResponse.json(
      { error: 'Logout failed' },
      { status: 500 }
    )
  }
}