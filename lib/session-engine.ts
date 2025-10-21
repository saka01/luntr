import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { calculateNextInterval, calculateNextDueDate } from './sm2'
import { ACTIVE_PATTERN } from '../config/activePattern'

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

export async function getSessionCards(userId: string, size: number = 10, excludeCardIds: string[] = [], pattern: string = 'two-pointers'): Promise<SessionCard[]> {
  try {
    const supabase = await getSupabaseClient()
    const now = new Date().toISOString()
    
    // Handle "all" pattern by not filtering by pattern
    // Map pattern IDs to actual pattern names in the database
    let patternFilter: string | undefined
    if (pattern === 'all') {
      patternFilter = undefined
    } else if (pattern === 'two-pointers') {
      patternFilter = 'Two Pointers' // Map to the actual pattern name in the database
    } else {
      patternFilter = pattern
    }
    
    // Get cards due for review
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
  
  // Add pattern filter if not "all"
  if (patternFilter) {
    dueCardsQuery = dueCardsQuery.eq('cards.pattern', patternFilter)
  }
  
  // Only add the not.in filter if there are excluded card IDs
  if (excludeCardIds.length > 0) {
    dueCardsQuery = dueCardsQuery.not('card_id', 'in', `(${excludeCardIds.join(',')})`)
  }
  
  const { data: dueCardsData } = await dueCardsQuery
  
  const dueCards = dueCardsData?.map((item: any) => item.cards) || []
  
  // Get recent misses (last 48 hours)
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
  
  // Add pattern filter if not "all"
  if (patternFilter) {
    recentMissesQuery = recentMissesQuery.eq('cards.pattern', patternFilter)
  }
  
  // Only add the not.in filter if there are excluded card IDs
  if (excludeCardIds.length > 0) {
    recentMissesQuery = recentMissesQuery.not('card_id', 'in', `(${excludeCardIds.join(',')})`)
  }
  
  const { data: recentMissesData } = await recentMissesQuery
  
  const recentMisses = (recentMissesData?.map((item: any) => item.cards) || [])
    .filter(card => !excludeCardIds.includes(card.id))
  
  // Get new cards (no progress entry)
  // First get all card IDs that user has progress for
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
  
  // Add pattern filter if not "all"
  if (patternFilter) {
    newCardsQuery = newCardsQuery.eq('pattern', patternFilter)
  }
  
  // Only add the not.in filter if there are excluded card IDs
  if (excludeCardIds.length > 0) {
    newCardsQuery = newCardsQuery.not('id', 'in', `(${excludeCardIds.join(',')})`)
  }
  
  const { data: newCardsData } = await newCardsQuery
  
  // Filter out cards that user already has progress for and excluded cards
  const newCards = (newCardsData || []).filter(card => 
    !userCardIdSet.has(card.id) && !excludeCardIds.includes(card.id)
  )
  
  // Combine and deduplicate
  const allCards = [...dueCards, ...recentMisses, ...newCards]
  const seen = new Set<string>()
  let uniqueCards = allCards.filter(card => {
    if (seen.has(card.id)) return false
    seen.add(card.id)
    return true
  })
  
  // If we don't have enough cards and no due cards, prioritize new cards
  if (uniqueCards.length < size && dueCards.length === 0) {
    // Get more new cards to fill the session
    let additionalQuery = supabase
      .from('cards')
      .select('*')
      .eq('pattern', ACTIVE_PATTERN)
      .order('difficulty', { ascending: true })
      .limit(size - uniqueCards.length)
    
    // Only add not.in filters if there are items to exclude
    if (uniqueCards.length > 0) {
      additionalQuery = additionalQuery.not('id', 'in', `(${uniqueCards.map(c => c.id).join(',')})`)
    }
    if (excludeCardIds.length > 0) {
      additionalQuery = additionalQuery.not('id', 'in', `(${excludeCardIds.join(',')})`)
    }
    
    const additionalNewCards = await additionalQuery
    
    const additionalCards = (additionalNewCards.data || []).filter(card => 
      !userCardIdSet.has(card.id) && !excludeCardIds.includes(card.id)
    )
    
    uniqueCards = [...uniqueCards, ...additionalCards].slice(0, size)
  } else {
    uniqueCards = uniqueCards.slice(0, size)
  }
  
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

export async function submitCardAttempt(
  userId: string,
  cardId: string,
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
  
  // Save the attempt with new fields
  const attemptRecord: any = {
    user_id: userId,
    card_id: cardId,
    grade,
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
  
  // Update or create user progress with new SRS algorithm
  const { data: existingProgress } = await supabase
    .from('user_progress')
    .select('*')
    .eq('user_id', userId)
    .eq('card_id', cardId)
    .single()
  
  if (existingProgress) {
    // Use new SRS algorithm (1/3/5 grading)
    const newParams = calculateNextIntervalNew(grade, {
      ef: existingProgress.ef,
      reps: existingProgress.reps,
      intervalDays: existingProgress.interval_days
    })
    
    const nextDue = calculateNextDueDate(newParams.intervalDays)
    
    await supabase
      .from('user_progress')
      .update({
        ef: newParams.ef,
        reps: newParams.reps,
        interval_days: newParams.intervalDays,
        next_due: nextDue,
        last_grade: grade
      })
      .eq('user_id', userId)
      .eq('card_id', cardId)
  } else {
    // Create new progress entry
    const newParams = calculateNextIntervalNew(grade, {
      ef: 2.5,
      reps: 0,
      intervalDays: 1
    })
    
    const nextDue = calculateNextDueDate(newParams.intervalDays)
    
    await supabase
      .from('user_progress')
      .insert({
        user_id: userId,
        card_id: cardId,
        ef: newParams.ef,
        reps: newParams.reps,
        interval_days: newParams.intervalDays,
        next_due: nextDue,
        last_grade: grade
      })
  }
}

// New SRS algorithm for 1/3/5 grading
function calculateNextIntervalNew(grade: number, params: { ef: number; reps: number; intervalDays: number }) {
  const { ef, reps, intervalDays } = params
  
  // Map to Anki-like quality where higher is better
  const q = 6 - grade; // 1->5(best), 3->3, 5->1(worst)
  let newEf = ef;
  let newReps = reps;
  let newIntervalDays = intervalDays;

  if (q <= 1) { // Too Confusing (grade 5)
    newReps = 0;
    newIntervalDays = 0;           // show again today
    newEf = Math.max(1.3, ef - 0.2);
  } else if (q === 3) { // Just Right (grade 3)
    newReps = reps + 1;
    if (newReps === 1) newIntervalDays = 1;
    else if (newReps === 2) newIntervalDays = 3;
    else newIntervalDays = Math.max(1, Math.round(intervalDays * ef));
  } else { // Too Easy (grade 1)
    newReps = reps + 1;
    newEf = ef + 0.1;
    if (newReps === 1) newIntervalDays = 3;
    else if (newReps === 2) newIntervalDays = 6;
    else newIntervalDays = Math.max(1, Math.round(intervalDays * ef * 1.3));
  }

  return {
    ef: newEf,
    reps: newReps,
    intervalDays: newIntervalDays
  };
}

export async function updateStreak(userId: string) {
  const supabase = await getSupabaseClient()
  
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', userId)
    .single()
  
  if (!profile) return
  
  const today = new Date()
  const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000)
  
  if (!profile.last_active) {
    // First session
    await supabase
      .from('profiles')
      .update({
        streak: 1,
        last_active: today.toISOString()
      })
      .eq('user_id', userId)
  } else {
    const lastActiveDate = new Date(profile.last_active)
    const daysDiff = Math.floor((today.getTime() - lastActiveDate.getTime()) / (24 * 60 * 60 * 1000))
    
    let newStreak = profile.streak
    
    if (daysDiff === 1) {
      // Consecutive day
      newStreak += 1
    } else if (daysDiff > 1) {
      // Gap in days - reset streak
      newStreak = 1
    }
    // If daysDiff === 0, same day, keep current streak
    
    await supabase
      .from('profiles')
      .update({
        streak: newStreak,
        last_active: today.toISOString()
      })
      .eq('user_id', userId)
  }
}

export async function getDueCount(userId: string): Promise<number> {
  const supabase = await getSupabaseClient()
  const now = new Date().toISOString()
  
  const { count } = await supabase
    .from('user_progress')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('cards.pattern', ACTIVE_PATTERN)
    .lte('next_due', now)
  
  return count || 0
}

export async function getWeakestPatterns(userId: string): Promise<Array<{ pattern: string; mastery: number }>> {
  const supabase = await getSupabaseClient()
  
  const { data: userProgress } = await supabase
    .from('user_progress')
    .select(`
      last_grade,
      cards!inner (
        pattern
      )
    `)
    .eq('user_id', userId)
    .eq('cards.pattern', ACTIVE_PATTERN)
    .not('last_grade', 'is', null)
  
  // Calculate mastery for the active pattern only
  const patternMastery = new Map<string, { totalGrade: number; count: number }>()
  
  if (userProgress) {
    for (const progress of userProgress) {
      if (progress.last_grade && progress.cards) {
        const pattern = (progress.cards as any).pattern
        const existing = patternMastery.get(pattern) || { totalGrade: 0, count: 0 }
        
        patternMastery.set(pattern, {
          totalGrade: existing.totalGrade + progress.last_grade,
          count: existing.count + 1
        })
      }
    }
  }
  
  return Array.from(patternMastery.entries())
    .map(([pattern, data]) => ({
      pattern,
      mastery: Math.round((data.totalGrade / data.count) * 20) // Convert to percentage
    }))
    .sort((a, b) => a.mastery - b.mastery)
}
