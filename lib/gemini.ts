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
    
    const prompt = `You are a coding tutor helping someone improve their problem-solving approach. Evaluate their coding plan and return JSON. Speak to them directly as their mentor.

{
  "matched": ["steps they got right"],
  "missing": ["steps they missed"],
  "coverage": 0.8,
  "explanation": "Brief feedback on their approach"
}

REQUIRED STEPS: ${checklist.join('; ')}
USER PLAN: "${userPlan}"

Match by meaning, not exact words. Give helpful, encouraging feedback as if you're speaking directly to them.`

    const response = await genAI.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      }
    })
    
    const text = response.text
    
    console.log('Text:', text)
    
    if (!text || text.trim() === '') {
      console.log('Empty response, retrying...')
      // Retry once with a simpler prompt
      const simplePrompt = `Return JSON: {"matched":[], "missing":[], "coverage":0.5, "explanation":"Great job thinking through your approach! Keep practicing your problem-solving skills!"}`
      const retryResponse = await genAI.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: simplePrompt,
        config: {
          responseMimeType: 'application/json'
        }
      })
      const retryText = retryResponse.text
      
      if (!retryText || retryText.trim() === '') {
        throw new Error('Gemini returned empty response after retry')
      }
      
      const parsed = JSON.parse(retryText)
      return {
        matched: Array.isArray(parsed.matched) ? parsed.matched : [],
        missing: Array.isArray(parsed.missing) ? parsed.missing : [],
        coverage: typeof parsed.coverage === 'number' ? parsed.coverage : 0.5,
        explanation: typeof parsed.explanation === 'string' ? parsed.explanation : 'Great effort! Keep practicing!'
      }
    }
    
    const parsed = JSON.parse(text)
    return {
      matched: Array.isArray(parsed.matched) ? parsed.matched : [],
      missing: Array.isArray(parsed.missing) ? parsed.missing : [],
      coverage: typeof parsed.coverage === 'number' ? parsed.coverage : 0.5,
      explanation: typeof parsed.explanation === 'string' ? parsed.explanation : 'Great effort! Keep practicing!'
    }
  } catch (error) {
    console.error('Gemini evaluation error:', error)
    console.error('Error details:', error instanceof Error ? error.message : 'Unknown error')
    console.error('Full error:', error)
    // Fallback to basic evaluation
    return {
      matched: [],
      missing: checklist,
      coverage: 0.3,
      explanation: "I had trouble analyzing your plan, but don't worry, keep practicing your problem-solving approach!"
    }
  }
}
