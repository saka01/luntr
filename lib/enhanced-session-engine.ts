import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { calculateNextInterval, calculateNextDueDate } from './sm2'

export interface SessionCard {
  id: string
  slug: string
  pattern: string
  type: 'mcq' | 'plan' | 'order' | 'fitb' | 'insight'
  difficulty: 'E' | 'M' | 'H'
  prompt: any
  answer: any
  subtype?: string
  tags?: string
  estSeconds?: number
}

export interface StudySession {
  id: string
  userId: string
  pattern: string
  startedAt: Date
  endedAt?: Date
  sizePlanned: number
  sizeCompleted: number
  servedCardIds: string[]
  accuracy?: number
  avgResponseMs?: number
}

export interface SessionStats {
  totalCards: number
  completedCards: number
  accuracy: number
  avgResponseMs: number
  difficultyDistribution: { E: number; M: number; H: number }
}

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
          } catch {
            // Handle errors silently
          }
        },
      },
    }
  )
}

// Adaptive difficulty weights based on user performance
function getDifficultyWeights(userMastery: number): { E: number; M: number; H: number } {
  if (userMastery > 75) {
    // High mastery: more challenging cards
    return { E: 0.25, M: 0.45, H: 0.30 }
  } else {
    // Default weights
    return { E: 0.4, M: 0.45, H: 0.15 }
  }
}

// Get user's rolling performance over last 3 sessions
async function getUserMastery(userId: string, pattern: string): Promise<number> {
  const supabase = await getSupabaseClient()
  
  // Get last 3 sessions for this pattern
  const { data: sessions } = await supabase
    .from('study_sessions')
    .select('accuracy')
    .eq('user_id', userId)
    .eq('pattern', pattern)
    .not('accuracy', 'is', null)
    .order('started_at', { ascending: false })
    .limit(3)
  
  if (!sessions || sessions.length === 0) return 0
  
  const avgAccuracy = sessions.reduce((sum, session) => sum + (session.accuracy || 0), 0) / sessions.length
  return avgAccuracy * 100 // Convert to percentage
}

// Create a new study session
export async function createStudySession(
  userId: string, 
  pattern: string, 
  sizePlanned: number = 10
): Promise<StudySession> {
  const supabase = await getSupabaseClient()
  
  const { data: session, error } = await supabase
    .from('study_sessions')
    .insert({
      user_id: userId,
      pattern,
      size_planned: sizePlanned,
      served_card_ids: []
    })
    .select()
    .single()
  
  if (error) throw error
  
  return {
    id: session.id,
    userId: session.user_id,
    pattern: session.pattern,
    startedAt: new Date(session.started_at),
    endedAt: session.ended_at ? new Date(session.ended_at) : undefined,
    sizePlanned: session.size_planned,
    sizeCompleted: session.size_completed,
    servedCardIds: session.served_card_ids || [],
    accuracy: session.accuracy,
    avgResponseMs: session.avg_response_ms
  }
}

// Get session cards with adaptive difficulty and all features
export async function getSessionCards(
  userId: string, 
  sessionId: string,
  size: number = 10, 
  excludeCardIds: string[] = [], 
  pattern: string = 'two-pointers'
): Promise<SessionCard[]> {
  try {
    const supabase = await getSupabaseClient()
    const now = new Date().toISOString()
    
    // Get user's mastery level for adaptive difficulty
    const userMastery = await getUserMastery(userId, pattern)
    const difficultyWeights = getDifficultyWeights(userMastery)
    
    // Handle "all" pattern by not filtering by pattern
    let patternFilter: string | undefined
    if (pattern === 'all') {
      patternFilter = undefined
    } else if (pattern === 'two-pointers') {
      patternFilter = 'Two Pointers'
    } else {
      patternFilter = pattern
    }
    
    // Get cards due for review (60% of session)
    let dueCardsQuery = supabase
      .from('user_progress')
      .select(`
        card_id,
        cards!inner (
          id,
          slug,
          pattern,
          type,
          difficulty,
          prompt,
          answer,
          subtype,
          tags,
          est_seconds
        )
      `)
      .eq('user_id', userId)
      .lte('next_due', now)
      .order('created_at', { ascending: true })
      .limit(Math.ceil(size * 0.6))
    
    if (patternFilter) {
      dueCardsQuery = dueCardsQuery.eq('cards.pattern', patternFilter)
    }
    
    if (excludeCardIds.length > 0) {
      dueCardsQuery = dueCardsQuery.not('card_id', 'in', `(${excludeCardIds.join(',')})`)
    }
    
    const { data: dueCardsData } = await dueCardsQuery
    const dueCards = dueCardsData?.map((item: any) => item.cards) || []
    
    // Get recent misses (20% of session) - last 48 hours with grade=5 or timedOut
    const since = new Date(Date.now() - 48 * 3600 * 1000).toISOString()
    let recentMissesQuery = supabase
      .from('attempts')
      .select(`
        card_id,
        cards!inner (
          id,
          slug,
          pattern,
          type,
          difficulty,
          prompt,
          answer,
          subtype,
          tags,
          est_seconds
        )
      `)
      .eq('user_id', userId)
      .gte('created_at', since)
      .or('grade.eq.5,timed_out.eq.true')
      .limit(Math.ceil(size * 0.2))
    
    if (patternFilter) {
      recentMissesQuery = recentMissesQuery.eq('cards.pattern', patternFilter)
    }
    
    if (excludeCardIds.length > 0) {
      recentMissesQuery = recentMissesQuery.not('card_id', 'in', `(${excludeCardIds.join(',')})`)
    }
    
    const { data: recentMissesData } = await recentMissesQuery
    const recentMisses = (recentMissesData?.map((item: any) => item.cards) || [])
      .filter(card => !excludeCardIds.includes(card.id))
    
    // Get new cards (up to 3 per session)
    const { data: userCardIds } = await supabase
      .from('user_progress')
      .select('card_id')
      .eq('user_id', userId)
    
    const userCardIdSet = new Set(userCardIds?.map(p => p.card_id) || [])
    
    let newCardsQuery = supabase
      .from('cards')
      .select('*')
      .order('difficulty', { ascending: true })
      .limit(Math.min(3, Math.floor(size / 3)))
    
    if (patternFilter) {
      newCardsQuery = newCardsQuery.eq('pattern', patternFilter)
    }
    
    if (excludeCardIds.length > 0) {
      newCardsQuery = newCardsQuery.not('id', 'in', `(${excludeCardIds.join(',')})`)
    }
    
    const { data: newCardsData } = await newCardsQuery
    const newCards = (newCardsData || []).filter(card => 
      !userCardIdSet.has(card.id) && !excludeCardIds.includes(card.id)
    )
    
    // Apply adaptive difficulty weighting
    const weightedCards = applyDifficultyWeighting([...dueCards, ...recentMisses, ...newCards], difficultyWeights)
    
    // Combine and deduplicate
    const allCards = weightedCards
    const seen = new Set<string>()
    let uniqueCards = allCards.filter(card => {
      if (seen.has(card.id)) return false
      seen.add(card.id)
      return true
    })
    
    // Inject insight cards every 4-5 cards
    uniqueCards = await injectInsightCards(uniqueCards, userId, patternFilter)
    
    // Limit to requested size
    uniqueCards = uniqueCards.slice(0, size)
    
    // Update session with served card IDs
    await updateSessionServedCards(sessionId, uniqueCards.map(c => c.id))
    
    return uniqueCards.map(card => ({
      id: card.id,
      slug: card.slug,
      pattern: card.pattern,
      type: card.type as 'mcq' | 'plan' | 'order' | 'fitb' | 'insight',
      difficulty: card.difficulty as 'E' | 'M' | 'H',
      prompt: card.prompt,
      answer: card.answer,
      subtype: card.subtype,
      tags: card.tags,
      estSeconds: card.est_seconds
    }))
  } catch (error) {
    console.error('Error in getSessionCards:', error)
    throw error
  }
}

// Apply difficulty weighting to cards
function applyDifficultyWeighting(cards: any[], weights: { E: number; M: number; H: number }): any[] {
  const weightedCards: any[] = []
  
  // Separate cards by difficulty
  const easyCards = cards.filter(c => c.difficulty === 'E')
  const mediumCards = cards.filter(c => c.difficulty === 'M')
  const hardCards = cards.filter(c => c.difficulty === 'H')
  
  // Calculate how many of each difficulty to include
  const totalCards = cards.length
  const easyCount = Math.ceil(totalCards * weights.E)
  const mediumCount = Math.ceil(totalCards * weights.M)
  const hardCount = Math.ceil(totalCards * weights.H)
  
  // Shuffle and select cards
  weightedCards.push(...shuffle(easyCards).slice(0, easyCount))
  weightedCards.push(...shuffle(mediumCards).slice(0, mediumCount))
  weightedCards.push(...shuffle(hardCards).slice(0, hardCount))
  
  return shuffle(weightedCards)
}

// Inject insight cards every 4-5 cards or after misses
async function injectInsightCards(cards: any[], userId: string, patternFilter?: string): Promise<any[]> {
  const supabase = await getSupabaseClient()
  
  // Get insight cards for the pattern
  let insightQuery = supabase
    .from('cards')
    .select('*')
    .eq('type', 'insight')
  
  if (patternFilter) {
    insightQuery = insightQuery.eq('pattern', patternFilter)
  }
  
  const { data: insightCards } = await insightQuery
  
  if (!insightCards || insightCards.length === 0) {
    return cards
  }
  
  const result: any[] = []
  let insightIndex = 0
  let lastMissIndex = -1
  
  for (let i = 0; i < cards.length; i++) {
    const card = cards[i]
    result.push(card)
    
    // Check if this was a miss (we'd need to track this from previous attempts)
    // For now, inject insight cards every 4-5 cards
    const shouldInjectInsight = 
      (i > 0 && (i + 1) % 5 === 0) || // Every 5 cards
      (i > 0 && (i + 1) % 4 === 0 && Math.random() < 0.5) // Every 4 cards with 50% chance
    
    if (shouldInjectInsight && insightCards.length > 0) {
      const insightCard = insightCards[insightIndex % insightCards.length]
      result.push(insightCard)
      insightIndex++
    }
  }
  
  return result
}

// Update session with served card IDs
async function updateSessionServedCards(sessionId: string, cardIds: string[]): Promise<void> {
  const supabase = await getSupabaseClient()
  
  await supabase
    .from('study_sessions')
    .update({ served_card_ids: cardIds })
    .eq('id', sessionId)
}

// Submit card attempt with enhanced tracking
export async function submitCardAttempt(
  userId: string,
  cardId: string,
  sessionId: string,
  grade: number,
  feedback: any,
  timeMs: number = 0,
  timedOut: boolean = false,
  attemptData?: {
    choice?: number;
    order?: number[];
    text?: string;
    blanks?: string[];
  }
) {
  const supabase = await getSupabaseClient()
  
  // Apply timeout policy
  let finalGrade = grade
  if (timedOut) {
    // If there was interaction but timeout, treat as grade 3
    // If no interaction in 10s, treat as grade 5
    finalGrade = timeMs > 0 ? 3 : 5
  }
  
  // Save the attempt
  const attemptRecord: any = {
    user_id: userId,
    card_id: cardId,
    grade: finalGrade,
    feedback,
    time_ms: timeMs,
    timed_out: timedOut
  }

  if (attemptData) {
    if (attemptData.choice !== undefined) attemptRecord.choice = attemptData.choice;
    if (attemptData.order !== undefined) attemptRecord.order = attemptData.order;
    if (attemptData.text !== undefined) attemptRecord.text = attemptData.text;
    if (attemptData.blanks !== undefined) attemptRecord.blanks = attemptData.blanks;
  }

  await supabase
    .from('attempts')
    .insert(attemptRecord)
  
  // Update user progress with SRS algorithm
  const { data: existingProgress } = await supabase
    .from('user_progress')
    .select('*')
    .eq('user_id', userId)
    .eq('card_id', cardId)
    .single()
  
  if (existingProgress) {
    const newParams = calculateNextIntervalNew(finalGrade, {
      ef: existingProgress.ef,
      reps: existingProgress.reps,
      interval_days: existingProgress.interval_days
    })
    
    const nextDue = calculateNextDueDate(newParams.interval_days)
    
    // If grade 5 in last 48h, force nextDue to today
    if (finalGrade === 5) {
      nextDue.setHours(23, 59, 59, 999) // End of today
    }
    
    await supabase
      .from('user_progress')
      .update({
        ef: newParams.ef,
        reps: newParams.reps,
        interval_days: newParams.interval_days,
        next_due: nextDue.toISOString(),
        last_grade: finalGrade
      })
      .eq('user_id', userId)
      .eq('card_id', cardId)
  } else {
    const newParams = calculateNextIntervalNew(finalGrade, {
      ef: 2.5,
      reps: 0,
      interval_days: 1
    })
    
    const nextDue = calculateNextDueDate(newParams.interval_days)
    
    await supabase
      .from('user_progress')
      .insert({
        user_id: userId,
        card_id: cardId,
        ef: newParams.ef,
        reps: newParams.reps,
        interval_days: newParams.interval_days,
        next_due: nextDue.toISOString(),
        last_grade: finalGrade
      })
  }
  
  // Update session completion count
  await supabase
    .from('study_sessions')
    .update({ 
      size_completed: supabase.raw('size_completed + 1')
    })
    .eq('id', sessionId)
}

// SRS algorithm for 1/3/5 grading
function calculateNextIntervalNew(grade: number, params: { ef: number; reps: number; interval_days: number }) {
  const { ef, reps, interval_days } = params
  
  // Map to Anki-like quality where higher is better
  const q = 6 - grade; // 1->5(best), 3->3, 5->1(worst)
  let newEf = ef;
  let newReps = reps;
  let newIntervalDays = interval_days;

  if (q <= 1) { // Too Confusing (grade 5)
    newReps = 0;
    newIntervalDays = 0;           // show again today
    newEf = Math.max(1.3, ef - 0.2);
  } else if (q === 3) { // Just Right (grade 3)
    newReps = reps + 1;
    if (newReps === 1) newIntervalDays = 1;
    else if (newReps === 2) newIntervalDays = 3;
    else newIntervalDays = Math.max(1, Math.round(interval_days * ef));
  } else { // Too Easy (grade 1)
    newReps = reps + 1;
    newEf = ef + 0.1;
    if (newReps === 1) newIntervalDays = 3;
    else if (newReps === 2) newIntervalDays = 6;
    else newIntervalDays = Math.max(1, Math.round(interval_days * ef * 1.3));
  }

  return {
    ef: newEf,
    reps: newReps,
    interval_days: newIntervalDays
  };
}

// End study session and calculate stats
export async function endStudySession(sessionId: string): Promise<SessionStats> {
  const supabase = await getSupabaseClient()
  
  // Get session data
  const { data: session } = await supabase
    .from('study_sessions')
    .select('*')
    .eq('id', sessionId)
    .single()
  
  if (!session) throw new Error('Session not found')
  
  // Get attempts for this session
  const { data: attempts } = await supabase
    .from('attempts')
    .select('*')
    .eq('user_id', session.user_id)
    .in('card_id', session.served_card_ids || [])
    .gte('created_at', session.started_at)
  
  if (!attempts || attempts.length === 0) {
    return {
      totalCards: 0,
      completedCards: 0,
      accuracy: 0,
      avgResponseMs: 0,
      difficultyDistribution: { E: 0, M: 0, H: 0 }
    }
  }
  
  // Calculate stats
  const totalCards = session.served_card_ids?.length || 0
  const completedCards = attempts.length
  const accuracy = attempts.reduce((sum, attempt) => {
    const grade = attempt.grade
    return sum + (grade <= 3 ? 1 : 0) // Grade 1-3 considered correct
  }, 0) / completedCards
  
  const avgResponseMs = attempts.reduce((sum, attempt) => sum + (attempt.time_ms || 0), 0) / completedCards
  
  // Calculate difficulty distribution
  const difficultyDistribution = { E: 0, M: 0, H: 0 }
  // This would need to be calculated based on the actual cards served
  
  // Update session with final stats
  await supabase
    .from('study_sessions')
    .update({
      ended_at: new Date().toISOString(),
      accuracy: accuracy,
      avg_response_ms: avgResponseMs
    })
    .eq('id', sessionId)
  
  return {
    totalCards,
    completedCards,
    accuracy,
    avgResponseMs,
    difficultyDistribution
  }
}

// Add 10 more cards to existing session
export async function addMoreCards(
  sessionId: string,
  additionalSize: number = 10
): Promise<SessionCard[]> {
  const supabase = await getSupabaseClient()
  
  // Get current session data
  const { data: session } = await supabase
    .from('study_sessions')
    .select('*')
    .eq('id', sessionId)
    .single()
  
  if (!session) throw new Error('Session not found')
  
  // Get additional cards excluding already served ones
  const additionalCards = await getSessionCards(
    session.user_id,
    sessionId,
    additionalSize,
    session.served_card_ids || [],
    session.pattern
  )
  
  return additionalCards
}

// Utility function to shuffle array
function shuffle<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}
