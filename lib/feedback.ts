// Fallback feedback system when LLM fails

export function getFallbackMCQRationale(pattern: string): string {
  const rationales: Record<string, string> = {
    'Two Pointers': 'Two pointers efficiently eliminate impossible combinations by moving inward from both ends.',
    'Sliding Window': 'Sliding window maintains optimal subarray properties by expanding and contracting boundaries.',
    'Binary Search': 'Binary search eliminates half the search space each iteration in sorted data structures.',
    'Hashing': 'Hash maps provide O(1) lookup for complements and frequency tracking in linear time.'
  }
  
  return rationales[pattern] || 'This pattern efficiently solves the problem by optimizing the search space.'
}

export function getFallbackPlanGrade(userPlan: string, checklist: string[]): { score_0_5: number; brief_feedback: string } {
  const planLower = userPlan.toLowerCase()
  let score = 0
  let missingKeywords: string[] = []
  
  // Check for each keyword in the checklist
  for (const keyword of checklist) {
    const keywordLower = keyword.toLowerCase()
    if (planLower.includes(keywordLower)) {
      score += 1
    } else {
      missingKeywords.push(keyword)
    }
  }
  
  // Normalize score to 0-5 scale
  const normalizedScore = Math.round((score / checklist.length) * 5)
  
  let feedback = ''
  if (missingKeywords.length === 0) {
    feedback = 'Good coverage of key concepts.'
  } else {
    feedback = `Hint: include "${missingKeywords[0]}" step.`
  }
  
  return {
    score_0_5: normalizedScore,
    brief_feedback: feedback
  }
}
