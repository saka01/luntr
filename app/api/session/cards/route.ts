import { NextResponse } from 'next/server'
import { getSessionCards } from '@/lib/session-engine'
import { currentUserId } from '@/lib/auth-guard'

export async function GET() {
  try {
    const userId = await currentUserId()
    const cards = await getSessionCards(userId)
    
    return NextResponse.json(cards)
  } catch (error) {
    console.error('Error getting session cards:', error)
    return NextResponse.json({ error: 'Failed to get session cards' }, { status: 500 })
  }
}
