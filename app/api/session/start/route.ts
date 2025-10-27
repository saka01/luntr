import { NextRequest, NextResponse } from 'next/server';
import { createUnifiedSessionEngine } from '@/lib/session/unifiedSessionEngine';
import { currentUserId, requireProfile } from '@/lib/auth-guard';

export async function POST(request: NextRequest) {
  try {
    const userId = await currentUserId();
    const { pattern, size } = await request.json();
    
    const sessionEngine = createUnifiedSessionEngine(userId, pattern || 'two-pointers');
    const { sessionId, cards } = await sessionEngine.startSession(size || 10);
    
    // Get user profile for streak
    const profile = await requireProfile();
    
    return NextResponse.json({ sessionId, cards, streak: profile.streak });
  } catch (error) {
    console.error('Error starting session:', error);
    return NextResponse.json({ error: 'Failed to start session' }, { status: 500 });
  }
}
