import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { CardType, Difficulty } from '@prisma/client';

export interface SessionCard {
  id: string;
  slug: string;
  pattern: string;
  type: CardType;
  difficulty: Difficulty;
  prompt: any;
  answer: any;
  subtype?: string;
  tags?: string;
  estSeconds?: number;
}

export interface StudySessionData {
  id: string;
  userId: string;
  pattern: string;
  startedAt: Date;
  endedAt?: Date | null;
  sizePlanned: number;
  sizeCompleted: number;
  servedCardIds: string[] | any;
  accuracy?: number | null;
  avgResponseMs?: number | null;
}

const RECOMMENDED_SIZE = 10;
const MORE_STEP = 10;
const MAX_NEW_PER_SESSION = 2; // Reduced to prevent overwhelming
const RECENT_MISS_HOURS = 72; // Increased to 72 hours for better retention
const OVERDUE_DAYS_FOR_BONUS = 7; // Cards overdue by >7 days get bonus priority

// Adaptive difficulty weights
const DEFAULT_WEIGHTS = { E: 0.4, M: 0.45, H: 0.15 };
const MASTERY_WEIGHTS = { E: 0.25, M: 0.45, H: 0.30 };
const MASTERY_THRESHOLD = 0.75;

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

export class SupabaseSessionEngine {
  private sessionId?: string;
  private userId: string;
  private pattern: string;
  private servedCardIds: Set<string> = new Set();

  constructor(userId: string, pattern: string) {
    this.userId = userId;
    this.pattern = pattern;
  }

  async startSession(size: number = RECOMMENDED_SIZE): Promise<{ sessionId: string; cards: SessionCard[] }> {
    const supabase = await getSupabaseClient();
    
    // Create new study session
    const { data: session, error } = await supabase
      .from('study_sessions')
      .insert({
        user_id: this.userId,
        pattern: this.pattern,
        size_planned: size,
        served_card_ids: []
      })
      .select()
      .single();

    if (error) throw error;

    this.sessionId = session.id;
    
    // Build initial session
    const cards = await this.buildSession(size);
    await this.updateServedCards(cards.map(c => c.id));
    
    return { sessionId: session.id, cards };
  }

  async addMoreCards(size: number = MORE_STEP): Promise<SessionCard[]> {
    if (!this.sessionId) {
      throw new Error('No active session');
    }

    const cards = await this.buildSession(size, Array.from(this.servedCardIds));
    await this.updateServedCards(cards.map(c => c.id));
    
    return cards;
  }

  async endSession(): Promise<StudySessionData> {
    if (!this.sessionId) {
      throw new Error('No active session');
    }

    const supabase = await getSupabaseClient();

    // Calculate session metrics
    const { data: attempts } = await supabase
      .from('attempts')
      .select('*')
      .eq('user_id', this.userId)
      .in('card_id', Array.from(this.servedCardIds))
      .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

    const accuracy = this.calculateAccuracy(attempts || []);
    const avgResponseMs = this.calculateAvgResponseTime(attempts || []);

    const { data: session, error } = await supabase
      .from('study_sessions')
      .update({
        ended_at: new Date().toISOString(),
        size_completed: this.servedCardIds.size,
        served_card_ids: Array.from(this.servedCardIds),
        accuracy,
        avg_response_ms: avgResponseMs
      })
      .eq('id', this.sessionId)
      .select()
      .single();

    if (error) throw error;

    return {
      id: session.id,
      userId: session.user_id,
      pattern: session.pattern,
      startedAt: new Date(session.started_at),
      endedAt: session.ended_at ? new Date(session.ended_at) : undefined,
      sizePlanned: session.size_planned,
      sizeCompleted: session.size_completed,
      servedCardIds: session.served_card_ids,
      accuracy: session.accuracy,
      avgResponseMs: session.avg_response_ms
    };
  }

  private async buildSession(size: number, excludeCardIds: string[] = []): Promise<SessionCard[]> {
    const supabase = await getSupabaseClient();
    const now = new Date().toISOString();
    const since = new Date(Date.now() - RECENT_MISS_HOURS * 3600 * 1000).toISOString();

    // Get user's recent performance for adaptive difficulty
    const userMastery = await this.getUserMastery();
    const weights = userMastery > MASTERY_THRESHOLD ? MASTERY_WEIGHTS : DEFAULT_WEIGHTS;

    // NEW SPACED REPETITION ALGORITHM - Priority-based selection
    
    // 1. Get ALL candidate cards with their priority scores
    const allDueCards = await this.getDueCardsWithPriority(excludeCardIds);
    const allRecentMisses = await this.getRecentMissesWithPriority(since, excludeCardIds);
    const candidateNewCards = await this.getCandidateNewCards(excludeCardIds);
    
    // 2. Calculate priority scores for each card
    const scoredCards: Array<{ card: any; priority: number }> = [];
    
    // Add due cards with urgency scores (more overdue = higher priority)
    for (const card of allDueCards) {
      const daysOverdue = this.calculateDaysOverdue(card.next_due, now);
      const urgencyBonus = daysOverdue > OVERDUE_DAYS_FOR_BONUS ? 1.5 : 1.0;
      const ef = card.ef || 2.5; // Lower ease factor = harder to remember
      const priority = (1 / ef) * urgencyBonus * 100; // Inverse EF means higher priority
      scoredCards.push({ card, priority });
    }
    
    // Add recent misses with high priority (2x boost for learning)
    for (const card of allRecentMisses) {
      const priority = 200; // High fixed priority for recent failures
      scoredCards.push({ card, priority });
    }
    
    // Add new cards with low priority (they'll be included but limited)
    for (const card of candidateNewCards) {
      const priority = 50; // Low priority, but will be included up to limit
      scoredCards.push({ card, priority });
    }
    
    // 3. Sort by priority (highest first)
    scoredCards.sort((a, b) => b.priority - a.priority);
    
    // 4. Apply caps based on card type
    let newCardCount = 0;
    const selectedCards: any[] = [];
    
    for (const { card, priority } of scoredCards) {
      if (selectedCards.length >= size) break;
      
      // Skip if already selected
      if (selectedCards.some(c => c.id === card.id)) continue;
      
      // Skip if excluded
      if (excludeCardIds.includes(card.id)) continue;
      
      // Check if this is a new card (no progress or low reps)
      const isNewCard = !card.next_due || card.reps === 0 || card.reps === null;
      
      if (isNewCard) {
        if (newCardCount < MAX_NEW_PER_SESSION) {
          selectedCards.push(card);
          newCardCount++;
        }
      } else {
        // Not a new card, always add based on priority
        selectedCards.push(card);
      }
    }
    
    // 5. Map to SessionCard format with difficulty weighting
    const sessionCards = this.applyDifficultyWeights(
      selectedCards.map(sc => sc.cards || sc),
      selectedCards.length,
      weights
    );
    
    // 6. Inject insight cards and deduplicate
    const uniqueCards = this.deduplicateCards(sessionCards);
    const cardsWithInsights = await this.injectInsightCards(uniqueCards);

    return cardsWithInsights.slice(0, size);
  }

  private async getDueCards(count: number, excludeCardIds: string[], weights: Record<string, number>): Promise<SessionCard[]> {
    const supabase = await getSupabaseClient();
    const now = new Date().toISOString();
    
    let query = supabase
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
      .eq('user_id', this.userId)
      .eq('cards.pattern', this.pattern)
      .lte('next_due', now)
      .limit(count * 2);

    if (excludeCardIds.length > 0) {
      query = query.not('card_id', 'in', `(${excludeCardIds.join(',')})`);
    }

    const { data: dueProgress } = await query;
    const cards = dueProgress?.map((item: any) => item.cards) || [];

    // Apply adaptive difficulty weighting
    return this.applyDifficultyWeights(cards, count, weights);
  }

  private async getDueCardsWithPriority(excludeCardIds: string[]): Promise<any[]> {
    const supabase = await getSupabaseClient();
    const now = new Date().toISOString();
    
    let query = supabase
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
      .eq('user_id', this.userId)
      .eq('cards.pattern', this.pattern)
      .lte('next_due', now)
      .order('next_due', { ascending: true })
      .limit(100); // Get more cards for priority scoring

    if (excludeCardIds.length > 0) {
      query = query.not('card_id', 'in', `(${excludeCardIds.join(',')})`);
    }

    const { data: dueProgress } = await query;
    return dueProgress || [];
  }

  private async getRecentMissesWithPriority(since: string, excludeCardIds: string[]): Promise<any[]> {
    const supabase = await getSupabaseClient();
    
    let query = supabase
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
      .eq('user_id', this.userId)
      .eq('cards.pattern', this.pattern)
      .gte('created_at', since)
      .or('grade.eq.5,timed_out.eq.true')
      .order('created_at', { ascending: false })
      .limit(50);

    if (excludeCardIds.length > 0) {
      query = query.not('card_id', 'in', `(${excludeCardIds.join(',')})`);
    }

    const { data: recentMisses } = await query;
    const cards = recentMisses?.map((item: any) => item.cards) || [];
    return cards.map((card: any) => ({ cards: card }));
  }

  private async getCandidateNewCards(excludeCardIds: string[]): Promise<any[]> {
    const supabase = await getSupabaseClient();

    // Get cards without progress entries
    const { data: userCardIds } = await supabase
      .from('user_progress')
      .select('card_id')
      .eq('user_id', this.userId);

    const userCardIdSet = new Set(userCardIds?.map(p => p.card_id) || []);
    const allExcludeIds = [...excludeCardIds, ...Array.from(this.servedCardIds)];

    let query = supabase
      .from('cards')
      .select('*')
      .eq('pattern', this.pattern)
      .limit(100);

    if (allExcludeIds.length > 0) {
      query = query.not('id', 'in', `(${allExcludeIds.join(',')})`);
    }

    const { data: newCards } = await query;
    return (newCards || []).filter((card: any) => !userCardIdSet.has(card.id));
  }

  private calculateDaysOverdue(nextDue: string, now: string): number {
    const nextDueDate = new Date(nextDue);
    const nowDate = new Date(now);
    const diffMs = nowDate.getTime() - nextDueDate.getTime();
    return Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));
  }

  private async getRecentMisses(count: number, excludeCardIds: string[], weights: Record<string, number>): Promise<SessionCard[]> {
    const supabase = await getSupabaseClient();
    const since = new Date(Date.now() - RECENT_MISS_HOURS * 3600 * 1000).toISOString();
    
    let query = supabase
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
      .eq('user_id', this.userId)
      .eq('cards.pattern', this.pattern)
      .gte('created_at', since)
      .or('grade.eq.5,timed_out.eq.true')
      .limit(count * 2);

    if (excludeCardIds.length > 0) {
      query = query.not('card_id', 'in', `(${excludeCardIds.join(',')})`);
    }

    const { data: recentMisses } = await query;
    const cards = recentMisses?.map((item: any) => item.cards) || [];

    // Apply adaptive difficulty weighting
    return this.applyDifficultyWeights(cards, count, weights);
  }

  private async getNewCards(count: number, excludeCardIds: string[], weights: Record<string, number>): Promise<SessionCard[]> {
    const supabase = await getSupabaseClient();

    // Get cards without progress entries
    const { data: userCardIds } = await supabase
      .from('user_progress')
      .select('card_id')
      .eq('user_id', this.userId);

    const userCardIdSet = new Set(userCardIds?.map(p => p.card_id) || []);
    const allExcludeIds = [...excludeCardIds, ...Array.from(this.servedCardIds)];

    let query = supabase
      .from('cards')
      .select('*')
      .eq('pattern', this.pattern)
      .limit(count * 2);

    if (allExcludeIds.length > 0) {
      query = query.not('id', 'in', `(${allExcludeIds.join(',')})`);
    }

    const { data: newCards } = await query;

    // Filter out cards user already has progress for
    const filteredNewCards = (newCards || []).filter(card => !userCardIdSet.has(card.id));

    // Apply adaptive difficulty weighting with bias toward Easy/Medium for new cards
    return this.applyNewCardBias(filteredNewCards, count, weights);
  }

  private async injectInsightCards(cards: SessionCard[]): Promise<SessionCard[]> {
    const supabase = await getSupabaseClient();
    
    // Get insight cards for injection
    const { data: insightCards } = await supabase
      .from('cards')
      .select('*')
      .eq('pattern', this.pattern)
      .eq('type', 'insight')
      .limit(10);

    if (!insightCards || insightCards.length === 0) return cards;

    const insightCardsMapped = insightCards.map(this.mapToSessionCard);
    const nonInsightCards = cards.filter((c: any) => c.type !== 'insight');
    
    const result: SessionCard[] = [];
    let insightIndex = 0;
    let injectAfter = 4; // Start injecting after 4 cards

    for (let i = 0; i < nonInsightCards.length; i++) {
      result.push(nonInsightCards[i]);
      
      // Inject insight card every 4-5 cards or after a miss
      if (i === injectAfter - 1 && insightIndex < insightCardsMapped.length) {
        result.push(insightCardsMapped[insightIndex]);
        insightIndex++;
        injectAfter += 4 + Math.floor(Math.random() * 2); // Next injection in 4-5 cards
      }
    }

    return result;
  }

  private applyDifficultyWeights(cards: any[], count: number, weights: Record<string, number>): SessionCard[] {
    const weightedCards: { card: any; weight: number }[] = [];
    
    for (const card of cards) {
      const weight = weights[card.difficulty] || 0.33;
      weightedCards.push({ card, weight });
    }

    // Weighted random selection
    const selected: SessionCard[] = [];
    const remaining = [...weightedCards];

    for (let i = 0; i < Math.min(count, remaining.length); i++) {
      const totalWeight = remaining.reduce((sum, item) => sum + item.weight, 0);
      let random = Math.random() * totalWeight;
      
      for (let j = 0; j < remaining.length; j++) {
        random -= remaining[j].weight;
        if (random <= 0) {
          selected.push(this.mapToSessionCard(remaining[j].card));
          remaining.splice(j, 1);
          break;
        }
      }
    }

    return selected;
  }

  private applyNewCardBias(cards: any[], count: number, weights: Record<string, number>): SessionCard[] {
    // For new cards, bias toward Easy first, then Medium, delay Hard until M accuracy >= 65%
    const easyCards = cards.filter(c => c.difficulty === 'E');
    const mediumCards = cards.filter(c => c.difficulty === 'M');
    const hardCards = cards.filter(c => c.difficulty === 'H');

    const selected: SessionCard[] = [];
    
    // Add Easy cards first
    selected.push(...easyCards.slice(0, Math.min(count, easyCards.length)).map(this.mapToSessionCard));
    
    // Add Medium cards
    const remaining = count - selected.length;
    selected.push(...mediumCards.slice(0, Math.min(remaining, mediumCards.length)).map(this.mapToSessionCard));
    
    // Add Hard cards only if we need more and have space
    const stillRemaining = count - selected.length;
    if (stillRemaining > 0) {
      selected.push(...hardCards.slice(0, Math.min(stillRemaining, hardCards.length)).map(this.mapToSessionCard));
    }

    return selected;
  }

  private deduplicateCards(cards: SessionCard[]): SessionCard[] {
    const seen = new Set<string>();
    return cards.filter(card => {
      if (seen.has(card.id)) return false;
      seen.add(card.id);
      return true;
    });
  }

  private mapToSessionCard(card: any): SessionCard {
    return {
      id: card.id,
      slug: card.slug,
      pattern: card.pattern,
      type: card.type,
      difficulty: card.difficulty,
      prompt: card.prompt,
      answer: card.answer,
      subtype: card.subtype,
      tags: card.tags,
      estSeconds: card.est_seconds
    };
  }

  private async getUserMastery(): Promise<number> {
    const supabase = await getSupabaseClient();
    
    // Get user's performance over last 3 sessions
    const { data: recentSessions } = await supabase
      .from('study_sessions')
      .select('accuracy')
      .eq('user_id', this.userId)
      .eq('pattern', this.pattern)
      .not('ended_at', 'is', null)
      .order('started_at', { ascending: false })
      .limit(3);

    if (!recentSessions || recentSessions.length === 0) return 0;

    const totalAccuracy = recentSessions.reduce((sum, session) => sum + (session.accuracy || 0), 0);
    return totalAccuracy / recentSessions.length;
  }

  private calculateAccuracy(attempts: any[]): number {
    if (attempts.length === 0) return 0;
    
    const correctAttempts = attempts.filter(a => a.grade <= 3).length;
    return correctAttempts / attempts.length;
  }

  private calculateAvgResponseTime(attempts: any[]): number {
    if (attempts.length === 0) return 0;
    
    const totalTime = attempts.reduce((sum, a) => sum + a.time_ms, 0);
    return totalTime / attempts.length;
  }

  private async updateServedCards(cardIds: string[]): Promise<void> {
    if (!this.sessionId) return;

    const supabase = await getSupabaseClient();
    cardIds.forEach(id => this.servedCardIds.add(id));
    
    await supabase
      .from('study_sessions')
      .update({
        served_card_ids: Array.from(this.servedCardIds),
        size_completed: this.servedCardIds.size
      })
      .eq('id', this.sessionId);
  }
}

// Helper function to create a session engine instance
export function createSupabaseSessionEngine(userId: string, pattern: string): SupabaseSessionEngine {
  return new SupabaseSessionEngine(userId, pattern);
}
