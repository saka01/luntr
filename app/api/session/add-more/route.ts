import { NextRequest, NextResponse } from 'next/server'
import { addMoreCards } from '@/lib/enhanced-session-engine'
import { createClient } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const { sessionId, additionalSize = 10 } = await request.json()
    
    if (!sessionId) {
      return NextResponse.json({ error: 'Session ID required' }, { status: 400 })
    }
    
    // Get user from Supabase auth
    const supabase = createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    // Add more cards to session
    const additionalCards = await addMoreCards(sessionId, additionalSize)
    
    return NextResponse.json({ cards: additionalCards })
  } catch (error) {
    console.error('Error adding more cards:', error)
    return NextResponse.json({ error: 'Failed to add more cards' }, { status: 500 })
  }
}
