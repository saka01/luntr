import { prisma } from '@/lib/prisma';
import { evaluate } from '@/lib/cards/eval';
import { schedule } from '@/lib/srs/schedule';
import type { AttemptPayload } from '@/lib/cards/types';

export async function submitAttempt(params: {
  userId: string;
  cardId: string;
  uiGrade: 1 | 3 | 5;
  payload: AttemptPayload;       // user response
  timeMs: number;
  timedOut?: boolean;
}) {
  const { userId, cardId, uiGrade, payload, timeMs, timedOut = false } = params;

  const card = await prisma.card.findUniqueOrThrow({ where: { id: cardId } });
  const answer = card.answer as any;

  // Evaluate (insight returns {correct:null})
  const { correct, feedback } = evaluate(card.type, answer, payload);

  // Persist attempt
  const attempt = await prisma.attempt.create({
    data: {
      userId, 
      cardId,
      grade: uiGrade,
      feedback,
      timeMs,
      timedOut,
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

  const updated = schedule(progress, uiGrade);

  await prisma.userProgress.update({
    where: { id: progress.id },
    data: {
      ef: updated.ef,
      reps: updated.reps,
      intervalDays: updated.intervalDays,
      nextDue: updated.nextDue,
      lastGrade: uiGrade
    }
  });

  return { attemptId: attempt.id, correct, nextDue: updated.nextDue };
}
