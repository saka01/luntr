import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseSessionEngine } from '@/lib/session/supabaseSessionEngine';
import { currentUserId } from '@/lib/auth-guard';

export async function POST(request: NextRequest) {
  try {
    const userId = await currentUserId();
    const { pattern, size } = await request.json();
    
    const sessionEngine = createSupabaseSessionEngine(userId, pattern || 'two-pointers');
    const { sessionId, cards } = await sessionEngine.startSession(size || 10);
    
    return NextResponse.json({ sessionId, cards });
  } catch (error) {
    console.error('Error starting session:', error);
    return NextResponse.json({ error: 'Failed to start session' }, { status: 500 });
  }
}