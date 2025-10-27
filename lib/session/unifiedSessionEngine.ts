import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { CardType, Difficulty } from '@prisma/client';
import { fromZonedTime, toZonedTime } from 'date-fns-tz';
import { startOfDay, addDays } from 'date-fns';

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

const RECOMMENDED_SIZE = 10;
const RECENT_MISS_HOURS = 72;
const OVERDUE_DAYS_FOR_BONUS = 7;
const MAX_NEW_INITIAL = 5;
const MAX_NEW_ADD_MORE = 8;

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

export class UnifiedSessionEngine {
  private sessionId?: string;
  private userId: string;
  private pattern: string;
  private servedCardIds: Set<string> = new Set();
  private newCardsServed: number = 0;

  constructor(userId: string, pattern: string) {
    this.userId = userId;
    this.pattern = pattern;
  }

  private normalizePattern(pattern: string): string {
    // Map pattern IDs to actual pattern names in the database
    if (pattern === 'two-pointers') {
      return 'Two Pointers';
    }
    if (pattern === 'sliding-window') {
      return 'Sliding Window';
    }
    if (pattern === 'binary-search') {
      return 'Binary Search';
    }
    if (pattern === 'dynamic-programming') {
      return 'Dynamic Programming';
    }
    // Default: assume pattern is already in correct format
    return pattern;
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
        served_card_ids: [],
        new_card_count: 0
      })
      .select()
      .single();

    if (error) throw error;

    this.sessionId = session.id;
    this.servedCardIds.clear();
    this.newCardsServed = 0;
    
    // Build initial session
    const cards = await this.buildSession(size, []);
    await this.updateServedCards(cards.map(c => c.id));
    
    return { sessionId: session.id, cards };
  }

  async addMoreCards(size: number = RECOMMENDED_SIZE): Promise<SessionCard[]> {
    if (!this.sessionId) {
      throw new Error('No active session');
    }

    const excludeCardIds = Array.from(this.servedCardIds);
    const cards = await this.buildSession(size, excludeCardIds, true);
    await this.updateServedCards(cards.map(c => c.id));
    
    return cards;
  }

  async endSession(): Promise<any> {
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

    return session;
  }

  private async buildSession(size: number, excludeCardIds: string[] = [], isAddMore: boolean = false): Promise<SessionCard[]> {
    const supabase = await getSupabaseClient();
    const now = new Date().toISOString();
    const since = new Date(Date.now() - RECENT_MISS_HOURS * 3600 * 1000).toISOString();

    // Get user timezone
    const { data: profile } = await supabase
      .from('profiles')
      .select('timezone')
      .eq('user_id', this.userId)
      .single();

    const userTimezone = profile?.timezone || 'America/Toronto';

    // Check if user has any progress (for determining new card limits)
    const { count: progressCount } = await supabase
      .from('user_progress')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', this.userId);
    
    const hasAnyProgress = (progressCount || 0) > 0;

    // PRIORITY-BASED SELECTION ALGORITHM
    
    // 1. Fetch candidates with limits
    const recentMisses = await this.getRecentMisses(6, since, excludeCardIds, userTimezone); // top 6, 72h
    const dueCards = await this.getDueCards(200, excludeCardIds, userTimezone); // up to 200
    const newCards = await this.getNewCards(100, excludeCardIds); // up to 100

    // 2. Score each card by priority
    const scoredCards: Array<{ card: any; priority: number; isNew: boolean; isMiss: boolean }> = [];

    // Recent Misses: Priority 200 + noise (±5)
    for (const miss of recentMisses) {
      const noise = (Math.random() - 0.5) * 10; // ±5
      scoredCards.push({ 
        card: miss, 
        priority: 200 + noise,
        isNew: false,
        isMiss: true 
      });
    }

    // Due Cards: (1 / ef) * urgency * 100 + noise
    // Optional: Add difficulty weighting here
    for (const due of dueCards) {
      const daysOverdue = this.calculateDaysOverdue(due.next_due, now);
      const urgency = daysOverdue > OVERDUE_DAYS_FOR_BONUS ? 1.5 : 1.0;
      const noise = (Math.random() - 0.5) * 10;
      const ef = due.ef || 2.5;
      let priority = (1 / ef) * urgency * 100 + noise;
      
      // Optional difficulty adjustment:
      // if (due.cards.difficulty === 'E') priority *= 0.8;  // Slight boost for Easy
      // if (due.cards.difficulty === 'H') priority *= 1.1;  // Slight boost for Hard
      
      scoredCards.push({ 
        card: due.cards, 
        priority,
        isNew: false,
        isMiss: false 
      });
    }

    // New Cards: Priority 20 (only if needed)
    if (scoredCards.length < size) {
      for (const card of newCards) {
        scoredCards.push({ 
          card, 
          priority: 20,
          isNew: true,
          isMiss: false 
        });
      }
    }

    // 3. Sort by priority DESC
    scoredCards.sort((a, b) => b.priority - a.priority);

    // 4. Select with constraints
    let newCardCount = 0;
    // For new users with no progress, allow more new cards to fill the session
    const newCardLimit = hasAnyProgress 
      ? (isAddMore ? MAX_NEW_ADD_MORE : MAX_NEW_INITIAL)
      : size; // If no progress, allow enough new cards to fill the entire session
    
    const selected: any[] = [];
    const seen = new Set<string>();

    for (const { card, priority, isNew, isMiss } of scoredCards) {
      if (selected.length >= size) break;
      if (seen.has(card.id)) continue;
      if (excludeCardIds.includes(card.id)) continue;

      // Check if grade=5 today (same-day prevention)
      if (await this.wasGrade5Today(card.id, userTimezone)) continue;

      // New card cap
      if (isNew && newCardCount >= newCardLimit) continue;

      selected.push(card);
      seen.add(card.id);
      if (isNew) newCardCount++;
    }

    // 5. Fill remaining slots with not-yet-due cards if needed
    if (selected.length < size) {
      const fillCards = await this.getNotYetDueCards(size - selected.length, excludeCardIds, userTimezone);
      for (const card of fillCards) {
        if (!seen.has(card.id)) {
          selected.push(card);
          seen.add(card.id);
        }
      }
    }
    
    // 6. If still not enough and user has no progress, fill with more new cards
    if (selected.length < size && !hasAnyProgress) {
      const additionalNeeded = size - selected.length;
      const moreNewCards = await this.getNewCards(additionalNeeded, [...excludeCardIds, ...selected.map(c => c.id)]);
      for (const card of moreNewCards) {
        if (!seen.has(card.id)) {
          selected.push(card);
          seen.add(card.id);
        }
      }
    }

    // 7. Inject insights (max 2 per 10 cards, never first/last/consecutive)
    const cardsWithInsights = await this.injectInsights(selected, size);

    // Update new cards count
    this.newCardsServed += newCardCount;

    return cardsWithInsights;
  }

  private async wasGrade5Today(cardId: string, tz: string): Promise<boolean> {
    const supabase = await getSupabaseClient();
    const now = new Date();
    const userNow = toZonedTime(now, tz);
    const todayStart = startOfDay(userNow);
    const todayStartUtc = fromZonedTime(todayStart, tz);

    const { data } = await supabase
      .from('attempts')
      .select('id')
      .eq('user_id', this.userId)
      .eq('card_id', cardId)
      .eq('grade', 5)
      .gte('created_at', todayStartUtc.toISOString())
      .limit(1);

    return (data?.length ?? 0) > 0;
  }

  private async getRecentMisses(limit: number, since: string, excludeCardIds: string[], tz: string): Promise<any[]> {
    const supabase = await getSupabaseClient();
    
    const sinceUtc = fromZonedTime(new Date(since), tz).toISOString();
    
    let query = supabase
      .from('attempts')
      .select('card_id, cards!inner (*)')
      .eq('user_id', this.userId)
      .gte('created_at', sinceUtc)
      .or('grade.eq.5,timed_out.eq.true')
      .order('created_at', { ascending: false })
      .limit(50);

    if (excludeCardIds.length > 0) {
      query = query.not('card_id', 'in', `(${excludeCardIds.map(id => `"${id}"`).join(',')})`);
    }

    const { data } = await query;
    
    // Deduplicate by card_id (keep most recent)
    const seen = new Set<string>();
    const unique = (data || []).filter((item: any) => {
      if (seen.has(item.card_id)) return false;
      seen.add(item.card_id);
      return true;
    }).slice(0, limit);

    return unique.map((item: any) => item.cards);
  }

  private async getDueCards(limit: number, excludeCardIds: string[], tz: string): Promise<any[]> {
    const supabase = await getSupabaseClient();
    const now = new Date().toISOString();
    const normalizedPattern = this.normalizePattern(this.pattern);
    
    let query = supabase
      .from('user_progress')
      .select('card_id, next_due, ef, reps, cards!inner (*)')
      .eq('user_id', this.userId)
      .eq('cards.pattern', normalizedPattern)
      .lte('next_due', now)
      .order('next_due', { ascending: true })
      .limit(limit);

    if (excludeCardIds.length > 0) {
      query = query.not('card_id', 'in', `(${excludeCardIds.map(id => `"${id}"`).join(',')})`);
    }

    const { data } = await query;
    return data || [];
  }

  private async getNewCards(limit: number, excludeCardIds: string[]): Promise<any[]> {
    const supabase = await getSupabaseClient();
    const normalizedPattern = this.normalizePattern(this.pattern);

    const { data: userCardIds } = await supabase
      .from('user_progress')
      .select('card_id')
      .eq('user_id', this.userId);

    const userCardIdSet = new Set(userCardIds?.map(p => p.card_id) || []);
    const allExcludeIds = [...excludeCardIds, ...Array.from(this.servedCardIds)];

    let query = supabase
      .from('cards')
      .select('*')
      .eq('pattern', normalizedPattern)
      .limit(limit);

    if (allExcludeIds.length > 0) {
      query = query.not('id', 'in', `(${allExcludeIds.map(id => `"${id}"`).join(',')})`);
    }

    const { data: newCards } = await query;
    return (newCards || []).filter((card: any) => !userCardIdSet.has(card.id));
  }

  private async getNotYetDueCards(limit: number, excludeCardIds: string[], tz: string): Promise<any[]> {
    const supabase = await getSupabaseClient();
    const now = new Date().toISOString();
    const normalizedPattern = this.normalizePattern(this.pattern);
    
    let query = supabase
      .from('user_progress')
      .select('card_id, next_due, cards!inner (*)')
      .eq('user_id', this.userId)
      .eq('cards.pattern', normalizedPattern)
      .gt('next_due', now)
      .order('next_due', { ascending: true })
      .limit(limit);

    if (excludeCardIds.length > 0) {
      query = query.not('card_id', 'in', `(${excludeCardIds.map(id => `"${id}"`).join(',')})`);
    }

    const { data } = await query;
    return (data || []).map((item: any) => item.cards);
  }

  private async injectInsights(cards: any[], size: number): Promise<SessionCard[]> {
    const supabase = await getSupabaseClient();
    const normalizedPattern = this.normalizePattern(this.pattern);
    
    // Skip if too short
    if (cards.length < 5) {
      return cards.map(c => this.mapToSessionCard(c));
    }

    // Get insights
    const { data: insightCards } = await supabase
      .from('cards')
      .select('*')
      .eq('pattern', normalizedPattern)
      .eq('type', 'insight')
      .limit(10);

    if (!insightCards || insightCards.length === 0) {
      return cards.map(c => this.mapToSessionCard(c));
    }

    // Max 2 per 10 cards
    const maxInsights = Math.floor(size / 5);
    const nonInsights = cards.filter(c => c.type !== 'insight');
    const insights = insightCards.slice(0, Math.min(maxInsights, insightCards.length)).map(this.mapToSessionCard);

    const result: SessionCard[] = [];
    let insightIdx = 0;
    let nextInsertPos = 4; // Never position 0

    for (let i = 0; i < nonInsights.length; i++) {
      result.push(this.mapToSessionCard(nonInsights[i]));

      // Insert insight if: at position, have insights left, not last card, not after insight
      if (i === nextInsertPos && 
          insightIdx < insights.length && 
          i < nonInsights.length - 1 &&
          result[result.length - 1].type !== 'insight') {
        result.push(insights[insightIdx++]);
        nextInsertPos += 5;
      }
    }

    return result;
  }

  private calculateDaysOverdue(nextDue: string, now: string): number {
    const nextDueDate = new Date(nextDue);
    const nowDate = new Date(now);
    const diffMs = nowDate.getTime() - nextDueDate.getTime();
    return Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));
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
        size_completed: this.servedCardIds.size,
        new_card_count: this.newCardsServed
      })
      .eq('id', this.sessionId);
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
}

export function createUnifiedSessionEngine(userId: string, pattern: string): UnifiedSessionEngine {
  return new UnifiedSessionEngine(userId, pattern);
}

