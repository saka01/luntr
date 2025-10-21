import { NextResponse } from 'next/server'
import { getSessionCards } from '@/lib/session-engine'
import { currentUserId } from '@/lib/auth-guard'

export async function GET(request: Request) {
  try {
    const userId = await currentUserId()
    const { searchParams } = new URL(request.url)
    
    const size = searchParams.get('size') ? parseInt(searchParams.get('size')!) : 10
    const excludeIds = searchParams.get('excludeIds')?.split(',') || []
    const pattern = searchParams.get('pattern') || 'two-pointers' // Default to two pointers
    
    const cards = await getSessionCards(userId, size, excludeIds, pattern)
    
    return NextResponse.json(cards)
  } catch (error) {
    console.error('Error getting session cards:', error)
    return NextResponse.json({ error: 'Failed to get session cards' }, { status: 500 })
  }
}
