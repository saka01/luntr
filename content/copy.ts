export const COPY = {
  appName: "Luntr",
  nav: { 
    dashboard: "Dashboard", 
    session: "Start Training", 
    signOut: "Sign out" 
  },
  onboarding: {
    title: "Let's customize your coding workout",
    levelLabel: "Your coding experience level",
    timeLabel: "Daily practice time",
    start: "Start Training"
  },
  dashboard: {
    greeting: "Ready to code?",
    dueToday: (n: number) => `Patterns to practice: ${n}`,
    startSession: "Start Training Session",
    weakestPatterns: "Focus areas",
    streak: (d: number) => `${d} day streak`
  },
  session: {
    header: "Training Session",
    progress: (i: number, total: number) => `Problem ${i} of ${total}`,
    submit: "Submit",
    next: "Next",
    gradeTitle: "How confident did that feel?",
    completeTitle: "Great workout!",
    backToDashboard: "Back to Dashboard"
  },
  feedback: {
    correct: "Nice work!",
    incorrect: "Keep practicing",
    planHintPrefix: "Tip:"
  }
};
