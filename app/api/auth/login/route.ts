import { NextResponse } from 'next/server'
import { loginUser } from '@/lib/auth'

export const runtime = 'nodejs'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    const result = await loginUser(email, password)
    
    if (!result) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    return NextResponse.json({
      user: result.user,
      tokens: result.tokens
    })
  } catch (error) {
    console.error('[Auth] Login failed', error)
    return NextResponse.json(
      { error: 'Login failed' },
      { status: 500 }
    )
  }
}