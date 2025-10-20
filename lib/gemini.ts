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

export async function gradePlan(problemSummary: string, userPlan: string, checklist: string[]): Promise<{ score_0_5: number; brief_feedback: string }> {
  try {
    const genAI = getGeminiClient()
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.5-flash', 
      generationConfig: {
        responseMimeType: 'application/json'
      }
    })
    
    const prompt = `You are grading a 3–6 step DSA plan (no code). Score from 0–5 and give a brief action hint if steps miss key checklist items. Be terse and concrete.
Return JSON only.

Problem: ${problemSummary}
Canonical checklist: ${checklist.join('; ')}
User plan: "${userPlan}"
Output JSON: {"score_0_5": <int>, "brief_feedback": "<<=40 words>"}`

    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()
    
    // Parse JSON response
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error('No JSON found in response')
    }
    
    const parsed = JSON.parse(jsonMatch[0])
    
    // Validate and clamp score
    const score = Math.max(0, Math.min(5, Math.round(parsed.score_0_5 || 0)))
    
    // Ensure feedback is <= 40 words
    const words = parsed.brief_feedback?.trim().split(/\s+/) || []
    const feedback = words.length > 40 ? words.slice(0, 40).join(' ') + '...' : parsed.brief_feedback || 'Good attempt.'
    
    return { score_0_5: score, brief_feedback: feedback }
  } catch (error) {
    console.error('Gemini plan grading error:', error)
    throw error
  }
}
