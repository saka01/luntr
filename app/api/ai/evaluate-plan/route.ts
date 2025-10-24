import { NextRequest, NextResponse } from 'next/server'
import { evaluatePlan } from '@/lib/gemini'

export async function POST(request: NextRequest) {
  try {
    const { checklist, userPlan } = await request.json()
    
    if (!checklist || !Array.isArray(checklist) || !userPlan || typeof userPlan !== 'string') {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
    }

    // Try Gemini evaluation first
    try {
      const result = await evaluatePlan(checklist, userPlan)
      const correct = result.coverage >= 0.7
      
      return NextResponse.json({
        matched: result.matched,
        missing: result.missing,
        coverage: result.coverage,
        explanation: result.explanation,
        correct,
        method: 'gemini'
      })
    } catch (geminiError) {
      console.error('Gemini evaluation failed, falling back to keyword matching:', geminiError)
      
      // Fallback to keyword matching
      const norm = (s: string) => s.trim().toLowerCase()
      const lines = userPlan.split('\n').map(norm).filter(Boolean)
      
      const covered = checklist.map(item => {
        const terms = norm(item).split(/\s+/).slice(0, 3).join(' ')
        return lines.some(l => l.includes(terms))
      })
      
      const coverage = covered.filter(Boolean).length / checklist.length
      const missing = checklist.filter((_, i) => !covered[i])
      const matched = checklist.filter((_, i) => covered[i])
      const correct = coverage >= 0.7
      
      return NextResponse.json({
        matched,
        missing,
        coverage,
        explanation: 'Good effort! Keep practicing.',
        correct,
        method: 'fallback'
      })
    }
  } catch (error) {
    console.error('Error evaluating plan:', error)
    return NextResponse.json({ error: 'Failed to evaluate plan' }, { status: 500 })
  }
}
