import { NextRequest, NextResponse } from "next/server"
import { getActiveApi, rotateToNextApi, recordApiFailure } from '@/lib/api-failover'
 
interface ChatMessage {
  id: string
  question: string
  answer: string
  modelUsed: string
  timestamp: string
  topic: string
}
 
interface MessageHistory {
  [key: string]: ChatMessage[]
}
 
let messageHistory: MessageHistory = {}
 
function getSessionKey(request: NextRequest): string {
  const sessionId = request.headers.get('x-session-id')
  if (sessionId) return sessionId
  return `anon-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`
}
 
export async function GET(request: NextRequest) {
  try {
    const sessionKey = getSessionKey(request)
    const history = messageHistory[sessionKey] || []
    return NextResponse.json({ success: true, history })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to get history" }, { status: 500 })
  }
}
 
export async function POST(request: NextRequest) {
  try {
    const sessionKey = getSessionKey(request)
    const { question, subject = 'general' } = await request.json()
 
    if (!question || typeof question !== 'string') {
      return NextResponse.json({ error: "Question is required" }, { status: 400 })
    }
 
    const currentApi = getActiveApi()
    console.log(`\n=== CAT AI Chat Request via ${currentApi.name} ===`)
 
    const systemPrompt = `Your name is Mbagrad. You are an AI assistant created by HY MBAGRAD for CAT exam preparation. If anyone asks your name, always say 'I am Mbagrad, your CAT preparation assistant by HY MBAGRAD.' Never mention Ollama, Claude, GPT, Qwen or any other AI model name.
 
You are an expert CAT exam preparation assistant helping Indian MBA aspirants.
 
CAT SECTIONS:
1. VARC (Verbal Ability & Reading Comprehension): Reading passages, para jumbles, para completion, odd sentence out
2. DILR (Data Interpretation & Logical Reasoning): Tables, graphs, puzzles, seating arrangements
3. QA (Quantitative Aptitude): Arithmetic, Algebra, Geometry, Number Systems, Modern Math
 
SUBJECT-SPECIFIC:
${subject === 'varc' ? '- You specialize in reading comprehension, grammar, vocabulary, and verbal reasoning' : ''}
${subject === 'dilr' ? '- You focus on data interpretation, logical reasoning, puzzles, and analytical thinking' : ''}
${subject === 'qa' ? '- You excel in quantitative aptitude, mathematical concepts, and problem-solving techniques' : ''}
${!['varc', 'dilr', 'qa'].includes(subject) ? '- You provide general CAT preparation advice, strategy, and general knowledge' : ''}
 
GUIDELINES:
- Use Indian context (Rs., km/hr, IIM, CAT, etc.)
- Keep answers CONCISE and ACTIONABLE
- Provide practical tips, not just theory
- Include examples when helpful
- Be encouraging and student-friendly
- Suggest practice methods and memory tricks
- Warn about common mistakes aspirants make
 
FORMAT YOUR RESPONSES USING MARKDOWN:
- Use ## for section headings
- Use **bold** for key terms and important points
- Use bullet points for lists
- Keep responses well-structured and easy to read
- Never use emojis
- Maximum 3 heading levels
- Avoid excessive bold`
 
    const messages = [
      { role: "system", content: systemPrompt },
      { role: "user", content: `Student Question: ${question}\n\nPlease provide a helpful, concise response tailored for CAT aspirants.` }
    ]
 
    let lastError = ''
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        const currentApi = getActiveApi()
        console.log(`\n--- Attempt ${attempt + 1} via ${currentApi.name} ---`)
 
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
          console.error(`API Error: ${response.status} - ${errData}`)
          recordApiFailure()
          rotateToNextApi()
          lastError = `API ${currentApi.name} failed with status ${response.status}`
          continue
        }
 
        const data = await response.json()
        console.log(`Success with API: ${currentApi.name}`)
 
        const answer = data.choices?.[0]?.message?.content || "I could not generate a response. Please try again."
 
        const newMessage: ChatMessage = {
          id: Date.now().toString(),
          question,
          answer,
          modelUsed: "Mbagrad",
          timestamp: new Date().toISOString(),
          topic: subject
        }
 
        if (!messageHistory[sessionKey]) {
          messageHistory[sessionKey] = []
        }
        messageHistory[sessionKey].push(newMessage)
 
        if (messageHistory[sessionKey].length > 50) {
          messageHistory[sessionKey] = messageHistory[sessionKey].slice(-50)
        }
 
        return NextResponse.json({
          success: true,
          answer,
          modelUsed: "Mbagrad",
          timestamp: newMessage.timestamp,
          sessionKey
        })
 
      } catch (error) {
        console.error(`Attempt ${attempt + 1} failed:`, error)
        recordApiFailure()
        rotateToNextApi()
        lastError = error instanceof Error ? error.message : 'Unknown error'
      }
    }
 
    return NextResponse.json({
      success: false,
      error: `All APIs failed. Last error: ${lastError}`
    }, { status: 500 })
 
  } catch (error) {
    console.error('CAT AI Chat error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Internal server error'
    }, { status: 500 })
  }
}
 