import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { z } from 'zod'

const waitlistSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Please enter a valid email address'),
  firstName: z.string().optional(),
  source: z.string().optional(),
})

async function getSupabaseClient() {
  const cookieStore = await cookies()
  
  return createServerClient(
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
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log('Received waitlist data:', body)
    const validatedData = waitlistSchema.parse(body)

    const supabase = await getSupabaseClient()

    // Check if email already exists
    const { data: existingEntry } = await supabase
      .from('waitlist')
      .select('*')
      .eq('email', validatedData.email)
      .single()

    if (existingEntry) {
      return NextResponse.json(
        { error: 'Email already exists in waitlist' },
        { status: 409 }
      )
    }

    // Create new waitlist entry
    const { data: waitlistEntry, error: insertError } = await supabase
      .from('waitlist')
      .insert({
        email: validatedData.email,
        first_name: validatedData.firstName,
        source: validatedData.source || 'unknown',
      })
      .select()
      .single()

    if (insertError) {
      throw insertError
    }

    // Get total count for position
    const { count: totalCount } = await supabase
      .from('waitlist')
      .select('*', { count: 'exact', head: true })

    return NextResponse.json({
      success: true,
      data: {
        id: waitlistEntry.id,
        position: totalCount,
        email: waitlistEntry.email,
        firstName: waitlistEntry.first_name,
      }
    })

  } catch (error) {
    console.error('Waitlist API error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid data provided', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const supabase = await getSupabaseClient()
    const { count } = await supabase
      .from('waitlist')
      .select('*', { count: 'exact', head: true })
    
    return NextResponse.json({ count })
  } catch (error) {
    console.error('Waitlist count error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
