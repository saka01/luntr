import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseSessionEngine } from '@/lib/session/supabaseSessionEngine';
import { currentUserId } from '@/lib/auth-guard';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

async function getSupabaseClient() {
  const cookieStore = await cookies();
  
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch {
            // Handle errors silently
          }
        },
      },
    }
  );
}

export async function POST(request: NextRequest) {
  try {
    const userId = await currentUserId();
    const { sessionId } = await request.json();
    
    const supabase = await getSupabaseClient();
    
    // Get the session to determine pattern
    const { data: session, error } = await supabase
      .from('study_sessions')
      .select('*')
      .eq('id', sessionId)
      .eq('user_id', userId)
      .single();
    
    if (error || !session) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }
    
    const sessionEngine = createSupabaseSessionEngine(userId, session.pattern);
    // Set the session ID for the engine
    (sessionEngine as any).sessionId = sessionId;
    (sessionEngine as any).servedCardIds = new Set(session.served_card_ids || []);
    
    const sessionData = await sessionEngine.endSession();
    
    return NextResponse.json({ session: sessionData });
  } catch (error) {
    console.error('Error ending session:', error);
    return NextResponse.json({ error: 'Failed to end session' }, { status: 500 });
  }
}
