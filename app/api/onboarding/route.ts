import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { requireUser } from '@/lib/auth-guard'

export async function POST(request: NextRequest) {
  try {
    const user = await requireUser()
    const { level, dailyMinutes } = await request.json()

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

    // Create or update profile
    const { error } = await supabase
      .from('profiles')
      .upsert({
        user_id: user.id,
        level,
        daily_minutes: dailyMinutes,
        streak: 0,
      })

    if (error) {
      throw error
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Onboarding error:', error)
    return NextResponse.json({ error: 'Failed to save profile' }, { status: 500 })
  }
}
