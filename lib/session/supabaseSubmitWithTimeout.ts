import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { evaluate } from '@/lib/cards/eval';
import { schedule } from '@/lib/srs/schedule';
import type { AttemptPayload } from '@/lib/cards/types';

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

  const supabase = await getSupabaseClient();

  // Get card data
  const { data: card, error: cardError } = await supabase
    .from('cards')
    .select('*')
    .eq('id', cardId)
    .single();

  if (cardError || !card) {
    throw new Error('Card not found');
  }

  const answer = card.answer;

  // Evaluate (insight returns {correct:null})
  const { correct, feedback } = evaluate(card.type, answer, payload);

  // Persist attempt
  const attemptRecord: any = {
    user_id: userId,
    card_id: cardId,
    grade: finalGrade,
    feedback,
    time_ms: timeMs,
    timed_out: finalTimedOut
  };

  if (payload.type === 'mcq' && payload.choice !== undefined) {
    attemptRecord.choice = payload.choice;
  }
  if (payload.type === 'order' && payload.order !== undefined) {
    attemptRecord.order = payload.order;
  }
  if (payload.type === 'plan' && payload.text !== undefined) {
    attemptRecord.text = payload.text;
  }
  if (payload.type === 'fitb' && payload.blanks !== undefined) {
    attemptRecord.text = payload.blanks.join('|');
    attemptRecord.blanks = payload.blanks;
  }

  if (correct !== null) {
    attemptRecord.correct = !!correct;
  }

  const { data: attempt, error: attemptError } = await supabase
    .from('attempts')
    .insert(attemptRecord)
    .select()
    .single();

  if (attemptError) throw attemptError;

  // Upsert progress and schedule next due
  const { data: existingProgress } = await supabase
    .from('user_progress')
    .select('*')
    .eq('user_id', userId)
    .eq('card_id', cardId)
    .single();

  let progress;
  if (existingProgress) {
    progress = existingProgress;
  } else {
    const { data: newProgress, error: progressError } = await supabase
      .from('user_progress')
      .insert({
        user_id: userId,
        card_id: cardId,
        ef: 2.5,
        reps: 0,
        interval_days: 0,
        next_due: new Date().toISOString(),
        last_grade: null
      })
      .select()
      .single();

    if (progressError) throw progressError;
    progress = newProgress;
  }

  const updated = schedule({
    id: progress.id,
    ef: progress.ef,
    reps: progress.reps,
    intervalDays: progress.interval_days,
    nextDue: new Date(progress.next_due),
    lastGrade: progress.last_grade
  }, finalGrade as 1 | 3 | 5);

  // Handle recent-miss priority: if grade=5, force nextDue to "today"
  if (finalGrade === 5) {
    updated.nextDue = new Date(); // Show again today
  }

  const { error: updateError } = await supabase
    .from('user_progress')
    .update({
      ef: updated.ef,
      reps: updated.reps,
      interval_days: updated.intervalDays,
      next_due: updated.nextDue.toISOString(),
      last_grade: finalGrade
    })
    .eq('id', progress.id);

  if (updateError) throw updateError;

  return { 
    attemptId: attempt.id, 
    correct, 
    nextDue: updated.nextDue, 
    finalGrade, 
    finalTimedOut 
  };
}