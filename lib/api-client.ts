// API Client with failover support for CAT AI

import {
  getActiveApi,
  setActiveApi,
  rotateToNextApi,
  recordApiFailure,
  resetApiFailures,
  API_ENDPOINTS,
  getApiStatus
} from './api-failover'

export { getApiStatus } from './api-failover'

// Helper to get the current active API index
function getActiveApiIndex(): number {
  const currentApi = getActiveApi()
  return API_ENDPOINTS.findIndex(api => api.name === currentApi.name)
}

export interface ChatRequest {
  question: string
  subject?: string
}

export interface ChatResponse {
  success: boolean
  answer?: string
  error?: string
  details?: string
  modelUsed?: string
  timestamp?: string
}

export async function submitChatRequest(request: ChatRequest, sessionId: string): Promise<ChatResponse> {
  const apiConfig = getActiveApi()
  
  console.log(`\n=== CAT AI Chat Request via ${apiConfig.name} ===`)
  console.log(`Session: ${sessionId}`)
  console.log(`Subject: ${request.subject || 'general'}`)
  console.log(`Question: ${request.question.substring(0, 100)}...`)
  console.log(`Current API: ${getActiveApi().name} (index: ${getActiveApiIndex()})`)
  
  // Prepare system prompt
  const systemPrompt = `You are an expert CAT exam preparation assistant helping Indian MBA aspirants.

CAT SECTIONS:
1. VARC (Verbal Ability & Reading Comprehension): Reading passages, para jumbles, para completion, odd sentence out
2. DILR (Data Interpretation & Logical Reasoning): Tables, graphs, puzzles, seating arrangements
3. QA (Quantitative Aptitude): Arithmetic, Algebra, Geometry, Number Systems, Modern Math

SUBJECT-SPECIFIC:
- ${request.subject === 'varc' ? 'You specialize in reading comprehension, grammar, vocabulary, and verbal reasoning' : ''}
- ${request.subject === 'dilr' ? 'You focus on data interpretation, logical reasoning, puzzles, and analytical thinking' : ''}
- ${request.subject === 'qa' ? 'You excel in quantitative aptitude, mathematical concepts, and problem-solving techniques' : ''}
- ${!['varc', 'dilr', 'qa'].includes(request.subject || '') ? 'You provide general CAT preparation advice, strategy, and general knowledge' : ''}

GUIDELINES:
- Use Indian context (Rs., km/hr, IIM, CAT, etc.)
- Keep answers CONCISE and ACTIONABLE
- Provide practical tips, not just theory
- Include examples when helpful
- Be encouraging and student-friendly
- Suggest practice methods and memory tricks
- Warn about common mistakes aspirants make`

  // Prepare messages (use history for context)
  const messages = [
    { role: "system", content: systemPrompt },
    { role: "user", content: `Student Question: ${request.question}\n\nPlease provide a helpful, concise response tailored for CAT aspirants.` }
  ]

  // Try all APIs with rotation
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const currentApi = getActiveApi()

      // Call OpenAI-compatible API (Ollama, Groq, OpenAI, etc.)
      const response = await fetch(currentApi.url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": currentApi.key ? `Bearer ${currentApi.key}` : "",
        },
        body: JSON.stringify({
          model: currentApi.model,
          messages: messages,
          temperature: 0.7,
          max_tokens: 1024,
        }),
      })

      if (!response.ok) {
        const errData = await response.text()
        console.error(`❌ API Error (${response.status}) from ${currentApi.name}:`, errData)
        recordApiFailure()

        // If we have more APIs to try, rotate and continue
        if (attempt < 2) {
          console.log(`🔄 Rotating to next API and retrying...`)
  rotateToNextApi()
          continue
        } else {
          return {
            success: false,
            error: `All API endpoints failed: ${response.status}`,
            details: errData
}
        }
      }

      // Success! Reset failure count and return response
      resetApiFailures()
      const data = await response.json()
      const content = data.choices?.[0]?.message?.content || "No response generated"

      console.log(`✅ Success from ${currentApi.name}: ${content.substring(0, 50)}...`)

      return {
        success: true,
        answer: content,
        modelUsed: currentApi.model,
        timestamp: new Date().toISOString()
      }

    } catch (error: any) {
      console.error(`❌ Failed to connect to ${getActiveApi().name}:`, error)
      recordApiFailure()

      if (attempt < 2) {
        console.log(`🔄 Attempting next API...`)
        rotateToNextApi()
      } else {
        console.error("❌ All API endpoints failed")
        return {
          success: false,
          error: "LLM API connection failed",
          details: error.message
        }
      }
    }
  }

  return {
    success: false,
    error: "All retry attempts exhausted",
    details: "Max retries reached"
  }
}

// Export a utility to manually rotate if needed
export function forceRotateApi(): void {
  const currentIndex = getActiveApiIndex()
  const nextIndex = (currentIndex + 1) % API_ENDPOINTS.length
  setActiveApi(nextIndex)
  console.log(`🔄 Manually rotated to API: ${getActiveApi().name}`)
}
