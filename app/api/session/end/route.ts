import { NextRequest, NextResponse } from 'next/server';
import { currentUserId } from '@/lib/auth-guard';

async function getSupabaseClient() {
  const { cookies } = await import('next/headers');
  const { createServerClient } = await import('@supabase/ssr');
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
    
    // Load session
    const { data: session, error: loadError } = await supabase
      .from('study_sessions')
      .select('*')
      .eq('id', sessionId)
      .eq('user_id', userId)
      .single();
    
    if (loadError || !session) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }
    
    // Calculate session metrics
    const servedCardIds = session.served_card_ids || [];
    const { data: attempts } = await supabase
      .from('attempts')
      .select('*')
      .eq('user_id', userId)
      .in('card_id', servedCardIds)
      .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());
    
    const accuracy = attempts?.length ? 
      attempts.filter(a => a.grade <= 3).length / attempts.length : 
      0;
    
    const avgResponseMs = attempts?.length ?
      attempts.reduce((sum, a) => sum + a.time_ms, 0) / attempts.length :
      0;
    
    // End session
    const { data: endedSession, error: endError } = await supabase
      .from('study_sessions')
      .update({
        ended_at: new Date().toISOString(),
        size_completed: servedCardIds.length,
        served_card_ids: servedCardIds,
        accuracy,
        avg_response_ms: avgResponseMs
      })
      .eq('id', sessionId)
      .select()
      .single();
    
    if (endError) throw endError;
    
    return NextResponse.json({
      accuracy,
      cardsCompleted: servedCardIds.length,
      timeSpent: avgResponseMs * servedCardIds.length
    });
  } catch (error) {
    console.error('Error ending session:', error);
    return NextResponse.json({ error: 'Failed to end session' }, { status: 500 });
  }
}
