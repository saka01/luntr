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

// Helper function to shuffle array using Fisher-Yates algorithm
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

// Smart shuffle to prevent consecutive cards of the same type
function smartShuffleForDistribution(cards: SessionCard[]): SessionCard[] {
  if (cards.length <= 2) return shuffleArray(cards)
  
  // Group cards by type
  const typeGroups = new Map<string, SessionCard[]>()
  cards.forEach(card => {
    if (!typeGroups.has(card.type)) {
      typeGroups.set(card.type, [])
    }
    typeGroups.get(card.type)!.push(card)
  })
  
  // Shuffle each group
  typeGroups.forEach((group, type) => {
    typeGroups.set(type, shuffleArray(group))
  })
  
  // Interleave cards from different types to avoid repetition
  const result: SessionCard[] = []
  const types = Array.from(typeGroups.keys())
  const positions = new Map<string, number>()
  types.forEach(type => positions.set(type, 0))
  
  let totalCards = cards.length
  let lastType: string | null = null
  let consecutiveSameType = 0
  
  while (result.length < totalCards) {
    // Find available types (types that still have cards)
    const availableTypes = types.filter(type => 
      (positions.get(type) || 0) < typeGroups.get(type)!.length
    )
    
    if (availableTypes.length === 0) break
    
    // Prefer types different from the last one
    const differentTypes = availableTypes.filter(t => t !== lastType)
    const candidates = differentTypes.length > 0 ? differentTypes : availableTypes
    
    // Pick a random type from candidates
    const selectedType = candidates[Math.floor(Math.random() * candidates.length)]
    
    // Get the next card of this type
    const pos = positions.get(selectedType) || 0
    const card = typeGroups.get(selectedType)![pos]
    
    positions.set(selectedType, pos + 1)
    result.push(card)
    
    // Track consecutive same types
    if (selectedType === lastType) {
      consecutiveSameType++
    } else {
      consecutiveSameType = 0
    }
    
    lastType = selectedType
  }
  
  return result
}

export async function getSessionCards(userId: string, size: number = 10, excludeCardIds: string[] = [], pattern: string = 'two-pointers'): Promise<SessionCard[]> {
  try {
    const supabase = await getSupabaseClient()
    const now = new Date().toISOString()
    
    // Normalize exclude list: drop empty values and precompute PostgREST IN list (quoted)
    const normalizedExcludeIds = (excludeCardIds || []).filter(id => !!id && id.trim().length > 0)
    const toInList = (ids: string[]) => `(${ids.map(id => `"${id}"`).join(',')})`
    
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
    
    // NEW PRIORITY-BASED SPACED REPETITION ALGORITHM
    
    // 1. Get ALL due cards with their EF and reps for priority scoring
    let dueProgressQuery = supabase
      .from('user_progress')
      .select(`
        card_id,
        next_due,
        ef,
        reps,
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
      .order('next_due', { ascending: true })
      .limit(100)
  
    if (patternFilter) {
      dueProgressQuery = dueProgressQuery.eq('cards.pattern', patternFilter)
    }
  
    if (normalizedExcludeIds.length > 0) {
      normalizedExcludeIds.forEach(excludeId => {
        dueProgressQuery = dueProgressQuery.neq('card_id', excludeId)
      })
    }
  
    const { data: dueProgressData } = await dueProgressQuery
    
    console.log(`Due cards: ${dueProgressData?.length || 0}`)
    
    // 2. Get recent misses (last 72 hours) - these get highest priority
    const since = new Date(Date.now() - 72 * 3600 * 1000).toISOString()
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
      .order('created_at', { ascending: false })
      .limit(50)
  
    if (patternFilter) {
      recentMissesQuery = recentMissesQuery.eq('cards.pattern', patternFilter)
    }
  
    if (normalizedExcludeIds.length > 0) {
      normalizedExcludeIds.forEach(excludeId => {
        recentMissesQuery = recentMissesQuery.neq('card_id', excludeId)
      })
    }
  
    const { data: recentMissesData } = await recentMissesQuery
    
    console.log(`Recent misses: ${recentMissesData?.length || 0}`)
    
    // 3. Get new cards candidates
    const { data: userCardIds } = await supabase
      .from('user_progress')
      .select('card_id')
      .eq('user_id', userId)
  
    const userCardIdSet = new Set(userCardIds?.map(p => p.card_id) || [])
  
    let newCardsQuery = supabase
      .from('cards')
      .select('*')
      .order('random()')
      .limit(200) // Increased to ensure we have variety
  
    if (patternFilter) {
      newCardsQuery = newCardsQuery.eq('pattern', patternFilter)
    }
  
    if (normalizedExcludeIds.length > 0) {
      // Filter out excluded cards by using filter with not in
      normalizedExcludeIds.forEach(excludeId => {
        newCardsQuery = newCardsQuery.neq('id', excludeId)
      })
    }
  
    const { data: newCardsData } = await newCardsQuery
    
    console.log(`New cards from DB: ${newCardsData?.length || 0}`)
    console.log(`User has progress on: ${userCardIdSet.size} cards`)
    console.log(`Excluding: ${normalizedExcludeIds.length} cards`)
    
    const newCards = (newCardsData || []).filter(card => 
      !userCardIdSet.has(card.id) && !normalizedExcludeIds.includes(card.id)
    )
    
    console.log(`After filtering: ${newCards.length} new cards`)
    
    // 4. Calculate priority scores for each card
    const scoredCards: Array<{ card: any; priority: number; isNew: boolean }> = []
    
    // Score due cards by urgency and ease factor
    if (dueProgressData) {
      for (const item of dueProgressData) {
        const daysOverdue = Math.floor((new Date(now).getTime() - new Date(item.next_due).getTime()) / (1000 * 60 * 60 * 24))
        const urgencyBonus = daysOverdue > 7 ? 1.5 : 1.0
        const ef = item.ef || 2.5
        const reps = item.reps || 0
        // Lower EF means harder to remember, so higher priority
        // More overdue = higher priority
        const priority = (1 / ef) * urgencyBonus * 100
        scoredCards.push({ 
          card: item.cards, 
          priority,
          isNew: false
        })
      }
    }
    
    // Recent misses get very high priority (200)
    if (recentMissesData) {
      for (const item of recentMissesData) {
        scoredCards.push({ 
          card: item.cards, 
          priority: 200,
          isNew: false
        })
      }
    }
    
    // New cards get low priority (50) and limited count
    for (const card of newCards) {
      scoredCards.push({ 
        card, 
        priority: 50,
        isNew: true
      })
    }
    
    // 5. Sort by priority (highest first)
    scoredCards.sort((a, b) => b.priority - a.priority)
    
    // 6. Select cards with caps on new cards (prefer non-new cards, allow new cards if needed to fill)
    let newCardCount = 0
    const selected: any[] = []
    const seen = new Set<string>()
    
    for (const { card, priority, isNew } of scoredCards) {
      if (selected.length >= size) break
      if (seen.has(card.id)) continue
      if (normalizedExcludeIds.includes(card.id)) continue
      
      // For new cards: prefer to add only 2, but allow more if needed to reach size
      // For non-new cards: always add if we have space
      const canAddNewCard = isNew ? (newCardCount < 2) : true
      
      if (canAddNewCard) {
        selected.push(card)
        seen.add(card.id)
        if (isNew) newCardCount++
      } else if (isNew && newCardCount >= 2 && selected.length < size) {
        // We have 2 new cards already but not enough total cards - allow more new cards
        selected.push(card)
        seen.add(card.id)
        newCardCount++
      }
    }
    
    // 7. Fill remaining slots if needed
    if (selected.length < size) {
      let fillQuery = supabase
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
        .gt('next_due', now)
        .order('next_due', { ascending: true })
        .limit(size - selected.length)
      
      if (patternFilter) {
        fillQuery = fillQuery.eq('cards.pattern', patternFilter)
      }
      
      if (normalizedExcludeIds.length > 0) {
        normalizedExcludeIds.forEach(excludeId => {
          fillQuery = fillQuery.neq('card_id', excludeId)
        })
      }
      
      const { data: fillCardsData } = await fillQuery
      const fillCards = fillCardsData?.map((item: any) => item.cards) || []
      
      for (const card of fillCards) {
        if (selected.length >= size) break
        if (!seen.has(card.id)) {
          selected.push(card)
          seen.add(card.id)
        }
      }
    }
    
    // Smart shuffle to prevent consecutive cards of the same type
    const uniqueCards = smartShuffleForDistribution(selected)
    
    // Log details for debugging
    console.log(`getSessionCards: Found ${uniqueCards.length} cards (requested ${size}). Pattern: ${pattern}`)
    console.log(`Card types: ${uniqueCards.map(c => c.type).join(', ')}`)
    
    // Log warning if needed
    if (uniqueCards.length < size) {
      console.warn(`⚠️ Only ${uniqueCards.length} cards available (requested ${size}). User: ${userId}, Pattern: ${pattern}`)
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
      estSeconds: (card as any).est_seconds
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
    choiceIndexes?: number[];
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
    if (attemptData.choiceIndexes !== undefined) attemptRecord.choiceIndexes = attemptData.choiceIndexes;
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
    else newIntervalDays = Math.min(365, Math.max(1, Math.round(intervalDays * ef)));
  } else { // Too Easy (grade 1)
    newReps = reps + 1;
    newEf = ef + 0.1;
    if (newReps === 1) newIntervalDays = 3;
    else if (newReps === 2) newIntervalDays = 6;
    else newIntervalDays = Math.min(365, Math.max(1, Math.round(intervalDays * ef * 1.3)));
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
  
  // Get today's date in UTC to avoid timezone issues
  const today = new Date()
  const todayUTC = new Date(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate())
  
  if (!profile.last_active) {
    // First session
    await supabase
      .from('profiles')
      .update({
        streak: 1,
        last_active: todayUTC.toISOString()
      })
      .eq('user_id', userId)
  } else {
    const lastActiveDate = new Date(profile.last_active)
    const lastActiveUTC = new Date(lastActiveDate.getUTCFullYear(), lastActiveDate.getUTCMonth(), lastActiveDate.getUTCDate())
    
    // Calculate days difference using UTC dates
    const daysDiff = Math.floor((todayUTC.getTime() - lastActiveUTC.getTime()) / (24 * 60 * 60 * 1000))
    
    let newStreak = profile.streak || 0
    
    if (daysDiff === 1) {
      // Consecutive day - increment streak
      newStreak += 1
    } else if (daysDiff > 1) {
      // Gap in days - reset streak to 1
      newStreak = 1
    }
    // If daysDiff === 0, same day, keep current streak
    
    await supabase
      .from('profiles')
      .update({
        streak: newStreak,
        last_active: todayUTC.toISOString()
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
