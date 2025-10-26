import { GoogleGenAI } from '@google/genai'

let genAI: GoogleGenAI | null = null

export function getGeminiClient() {
  if (!genAI) {
    const apiKey = process.env.GEMINI_API_KEY_2
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY_2 environment variable is required')
    }
    console.log('Using Gemini API key:', apiKey.substring(0, 10) + '...')
    genAI = new GoogleGenAI({ apiKey })
  }
  return genAI
}

export async function generateMCQRationale(pattern: string, problemSummary: string): Promise<string> {
  try {
    const genAI = getGeminiClient()
    
    const prompt = `You are helping someone learn data structures and algorithms. Write a tiny rationale for why they should use this pattern. Speak directly to them as if you're their tutor. 1 sentence, <= 30 words, specific, small words for learners and practical.

Pattern: ${pattern}
Problem: ${problemSummary}
Explain why this pattern applies in one sentence, speaking directly to them.`

    const response = await genAI.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'text/plain'
      }
    })
    
    const text = response.text
    
    if (!text) {
      throw new Error('No text response received from Gemini')
    }
    
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
  checklist: string[] | undefined, 
  userPlan: string
): Promise<{ 
  matched: string[]; 
  missing: string[]; 
  coverage: number;
  explanation: string;
}> {
  try {
    const genAI = getGeminiClient()
    
    const checklistText = Array.isArray(checklist) && checklist.length > 0 
      ? `REQUIRED STEPS: ${checklist.join('; ')}`
      : ''
    
    const prompt = `Evaluate this coding plan and return JSON.

{
  "matched": ["steps they completed"],
  "missing": ["only the very next step they need to take"],
  "coverage": 0.8,
  "explanation": "Keep this under 50 words. One sentence of encouragement."
}

${checklistText}
USER PLAN: "${userPlan}"

IMPORTANT: In "missing", list ONLY the first/most important next step, NOT all missing steps. Keep "explanation" concise.`

    const response = await genAI.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      }
    })
    
    const text = response.text
    
    console.log('Text:', text)
  
    
    const parsed = JSON.parse(text || '{}')
    
    // Only take the first missing step
    const missingSteps = Array.isArray(parsed.missing) ? parsed.missing : []
    const firstMissingStep = missingSteps.length > 0 ? [missingSteps[0]] : []
    
    return {
      matched: Array.isArray(parsed.matched) ? parsed.matched : [],
      missing: firstMissingStep,
      coverage: typeof parsed.coverage === 'number' ? parsed.coverage : 0.5,
      explanation: typeof parsed.explanation === 'string' ? parsed.explanation : 'Great effort! Keep practicing!'
    }
  } catch (error) {
    console.error('Gemini evaluation error:', error)
    console.error('Error details:', error instanceof Error ? error.message : 'Unknown error')
    console.error('Full error:', error)
    // Fallback to basic evaluation
    const fallbackMissing = Array.isArray(checklist) && checklist.length > 0 ? [checklist[0]] : []
    return {
      matched: [],
      missing: fallbackMissing,
      coverage: 0.3,
      explanation: "Keep thinking through the problem step by step!"
    }
  }
}
