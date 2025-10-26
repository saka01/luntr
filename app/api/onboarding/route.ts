import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function POST(request: NextRequest) {
  try {
    // Get user without redirecting (for API routes)
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
        },
      }
    )

    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const { level, dailyMinutes, primaryLanguage, learningGoal, timezone } = await request.json()
    
    // Get first name from user metadata
    const firstName = (user.user_metadata?.name as string) || ''
    
    console.log('Onboarding data:', { 
      userId: user.id, 
      firstName,
      level, 
      dailyMinutes, 
      primaryLanguage, 
      learningGoal, 
      timezone 
    })

    // Create or update profile
    const { error } = await supabase
      .from('profiles')
      .upsert({
        user_id: user.id,
        first_name: firstName,
        level,
        daily_minutes: dailyMinutes,
        primary_language: primaryLanguage,
        learning_goal: learningGoal,
        timezone,
        streak: 0,
      })

    if (error) {
      console.error('Supabase upsert error:', error)
      throw error
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Onboarding error:', error)
    return NextResponse.json({ error: 'Failed to save profile' }, { status: 500 })
  }
}
