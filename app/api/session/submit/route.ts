import { NextRequest, NextResponse } from 'next/server'
import { submitCardAttempt, updateStreak } from '@/lib/session-engine'
import { currentUserId } from '@/lib/auth-guard'

export async function POST(request: NextRequest) {
  try {
    const userId = await currentUserId()
    const { cardId, answer, feedback } = await request.json()
    
    // Extract user grade from feedback
    const userGrade = feedback.userGrade || 3 // Default to 3 if not provided
    
    // Submit the attempt
    await submitCardAttempt(userId, cardId, userGrade, feedback)
    
    // Update streak after successful submission
    await updateStreak(userId)
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error submitting card:', error)
    return NextResponse.json({ error: 'Failed to submit card' }, { status: 500 })
  }
}
