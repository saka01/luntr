import { NextResponse } from 'next/server'
import { getSessionCards } from '@/lib/session-engine'
import { currentUserId, requireProfile } from '@/lib/auth-guard'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

async function getSupabaseClient() {
  const cookieStore = await cookies()
  
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options)
            })
          } catch (error) {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  )
}

export async function GET(request: Request) {
  try {
    const userId = await currentUserId()
    const { searchParams } = new URL(request.url)
    
    const size = searchParams.get('size') ? parseInt(searchParams.get('size')!) : 10
    const excludeIds = searchParams.get('excludeIds')?.split(',') || []
    const pattern = searchParams.get('pattern') || 'two-pointers' // Default to two pointers
    const devMode = searchParams.get('devMode') === 'true' // Check if dev mode is enabled
    
    let cards
    if (devMode && process.env.NODE_ENV === 'development') {
      // In dev mode, fetch ALL cards directly (not filtered by user progress)
      const supabase = await getSupabaseClient()
      
      let query = supabase
        .from('cards')
        .select('*')
        .eq('pattern', pattern)
        .limit(size * 3) // Get more cards for filtering
      
      if (excludeIds.length > 0) {
        query = query.not('id', 'in', `(${excludeIds.join(',')})`)
      }
      
      const { data: allCards } = await query
      cards = allCards || []
    } else {
      // Normal mode: fetch cards based on user progress
      cards = await getSessionCards(userId, size, excludeIds, pattern)
    }
    
    const profile = await requireProfile()
    
    return NextResponse.json({
      cards,
      streak: profile.streak
    })
  } catch (error) {
    console.error('Error getting session cards:', error)
    return NextResponse.json({ error: 'Failed to get session cards' }, { status: 500 })
  }
}
