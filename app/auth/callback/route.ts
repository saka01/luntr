import { createServerClient, parseCookieHeader } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/onboarding'

  let response = NextResponse.redirect(`${origin}${next}`)

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return parseCookieHeader(request.headers.get('Cookie') ?? '').filter((cookie): cookie is { name: string; value: string } => cookie.value !== undefined)
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set({ name, value, ...options })
            response.cookies.set({ name, value, ...options })
          })
        },
      },
    }
  )

  if (code) {
    // Handle PKCE flow
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (error) {
      console.error('PKCE auth error:', error)
      return NextResponse.redirect(`${origin}/login?error=auth_callback_error`)
    }
    
    // Update streak on login for PKCE flow
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        // Import updateStreak function
        const { updateStreak } = await import('@/lib/session-engine')
        await updateStreak(user.id)
      }
    } catch (error) {
      console.error('Failed to update streak on PKCE login:', error)
    }
    
    return response
  }

  // For magic links, redirect to client-side handler
  return NextResponse.redirect(`${origin}/auth/callback/client`)
}
