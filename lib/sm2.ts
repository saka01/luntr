// SM-2 Spaced Repetition Algorithm Implementation

export interface SM2Params {
  ef: number // easiness factor
  reps: number // number of repetitions
  intervalDays: number // interval in days
}

export function calculateNextInterval(grade: number, params: SM2Params): SM2Params {
  const { ef, reps, intervalDays } = params
  
  if (grade >= 4) {
    // Correct response
    const newReps = reps + 1
    
    let newInterval: number
    if (newReps === 1) {
      newInterval = 1
    } else if (newReps === 2) {
      newInterval = 6
    } else {
      newInterval = Math.round(intervalDays * ef)
    }
    
    const newEf = Math.max(1.3, ef + (0.1 - (5 - grade) * (0.08 + (5 - grade) * 0.02)))
    
    return {
      ef: newEf,
      reps: newReps,
      intervalDays: newInterval
    }
  } else {
    // Incorrect response - reset
    return {
      ef: 2.5,
      reps: 0,
      intervalDays: 1
    }
  }
}

export function calculateNextDueDate(intervalDays: number): Date {
  const now = new Date()
  const nextDue = new Date(now.getTime() + intervalDays * 24 * 60 * 60 * 1000)
  return nextDue
}
