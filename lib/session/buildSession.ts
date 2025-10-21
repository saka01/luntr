import { prisma } from '@/lib/prisma';

const RECOMMENDED = 10;
export const MORE_STEP = 10;
const MAX_NEW_PER_SESSION = 3;

export async function buildSession(opts: {
  userId: string;
  pattern: string;
  size?: number;          // default RECOMMENDED; increase by MORE_STEP on demand
  excludeCardIds?: string[]; // to avoid repeating within the same day/session
}) {
  const { userId, pattern, size = RECOMMENDED, excludeCardIds = [] } = opts;
  const now = new Date();

  const due = await prisma.userProgress.findMany({
    where: { 
      userId, 
      card: { pattern }, 
      nextDue: { lte: now }, 
      NOT: { cardId: { in: excludeCardIds } } 
    },
    include: { card: true },
    take: 80
  });

  const since = new Date(Date.now() - 48 * 3600 * 1000);
  const recentMisses = await prisma.attempt.findMany({
    where: {
      userId,
      card: { pattern },
      createdAt: { gte: since },
      OR: [{ grade: 5 }, { timedOut: true }]
    },
    include: { card: true },
    take: 40
  });

  // new = cards without a progress row
  const newCards = await prisma.card.findMany({
    where: {
      pattern,
      id: { notIn: excludeCardIds },
      progress: { none: { userId } }
    },
    take: 100
  });

  const pick = deDupe([
    ...sampleBySubtype(due.map(p => p.card), Math.ceil(size * 0.6)),
    ...sampleBySubtype(recentMisses.map(a => a.card), Math.ceil(size * 0.2)),
    ...interleaveBySubtype(newCards, Math.min(MAX_NEW_PER_SESSION, Math.floor(size / 3)))
  ]).slice(0, size);

  return pick;
}

// --- helpers (simple, replace with your own util lib) ---
function deDupe(cards: any[]) {
  const seen = new Set<string>();
  const out: any[] = [];
  for (const c of cards) if (!seen.has(c.id)) { out.push(c); seen.add(c.id); }
  return out;
}

function sampleBySubtype(cards: any[], n: number) {
  // naive: shuffle then take n
  return shuffle(cards).slice(0, n);
}

function interleaveBySubtype(cards: any[], n: number) {
  return shuffle(cards).slice(0, n);
}

function shuffle<T>(a: T[]) {
  const x = [...a]; 
  for (let i = x.length - 1; i > 0; i--) { 
    const j = Math.floor(Math.random() * (i + 1)); 
    [x[i], x[j]] = [x[j], x[i]]; 
  }
  return x;
}
