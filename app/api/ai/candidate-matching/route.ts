import { NextResponse } from 'next/server'
import { verifyAccessToken } from '@/lib/auth'

export const runtime = 'nodejs'

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

    const body = await request.json()
    const { candidateProfile, jobDescription } = body

    if (!candidateProfile || !jobDescription) {
      return NextResponse.json({ error: 'Candidate profile and job description are required' }, { status: 400 })
    }

    // Simulated AI matching (in a real implementation, this would call an AI service)
    const matching = {
      score: 82,
      insights: [
        'Strong match in technical skills',
        'Good alignment with required experience',
        'Education meets requirements'
      ],
      gaps: [
        'Could add more experience with specific tools mentioned in job',
        'Consider highlighting relevant projects'
      ],
      recommendation: 'Strong candidate worth interviewing'
    }

    return NextResponse.json(matching)
  } catch (error) {
    console.error('[AI] Candidate matching failed', error)
    return NextResponse.json({ error: 'Unable to match candidate' }, { status: 500 })
  }
}