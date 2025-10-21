import { NextRequest, NextResponse } from 'next/server'
import { endStudySession } from '@/lib/enhanced-session-engine'
import { createClient } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const { sessionId } = await request.json()
    
    if (!sessionId) {
      return NextResponse.json({ error: 'Session ID required' }, { status: 400 })
    }
    
    // Get user from Supabase auth
    const supabase = createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    // End study session and get stats
    const stats = await endStudySession(sessionId)
    
    return NextResponse.json({ stats })
  } catch (error) {
    console.error('Error ending study session:', error)
    return NextResponse.json({ error: 'Failed to end session' }, { status: 500 })
  }
}
