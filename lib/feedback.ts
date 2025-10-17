export function checkPlanKeywords(userPlan: string, checklist: string[]): { score: number; feedback: string } {
  const planLower = userPlan.toLowerCase()
  const missingKeywords: string[] = []
  
  // Check for each keyword in the checklist
  for (const keyword of checklist) {
    if (!planLower.includes(keyword.toLowerCase())) {
      missingKeywords.push(keyword)
    }
  }
  
  // Calculate score based on missing keywords
  const totalKeywords = checklist.length
  const foundKeywords = totalKeywords - missingKeywords.length
  const score = Math.round((foundKeywords / totalKeywords) * 5) // Scale to 0-5
  
  // Generate feedback
  if (missingKeywords.length === 0) {
    return { score, feedback: "Good coverage." }
  } else {
    const hintKeyword = missingKeywords[0] // Use first missing keyword
    return { score, feedback: `Hint: include "${hintKeyword}" step.` }
  }
}

export function getMCQFallbackRationale(pattern: string): string {
  const fallbacks: Record<string, string> = {
    "Sliding Window": "Sliding Window efficiently maintains a window while processing data sequentially."
  }
  
  return fallbacks[pattern] || "This pattern efficiently solves the given problem."
}