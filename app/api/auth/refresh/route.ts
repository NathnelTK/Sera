import { NextResponse } from 'next/server'
import { refreshAccessToken } from '@/lib/auth'

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

    const accessToken = await refreshAccessToken(refreshToken)
    
    if (!accessToken) {
      return NextResponse.json(
        { error: 'Invalid or expired refresh token' },
        { status: 401 }
      )
    }

    return NextResponse.json({ accessToken })
  } catch (error) {
    console.error('[Auth] Token refresh failed', error)
    return NextResponse.json(
      { error: 'Token refresh failed' },
      { status: 500 }
    )
  }
}