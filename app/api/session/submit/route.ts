import { NextRequest, NextResponse } from 'next/server'
import { submitCardAttempt, updateStreak } from '@/lib/session-engine'
import { currentUserId } from '@/lib/auth-guard'

export async function POST(request: NextRequest) {
  try {
    const userId = await currentUserId()
    const { cardId, answer, feedback } = await request.json()
    
    // Extract data from the new answer format
    const userGrade = answer.grade || 3 // Default to 3 if not provided
    const timeMs = answer.timeMs || 0
    const timedOut = answer.timedOut || false
    const attemptData = {
      choice: answer.choice,
      order: answer.order,
      text: answer.text,
      blanks: answer.blanks
    }
    
    // Submit the attempt with new data
    await submitCardAttempt(userId, cardId, userGrade, feedback, timeMs, timedOut, attemptData)
    
    // Update streak after successful submission
    await updateStreak(userId)
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error submitting card:', error)
    return NextResponse.json({ error: 'Failed to submit card' }, { status: 500 })
  }
}
