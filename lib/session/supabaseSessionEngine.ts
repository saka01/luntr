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
const MAX_NEW_PER_SESSION = 3;
const RECENT_MISS_HOURS = 48;

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

    // 1. Get due cards (~60%)
    const dueCount = Math.ceil(size * 0.6);
    const dueCards = await this.getDueCards(dueCount, excludeCardIds, weights);

    // 2. Get recent misses (~20%)
    const missCount = Math.ceil(size * 0.2);
    const recentMisses = await this.getRecentMisses(missCount, excludeCardIds, weights);

    // 3. Get new cards (up to 3 per session)
    const newCount = Math.min(MAX_NEW_PER_SESSION, Math.floor(size / 3));
    const newCards = await this.getNewCards(newCount, excludeCardIds, weights);

    // 4. Combine and deduplicate
    const allCards = [...dueCards, ...recentMisses, ...newCards];
    const uniqueCards = this.deduplicateCards(allCards);

    // 5. Inject insight cards every 4-5 cards or after misses
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
