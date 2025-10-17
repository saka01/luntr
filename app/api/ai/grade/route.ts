import { NextRequest, NextResponse } from 'next/server'
import { generateMCQRationale, gradePlan } from '@/lib/gemini'
import { checkPlanKeywords, getMCQFallbackRationale } from '@/lib/feedback'
import { ACTIVE_PATTERN } from '@/config/activePattern'

export async function POST(request: NextRequest) {
  try {
    const { mode, pattern, problemSummary, userPlan, checklist } = await request.json()
    
    if (mode === 'mcq') {
      // MCQ rationale generation
      if (pattern !== ACTIVE_PATTERN) {
        return NextResponse.json({ 
          rationale: getMCQFallbackRationale(pattern) 
        })
      }
      
      try {
        const rationale = await generateMCQRationale(pattern, problemSummary)
        return NextResponse.json({ rationale })
      } catch (error) {
        console.error('Gemini MCQ error:', error)
        return NextResponse.json({ 
          rationale: getMCQFallbackRationale(pattern) 
        })
      }
    }
    
    if (mode === 'plan') {
      // Plan grading
      try {
        const result = await gradePlan(problemSummary, userPlan, checklist)
        return NextResponse.json(result)
      } catch (error) {
        console.error('Gemini plan grading error:', error)
        // Fallback to keyword checking
        const fallback = checkPlanKeywords(userPlan, checklist)
        return NextResponse.json({
          score_0_5: fallback.score,
          brief_feedback: fallback.feedback
        })
      }
    }
    
    return NextResponse.json({ error: 'Invalid mode' }, { status: 400 })
  } catch (error) {
    console.error('AI grading error:', error)
    return NextResponse.json({ error: 'Failed to grade' }, { status: 500 })
  }
}