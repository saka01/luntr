import { NextRequest, NextResponse } from 'next/server'
import { generateMCQRationale, gradePlan } from '@/lib/gemini'
import { getFallbackMCQRationale, getFallbackPlanGrade } from '@/lib/feedback'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { mode, pattern, problemSummary, userPlan, checklist } = body

    if (mode === 'mcq') {
      try {
        const rationale = await generateMCQRationale(pattern, problemSummary)
        return NextResponse.json({ rationale })
      } catch (error) {
        console.error('LLM failed for MCQ, using fallback:', error)
        const rationale = getFallbackMCQRationale(pattern)
        return NextResponse.json({ rationale })
      }
    }

    if (mode === 'plan') {
      try {
        const result = await gradePlan(problemSummary, userPlan, checklist)
        return NextResponse.json(result)
      } catch (error) {
        console.error('LLM failed for plan, using fallback:', error)
        const result = getFallbackPlanGrade(userPlan, checklist)
        return NextResponse.json(result)
      }
    }

    return NextResponse.json({ error: 'Invalid mode' }, { status: 400 })
  } catch (error) {
    console.error('AI grading error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
