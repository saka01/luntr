import { NextRequest, NextResponse } from 'next/server'
import { getWeakestPatterns } from '@/lib/session-engine'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    
    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 })
    }
    
    const weakestPatterns = await getWeakestPatterns(userId)
    return NextResponse.json(weakestPatterns)
  } catch (error) {
    console.error('Error getting weakest patterns:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
