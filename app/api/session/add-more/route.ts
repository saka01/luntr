import { NextRequest, NextResponse } from 'next/server';
import { UnifiedSessionEngine } from '@/lib/session/unifiedSessionEngine';
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
    const { sessionId, size = 10 } = await request.json();
    
    const supabase = await getSupabaseClient();
    
    // Load session
    const { data: session, error } = await supabase
      .from('study_sessions')
      .select('*')
      .eq('id', sessionId)
      .eq('user_id', userId)
      .single();
    
    if (error || !session) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }
    
    // Create engine and restore state
    const engine = new UnifiedSessionEngine(userId, session.pattern);
    (engine as any).sessionId = session.id;
    (engine as any).servedCardIds = new Set(session.served_card_ids || []);
    (engine as any).newCardsServed = session.new_card_count || 0;
    
    // Add more cards
    const cards = await engine.addMoreCards(size);
    
    return NextResponse.json({
      cards,
      count: cards.length,
      requested: size
    });
  } catch (error) {
    console.error('Error adding more cards:', error);
    return NextResponse.json({ error: 'Failed to add more cards' }, { status: 500 });
  }
}
