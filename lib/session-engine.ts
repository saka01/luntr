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
        get(name: string) {
          return cookieStore.get(name)?.value
        },
      },
    }
  )
}

export interface SessionCard {
  id: string
  slug: string
  pattern: string
  type: 'mcq' | 'plan'
  difficulty: 'E' | 'M' | 'H'
  prompt: any
  answer: any
}

export async function getSessionCards(userId: string): Promise<SessionCard[]> {
  const supabase = await getSupabaseClient()
  const now = new Date().toISOString()
  
  // Get cards due for review (up to 10) - ONLY from active pattern
  const { data: dueCardsData } = await supabase
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
        answer
      )
    `)
    .eq('user_id', userId)
    .eq('cards.pattern', ACTIVE_PATTERN)
    .lte('next_due', now)
    .order('created_at', { ascending: true })
    .limit(10)
  
  const dueCards = dueCardsData?.map((item: any) => item.cards) || []
  
  // If we have fewer than 10 cards, fill with new cards from active pattern
  if (dueCards.length < 10) {
    const remaining = 10 - dueCards.length
    
    // Get cards the user hasn't seen yet - ONLY from active pattern
    const { data: newCardsData } = await supabase
      .from('cards')
      .select('*')
      .eq('pattern', ACTIVE_PATTERN)
      .not('id', 'in', `(${dueCards.map(card => card.id).join(',')})`)
      .order('difficulty', { ascending: true })
      .limit(remaining)
    
    const newCards = newCardsData || []
    dueCards.push(...newCards)
  }
  
  return dueCards.map(card => ({
    id: card.id,
    slug: card.slug,
    pattern: card.pattern,
    type: card.type as 'mcq' | 'plan',
    difficulty: card.difficulty as 'E' | 'M' | 'H',
    prompt: card.prompt,
    answer: card.answer
  }))
}

export async function submitCardAttempt(
  userId: string,
  cardId: string,
  grade: number,
  feedback: any
) {
  const supabase = await getSupabaseClient()
  
  // Save the attempt
  await supabase
    .from('attempts')
    .insert({
      user_id: userId,
      card_id: cardId,
      grade,
      feedback
    })
  
  // Update or create user progress
  const { data: existingProgress } = await supabase
    .from('user_progress')
    .select('*')
    .eq('user_id', userId)
    .eq('card_id', cardId)
    .single()
  
  if (existingProgress) {
    // Update existing progress with SM-2
    const newParams = calculateNextInterval(grade, {
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
    const newParams = calculateNextInterval(grade, {
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
