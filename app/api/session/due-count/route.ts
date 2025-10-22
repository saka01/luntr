import { NextRequest, NextResponse } from 'next/server'
import { getDueCount } from '@/lib/session-engine'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    
    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 })
    }
    
    const dueCount = await getDueCount(userId)
    return NextResponse.json(dueCount)
  } catch (error) {
    console.error('Error getting due count:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
