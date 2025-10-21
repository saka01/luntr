import { NextRequest, NextResponse } from 'next/server'
import { createStudySession } from '@/lib/enhanced-session-engine'
import { createClient } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const { pattern, sizePlanned = 10 } = await request.json()
    
    // Get user from Supabase auth
    const supabase = createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    // Create new study session
    const session = await createStudySession(user.id, pattern, sizePlanned)
    
    return NextResponse.json({ session })
  } catch (error) {
    console.error('Error creating study session:', error)
    return NextResponse.json({ error: 'Failed to create session' }, { status: 500 })
  }
}
