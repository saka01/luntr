// Test file for the StudySession engine
// This can be used to verify the implementation works correctly

import { createSupabaseSessionEngine } from './supabaseSessionEngine';

export async function testSessionEngine() {
  console.log('Testing StudySession Engine...');
  
  try {
    // Test with a mock user ID and pattern
    const userId = 'test-user-123';
    const pattern = 'two-pointers';
    
    const sessionEngine = createSupabaseSessionEngine(userId, pattern);
    
    // Test starting a session
    console.log('1. Starting session...');
    const { sessionId, cards } = await sessionEngine.startSession(10);
    console.log(`Session started: ${sessionId}`);
    console.log(`Cards received: ${cards.length}`);
    
    // Test adding more cards
    console.log('2. Adding more cards...');
    const moreCards = await sessionEngine.addMoreCards(5);
    console.log(`Additional cards: ${moreCards.length}`);
    
    // Test ending session
    console.log('3. Ending session...');
    const sessionData = await sessionEngine.endSession();
    console.log('Session ended:', {
      id: sessionData.id,
      sizePlanned: sessionData.sizePlanned,
      sizeCompleted: sessionData.sizeCompleted,
      accuracy: sessionData.accuracy,
      avgResponseMs: sessionData.avgResponseMs
    });
    
    console.log('✅ All tests passed!');
    return true;
  } catch (error) {
    console.error('❌ Test failed:', error);
    return false;
  }
}

// Uncomment to run tests
// testSessionEngine();
