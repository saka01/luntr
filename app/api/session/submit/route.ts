import { NextRequest, NextResponse } from 'next/server'
import { submitAttemptWithTimeout } from '@/lib/session/supabaseSubmitWithTimeout'
import { updateStreak } from '@/lib/session-engine'
import { currentUserId } from '@/lib/auth-guard'

export async function POST(request: NextRequest) {
  try {
    const userId = await currentUserId()
    const { cardId, answer, feedback, lastInteractionTime } = await request.json()
    
    // Extract data from the new answer format
    const userGrade = answer.grade || 3 // Default to 3 if not provided
    const timeMs = answer.timeMs || 0
    const timedOut = answer.timedOut || false
    const attemptData = {
      type: answer.type,
      choice: answer.choice,
      order: answer.order,
      text: answer.text,
      blanks: answer.blanks
    }
    
    // Submit the attempt with timeout policy
    const result = await submitAttemptWithTimeout({
      userId,
      cardId,
      uiGrade: userGrade,
      payload: attemptData,
      timeMs,
      timedOut,
      lastInteractionTime
    })
    
    // Update streak after successful submission
    await updateStreak(userId)
    
    return NextResponse.json({ 
      success: true, 
      finalGrade: result.finalGrade,
      finalTimedOut: result.finalTimedOut,
      nextDue: result.nextDue
    })
  } catch (error) {
    console.error('Error submitting card:', error)
    return NextResponse.json({ error: 'Failed to submit card' }, { status: 500 })
  }
}
