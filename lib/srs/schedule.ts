import { fromZonedTime, toZonedTime } from 'date-fns-tz';
import { startOfDay, addDays } from 'date-fns';

export type UiGrade = 1 | 3 | 5; // 1=Too Easy, 3=Just Right, 5=Still Confusing

export interface Progress {
  id: string;
  ef: number;           // ease factor
  reps: number;
  intervalDays: number;
  nextDue: Date;
  lastGrade: number | null;
}

export function startOfTomorrow(tz: string): Date {
  const now = new Date();
  const userNow = toZonedTime(now, tz);
  const tomorrow = addDays(startOfDay(userNow), 1);
  return fromZonedTime(tomorrow, tz);
}

export function schedule(progress: Progress, uiGrade: UiGrade, userTimezone: string = 'America/Toronto'): Progress {
  // Map to Anki-like quality where higher is better
  const q = 6 - uiGrade; // 1->5(best), 3->3, 5->1(worst)
  let { ef, reps, intervalDays } = progress;

  let nextDue: Date;

  if (q <= 1) { // Still Confusing (grade 5)
    reps = 0;
    intervalDays = 1;           // show again tomorrow (not today)
    ef = Math.max(1.3, ef - 0.2);
    // Set next_due to start of tomorrow in user timezone
    nextDue = startOfTomorrow(userTimezone);
  } else if (q === 3) { // Just Right
    reps += 1;
    if (reps === 1) {
      intervalDays = 1;
      nextDue = addDaysInTz(new Date(), 1, userTimezone);
    } else if (reps === 2) {
      intervalDays = 3;
      nextDue = addDaysInTz(new Date(), 3, userTimezone);
    } else {
      const baseInterval = Math.round(intervalDays * ef);
      // Add ±10% randomness to prevent clumping
      const randomness = 0.9 + Math.random() * 0.2;
      intervalDays = Math.min(365, Math.max(1, Math.round(baseInterval * randomness)));
      nextDue = addDaysInTz(new Date(), intervalDays, userTimezone);
    }
  } else { // Too Easy
    reps += 1;
    ef = ef + 0.1;
    if (reps === 1) {
      intervalDays = 3;
      nextDue = addDaysInTz(new Date(), 3, userTimezone);
    } else if (reps === 2) {
      intervalDays = 6;
      nextDue = addDaysInTz(new Date(), 6, userTimezone);
    } else {
      const baseInterval = Math.round(intervalDays * ef * 1.3);
      // Add ±10% randomness to prevent clumping
      const randomness = 0.9 + Math.random() * 0.2;
      intervalDays = Math.min(365, Math.max(1, Math.round(baseInterval * randomness)));
      nextDue = addDaysInTz(new Date(), intervalDays, userTimezone);
    }
  }

  return {
    ...progress,
    ef,
    reps,
    intervalDays,
    nextDue,
    lastGrade: uiGrade
  };
}

function addDaysInTz(date: Date, days: number, tz: string): Date {
  const userNow = toZonedTime(date, tz);
  const future = addDays(userNow, days);
  return fromZonedTime(future, tz);
}
