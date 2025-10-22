import { prisma } from '@/lib/prisma';
import { schedule } from '@/lib/srs/schedule';
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

export class SessionEngine {
  private sessionId?: string;
  private userId: string;
  private pattern: string;
  private servedCardIds: Set<string> = new Set();

  constructor(userId: string, pattern: string) {
    this.userId = userId;
    this.pattern = pattern;
  }

  async startSession(size: number = RECOMMENDED_SIZE): Promise<{ sessionId: string; cards: SessionCard[] }> {
    // Create new study session
    const session = await prisma.studySession.create({
      data: {
        userId: this.userId,
        pattern: this.pattern,
        sizePlanned: size,
        servedCardIds: []
      }
    });

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

    // Calculate session metrics
    const attempts = await prisma.attempt.findMany({
      where: {
        userId: this.userId,
        cardId: { in: Array.from(this.servedCardIds) },
        createdAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } // Last 24 hours
      }
    });

    const accuracy = this.calculateAccuracy(attempts);
    const avgResponseMs = this.calculateAvgResponseTime(attempts);

    const session = await prisma.studySession.update({
      where: { id: this.sessionId },
      data: {
        endedAt: new Date(),
        sizeCompleted: this.servedCardIds.size,
        servedCardIds: Array.from(this.servedCardIds),
        accuracy,
        avgResponseMs
      }
    });

    return session;
  }

  private async buildSession(size: number, excludeCardIds: string[] = []): Promise<SessionCard[]> {
    const now = new Date();
    const since = new Date(Date.now() - RECENT_MISS_HOURS * 3600 * 1000);

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
    const cardsWithInsights = this.injectInsightCards(uniqueCards);

    return cardsWithInsights.slice(0, size);
  }

  private async getDueCards(count: number, excludeCardIds: string[], weights: Record<string, number>): Promise<SessionCard[]> {
    const now = new Date();
    
    const dueProgress = await prisma.userProgress.findMany({
      where: {
        userId: this.userId,
        card: { pattern: this.pattern },
        nextDue: { lte: now },
        cardId: { notIn: excludeCardIds }
      },
      include: { card: true },
      take: count * 2 // Get more to sample from
    });

    // Apply adaptive difficulty weighting
    return this.applyDifficultyWeights(dueProgress.map(p => p.card), count, weights);
  }

  private async getRecentMisses(count: number, excludeCardIds: string[], weights: Record<string, number>): Promise<SessionCard[]> {
    const since = new Date(Date.now() - RECENT_MISS_HOURS * 3600 * 1000);
    
    const recentMisses = await prisma.attempt.findMany({
      where: {
        userId: this.userId,
        card: { pattern: this.pattern },
        createdAt: { gte: since },
        OR: [{ grade: 5 }, { timedOut: true }],
        cardId: { notIn: excludeCardIds }
      },
      include: { card: true },
      take: count * 2
    });

    // Apply adaptive difficulty weighting
    return this.applyDifficultyWeights(recentMisses.map(a => a.card), count, weights);
  }

  private async getNewCards(count: number, excludeCardIds: string[], weights: Record<string, number>): Promise<SessionCard[]> {
    // Get cards without progress entries
    const userCardIds = await prisma.userProgress.findMany({
      where: { userId: this.userId },
      select: { cardId: true }
    });

    const userCardIdSet = new Set(userCardIds.map(p => p.cardId));
    const allExcludeIds = [...excludeCardIds, ...Array.from(this.servedCardIds)];

    const newCards = await prisma.card.findMany({
      where: {
        pattern: this.pattern,
        id: { notIn: allExcludeIds },
        progress: { none: { userId: this.userId } }
      },
      take: count * 2
    });

    // Filter out cards user already has progress for
    const filteredNewCards = newCards.filter(card => !userCardIdSet.has(card.id));

    // Apply adaptive difficulty weighting with bias toward Easy/Medium for new cards
    return this.applyNewCardBias(filteredNewCards, count, weights);
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

  private injectInsightCards(cards: SessionCard[]): SessionCard[] {
    // Get insight cards for injection
    const insightCards = cards.filter(c => c.type === 'insight');
    const nonInsightCards = cards.filter(c => c.type !== 'insight');
    
    if (insightCards.length === 0) return cards;

    const result: SessionCard[] = [];
    let insightIndex = 0;
    let injectAfter = 4; // Start injecting after 4 cards

    for (let i = 0; i < nonInsightCards.length; i++) {
      result.push(nonInsightCards[i]);
      
      // Inject insight card every 4-5 cards or after a miss
      if (i === injectAfter - 1 && insightIndex < insightCards.length) {
        result.push(insightCards[insightIndex]);
        insightIndex++;
        injectAfter += 4 + Math.floor(Math.random() * 2); // Next injection in 4-5 cards
      }
    }

    return result;
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
      estSeconds: card.estSeconds
    };
  }

  private async getUserMastery(): Promise<number> {
    // Get user's performance over last 3 sessions
    const recentSessions = await prisma.studySession.findMany({
      where: {
        userId: this.userId,
        pattern: this.pattern,
        endedAt: { not: null }
      },
      orderBy: { startedAt: 'desc' },
      take: 3
    });

    if (recentSessions.length === 0) return 0;

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
    
    const totalTime = attempts.reduce((sum, a) => sum + a.timeMs, 0);
    return totalTime / attempts.length;
  }

  private async updateServedCards(cardIds: string[]): Promise<void> {
    if (!this.sessionId) return;

    cardIds.forEach(id => this.servedCardIds.add(id));
    
    await prisma.studySession.update({
      where: { id: this.sessionId },
      data: {
        servedCardIds: Array.from(this.servedCardIds),
        sizeCompleted: this.servedCardIds.size
      }
    });
  }
}

// Helper function to create a session engine instance
export function createSessionEngine(userId: string, pattern: string): SessionEngine {
  return new SessionEngine(userId, pattern);
}