export const COPY = {
  appName: "Pattern Gym",
  badges: { 
    pattern: (p: string) => `Pattern: ${p}`, 
    comingSoon: "More patterns coming soon" 
  },
  nav: { 
    dashboard: "Dashboard", 
    session: "Start Session", 
    signOut: "Sign out" 
  },
  onboarding: {
    title: "Let's personalize your training",
    levelLabel: "Your current level",
    timeLabel: "Daily practice time",
    start: "Save & continue"
  },
  dashboard: {
    greeting: "Welcome back",
    dueToday: (n: number) => `Cards due today: ${n}`,
    startSession: "Start Session",
    mastery: (pct: number) => `Mastery: ${pct}%`,
    streak: (d: number) => `Streak: ${d} day${d === 1 ? "" : "s"}`
  },
  session: {
    header: "Daily Session",
    progress: (i: number, total: number) => `Card ${i} of ${total}`,
    submit: "Submit",
    next: "Next",
    gradeTitle: "How confident did that feel?",
    completeTitle: "Session complete!",
    backToDashboard: "Back to Dashboard"
  },
  feedback: {
    correct: "Correct",
    incorrect: "Not quite",
    planHintPrefix: "Hint:"
  }
};
