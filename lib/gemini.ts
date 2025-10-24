import { GoogleGenerativeAI } from '@google/generative-ai'

let genAI: GoogleGenerativeAI | null = null

export function getGeminiClient() {
  if (!genAI) {
    const apiKey = process.env.GEMINI_API_KEY_2
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY environment variable is required')
    }
    genAI = new GoogleGenerativeAI(apiKey)
  }
  return genAI
}

export async function generateMCQRationale(pattern: string, problemSummary: string): Promise<string> {
  try {
    const genAI = getGeminiClient()
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.5-flash', 
      generationConfig: {
        responseMimeType: 'text/plain'
      }
    })
    
    const prompt = `You write tiny rationales for DSA pattern choices. 1 sentence, <= 30 words, specific, small words for learners and practical.

Pattern: ${pattern}
Problem: ${problemSummary}
Explain why this pattern applies in one sentence.`

    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()
    
    // Ensure response is <= 30 words
    const words = text.trim().split(/\s+/)
    if (words.length > 30) {
      return words.slice(0, 30).join(' ') + '...'
    }
    
    return text.trim()
  } catch (error) {
    console.error('Gemini MCQ rationale error:', error)
    throw error
  }
}

export async function evaluatePlan(
  checklist: string[], 
  userPlan: string
): Promise<{ 
  matched: string[]; 
  missing: string[]; 
  coverage: number;
  explanation: string;
}> {
  try {
    const genAI = getGeminiClient()
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.5-flash', 
      generationConfig: {
        responseMimeType: 'application/json'
      }
    })
    
    const prompt = `You evaluate algorithm plans for coding problems.
Given REQUIRED_STEPS and USER_PLAN, return JSON:
{
  "matched": ["step1", "step2", ...],
  "missing": ["step3", ...],
  "coverage": 0.75,
  "explanation": "Simple explanation of what they did well and what to improve"
}

Rules:
- Match by meaning, not exact words
- Do not invent steps not in REQUIRED_STEPS
- coverage = matched.length / REQUIRED_STEPS.length, rounded to two decimals
- explanation should be encouraging and simple, avoid technical jargon
- No extra fields

REQUIRED_STEPS: ${checklist.join('; ')}
USER_PLAN: "${userPlan}"`

    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()
    
    // Parse JSON response directly since responseMimeType is set to application/json
    const parsed = JSON.parse(text)
    
    // Validate response structure
    const matched = Array.isArray(parsed.matched) ? parsed.matched : []
    const missing = Array.isArray(parsed.missing) ? parsed.missing : []
    const coverage = typeof parsed.coverage === 'number' ? parsed.coverage : 0
    const explanation = typeof parsed.explanation === 'string' ? parsed.explanation : 'Good effort! Keep practicing.'
    
    return { matched, missing, coverage, explanation }
  } catch (error) {
    console.error('Gemini plan evaluation error:', error)
    throw error
  }
}
