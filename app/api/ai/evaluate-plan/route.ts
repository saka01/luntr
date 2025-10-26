import { NextRequest, NextResponse } from 'next/server'
import { evaluatePlan } from '@/lib/gemini'

// Simple in-memory cache for plan evaluations
const planCache = new Map<string, any>()
const CACHE_TTL = 5 * 60 * 1000 // 5 minutes

function getCacheKey(checklist: string[], userPlan: string): string {
  const normalizedChecklist = checklist.map(item => item.trim().toLowerCase()).sort().join('|')
  const normalizedPlan = userPlan.trim().toLowerCase()
  return `${normalizedChecklist}::${normalizedPlan}`
}

function getCachedResult(key: string): any | null {
  const cached = planCache.get(key)
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.result
  }
  planCache.delete(key)
  return null
}

function setCachedResult(key: string, result: any): void {
  planCache.set(key, {
    result,
    timestamp: Date.now()
  })
  
  // Clean up old entries periodically
  if (planCache.size > 100) {
    const now = Date.now()
    for (const [k, v] of planCache.entries()) {
      if (now - v.timestamp > CACHE_TTL) {
        planCache.delete(k)
      }
    }
  }
}

export async function POST(request: NextRequest) {
  try {
    const { checklist, userPlan } = await request.json()
    
    if (!checklist || !Array.isArray(checklist) || !userPlan || typeof userPlan !== 'string') {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
    }

    // Check cache first
    const cacheKey = getCacheKey(checklist, userPlan)
    const cachedResult = getCachedResult(cacheKey)
    if (cachedResult) {
      return NextResponse.json({
        ...cachedResult,
        method: 'cached'
      })
    }

    // Use Gemini evaluation
    const result = await evaluatePlan(checklist, userPlan)
    const correct = result.coverage >= 0.7
    
    const response = {
      matched: result.matched,
      missing: result.missing,
      coverage: result.coverage,
      explanation: result.explanation,
      correct,
      method: 'gemini'
    }
    
    // Cache the result
    setCachedResult(cacheKey, response)
    
    return NextResponse.json(response)
  } catch (error) {
    console.error('Error evaluating plan:', error)
    console.error('Error details:', error instanceof Error ? error.message : 'Unknown error')
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack')
    return NextResponse.json({ 
      error: 'Failed to evaluate plan',
      details: error instanceof Error ? error.message : 'Unknown error',
      correct: false,
      coverage: 0,
      matched: [],
      missing: [],
      explanation: 'Sorry, there was an error evaluating your plan. Please try again.',
      method: 'error'
    }, { status: 500 })
  }
}
