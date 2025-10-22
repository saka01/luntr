import { NextRequest, NextResponse } from 'next/server'
import { updateStreak } from '@/lib/session-engine'
import { currentUserId } from '@/lib/auth-guard'

export async function POST(request: NextRequest) {
  try {
    const userId = await currentUserId()
    
    // Update streak on login
    await updateStreak(userId)
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating streak on login:', error)
    return NextResponse.json({ error: 'Failed to update streak' }, { status: 500 })
  }
}
