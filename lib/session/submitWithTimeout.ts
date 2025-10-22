import { prisma } from '@/lib/prisma';
import { evaluate } from '@/lib/cards/eval';
import { schedule } from '@/lib/srs/schedule';
import type { AttemptPayload } from '@/lib/cards/types';

export async function submitAttemptWithTimeout(params: {
  userId: string;
  cardId: string;
  uiGrade: 1 | 3 | 5;
  payload: AttemptPayload;
  timeMs: number;
  timedOut?: boolean;
  lastInteractionTime?: number; // Timestamp of last user interaction
}) {
  const { userId, cardId, uiGrade, payload, timeMs, timedOut = false, lastInteractionTime } = params;

  // Apply timeout policy
  let finalGrade = uiGrade;
  let finalTimedOut = timedOut;
  
  if (lastInteractionTime) {
    const timeSinceInteraction = Date.now() - lastInteractionTime;
    const timeoutThreshold = 10000; // 10 seconds
    
    if (timeSinceInteraction > timeoutThreshold) {
      // No interaction in last 10s → treat as grade=5
      finalGrade = 5;
      finalTimedOut = true;
    } else if (timeMs > 0) {
      // There was interaction → treat as grade=3 to avoid over-penalizing
      finalGrade = 3;
    }
  }

  const card = await prisma.card.findUniqueOrThrow({ where: { id: cardId } });
  const answer = card.answer as any;

  // Evaluate (insight returns {correct:null})
  const { correct, feedback } = evaluate(card.type, answer, payload);

  // Persist attempt
  const attempt = await prisma.attempt.create({
    data: {
      userId, 
      cardId,
      grade: finalGrade,
      feedback,
      timeMs,
      timedOut: finalTimedOut,
      choice: payload.type === 'mcq' ? payload.choice : null,
      order:  payload.type === 'order' ? payload.order  : undefined,
      text:   payload.type === 'plan'  ? payload.text   : payload.type === 'fitb' ? payload.blanks.join('|') : null,
      blanks: payload.type === 'fitb'  ? payload.blanks : undefined,
      correct: correct === null ? null : !!correct
    }
  });

  // Upsert progress and schedule next due
  const existing = await prisma.userProgress.findUnique({ 
    where: { userId_cardId: { userId, cardId } } 
  });
  
  const progress = existing ?? await prisma.userProgress.create({
    data: { userId, cardId } as any
  });

  const updated = schedule(progress, finalGrade as 1 | 3 | 5);

  // Handle recent-miss priority: if grade=5, force nextDue to "today"
  if (finalGrade === 5) {
    updated.nextDue = new Date(); // Show again today
  }

  await prisma.userProgress.update({
    where: { id: progress.id },
    data: {
      ef: updated.ef,
      reps: updated.reps,
      intervalDays: updated.intervalDays,
      nextDue: updated.nextDue,
      lastGrade: finalGrade
    }
  });

  return { attemptId: attempt.id, correct, nextDue: updated.nextDue, finalGrade, finalTimedOut };
}