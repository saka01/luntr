import { NextRequest, NextResponse } from 'next/server'
import { getSessionCards } from '@/lib/enhanced-session-engine'
import { createClient } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get('sessionId')
    const size = parseInt(searchParams.get('size') || '10')
    const pattern = searchParams.get('pattern') || 'two-pointers'
    
    if (!sessionId) {
      return NextResponse.json({ error: 'Session ID required' }, { status: 400 })
    }
    
    // Get user from Supabase auth
    const supabase = createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    // Get session cards
    const cards = await getSessionCards(user.id, sessionId, size, [], pattern)
    
    return NextResponse.json({ cards })
  } catch (error) {
    console.error('Error getting session cards:', error)
    return NextResponse.json({ error: 'Failed to get session cards' }, { status: 500 })
  }
}
