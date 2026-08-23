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
    const { resumeText } = body

    if (!resumeText) {
      return NextResponse.json({ error: 'Resume text is required' }, { status: 400 })
    }

    // Simulated AI analysis (in a real implementation, this would call an AI service)
    const analysis = {
      summary: 'This resume shows a strong technical background with relevant experience.',
      strengths: [
        'Strong technical skills in relevant technologies',
        'Clear career progression',
        'Good educational background'
      ],
      weaknesses: [
        'Could benefit from more quantifiable achievements',
        'Consider adding more soft skills examples'
      ],
      suggestions: [
        'Add specific metrics to demonstrate impact',
        'Include relevant certifications',
        'Highlight leadership experience'
      ],
      score: 75
    }

    return NextResponse.json(analysis)
  } catch (error) {
    console.error('[AI] Resume analysis failed', error)
    return NextResponse.json({ error: 'Unable to analyze resume' }, { status: 500 })
  }
}