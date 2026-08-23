import { NextResponse } from 'next/server'
import { registerUser } from '@/lib/auth'

export const runtime = 'nodejs'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, password, role } = body

    if (!email || !password || !role) {
      return NextResponse.json(
        { error: 'Email, password, and role are required' },
        { status: 400 }
      )
    }

    if (!['Applicant', 'Recruiter'].includes(role)) {
      return NextResponse.json(
        { error: 'Role must be either Applicant or Recruiter' },
        { status: 400 }
      )
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters long' },
        { status: 400 }
      )
    }

    const user = await registerUser(email, password, role)
    
    return NextResponse.json(
      { 
        user: {
          id: user.id,
          email: user.email,
          role: user.role
        }
      },
      { status: 201 }
    )
  } catch (error: any) {
    console.error('[Auth] Registration failed', error)
    
    if (error.code === '23505') { // Unique violation
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 409 }
      )
    }
    
    return NextResponse.json(
      { error: 'Registration failed' },
      { status: 500 }
    )
  }
}