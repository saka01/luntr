export type UiGrade = 1 | 3 | 5; // 1=Too Easy, 3=Just Right, 5=Too Confusing

export interface Progress {
  id: string;
  ef: number;           // ease factor
  reps: number;
  intervalDays: number;
  nextDue: Date;
  lastGrade: number | null;
}

export function schedule(progress: Progress, uiGrade: UiGrade): Progress {
  // Map to Anki-like quality where higher is better
  const q = 6 - uiGrade; // 1->5(best), 3->3, 5->1(worst)
  let { ef, reps, intervalDays } = progress;

  if (q <= 1) { // Too Confusing
    reps = 0;
    intervalDays = 0;           // show again today
    ef = Math.max(1.3, ef - 0.2);
  } else if (q === 3) { // Just Right
    reps += 1;
    if (reps === 1) intervalDays = 1;
    else if (reps === 2) intervalDays = 3;
    else intervalDays = Math.min(365, Math.max(1, Math.round(intervalDays * ef)));
  } else { // Too Easy
    reps += 1;
    ef = ef + 0.1;
    if (reps === 1) intervalDays = 3;
    else if (reps === 2) intervalDays = 6;
    else intervalDays = Math.min(365, Math.max(1, Math.round(intervalDays * ef * 1.3)));
  }

  return {
    ...progress,
    ef,
    reps,
    intervalDays,
    nextDue: new Date(Date.now() + intervalDays * 86400000),
    lastGrade: uiGrade
  };
}
