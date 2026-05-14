import { NextRequest, NextResponse } from 'next/server'

import { getActiveApi, rotateToNextApi, getApiStatus } from '@/lib/api-failover'

export async function POST(request: NextRequest) {
  // Check if client wants streaming
  const acceptHeader = request.headers.get('accept')
  const isStreaming = acceptHeader === 'text/event-stream'
  
  try {
    const { topic, questionNumber } = await request.json()
    
    // For full mock, rotate through sections
    let actualTopic = topic
    if (topic === 'full') {
      const sections = ['qa', 'dilr', 'varc']
      actualTopic = sections[questionNumber % 3]
    }

    // Generate unique random ID to prevent caching and ensure unique questions
    const randomId = Math.random().toString(36).substring(2, 15) + Date.now().toString(36)
    
    console.log('\n=== Generating Question ===')
    console.log(getApiStatus())
    console.log('Topic:', actualTopic, '| Question:', questionNumber, '| RandomID:', randomId)

    // Use current active API
    const api = getActiveApi()
    let response = null
    
    try {
      console.log(`\n📡 Using API: ${api.name} (${api.model})`)
      
      response = await fetch(api.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${api.key}`,
        },
        body: JSON.stringify({
          model: api.model,
          max_tokens: 2048,
          temperature: 0.9,
          presence_penalty: 0.5,
          frequency_penalty: 0.5,
          stream: isStreaming,
          messages: [
            {
              role: 'system',
              content: `You are an expert CAT exam question creator for Indian MBA entrance tests.

Return ONLY valid JSON in this exact format:
{"question":"short question text (2-4 lines max)","options":{"A":"short option","B":"short option","C":"short option","D":"short option"},"correct":"A","explanation":"brief solution","difficulty":"easy"}

CAT QUESTION STANDARDS:
- QA: Arithmetic, Algebra, Geometry, Number Systems (calculations under 2 minutes)
- DILR: Small datasets with 3-4 related questions
- VARC: Short passages (150-200 words) with inference questions

RULES:
- Question text should be CONCISE (max 3-4 lines for QA, short passage for VARC)
- Options should be SHORT (5-10 words each)
- NO markdown in JSON values (no **, ###, backticks)
- Return PURE JSON only - no explanations outside
- Use Indian context (Rs., km/hr, etc)`
            },
            {
              role: 'user',
              content: `Request ID: ${randomId}

Generate CAT Question #${questionNumber + 1} for ${actualTopic.toUpperCase()}

Section Details:
- VARC: Short RC passage (150 words) OR Para jumbles, Para completion, Odd sentence
- DILR: Small table/graph/puzzle (data fits in 3-4 lines)
- QA: Arithmetic (%, Profit/Loss, TSD), Algebra, Geometry, Numbers

Difficulty:
- Q1-5: EASY (direct formula, 1-2 steps)
- Q6-15: MEDIUM (2-3 steps, moderate calculation)
- Q16-20: HARD (multi-concept, tricky)

Output ONLY JSON. Example:
{"question":"A shopkeeper buys at Rs. 80 and sells at Rs. 100. What is profit %?","options":{"A":"20%","B":"25%","C":"30%","D":"35%"},"correct":"B","explanation":"Profit = 20, CP = 80, Profit% = 20/80*100 = 25%","difficulty":"easy"}

Note: This is for ${topic === 'full' ? 'FULL MOCK TEST (mix all sections)' : actualTopic.toUpperCase() + ' section only'}.`
            }
          ]
        })
      })
      
      // Check if API responded successfully
      if (!response.ok) {
        const errorText = await response.text()
        console.log(`❌ API ${api.name} failed: ${response.status}`)
        throw new Error(`API ${api.name} failed: ${response.status}`)
      }
      
      console.log(`✅ Success with API: ${api.name}`)
      
    } catch (fetchError: any) {
      console.log(`❌ API ${api.name} error: ${fetchError.message || 'Connection failed'}`)
      console.log('🔄 Rotating to next API...')
      
      // Rotate to next API
      rotateToNextApi()
      
      // Try with new active API
      const newApi = getActiveApi()
      console.log(`📡 Retrying with API: ${newApi.name} (${newApi.model})`)
      
      try {
        response = await fetch(newApi.url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${newApi.key}`,
          },
          body: JSON.stringify({
            model: newApi.model,
            max_tokens: 2048,
            temperature: 0.9,
            presence_penalty: 0.5,
            frequency_penalty: 0.5,
            stream: isStreaming,
            messages: [
              {
                role: 'system',
                content: `You are an expert CAT exam question creator for Indian MBA entrance tests.

Return ONLY valid JSON in this exact format:
{"question":"short question text (2-4 lines max)","options":{"A":"short option","B":"short option","C":"short option","D":"short option"},"correct":"A","explanation":"brief solution","difficulty":"easy"}

CAT QUESTION STANDARDS:
- QA: Arithmetic, Algebra, Geometry, Number Systems (calculations under 2 minutes)
- DILR: Small datasets with 3-4 related questions
- VARC: Short passages (150-200 words) with inference questions

RULES:
- Question text should be CONCISE (max 3-4 lines for QA, short passage for VARC)
- Options should be SHORT (5-10 words each)
- NO markdown in JSON values (no **, ###, backticks)
- Return PURE JSON only - no explanations outside
- Use Indian context (Rs., km/hr, etc)`
              },
              {
                role: 'user',
                content: `Request ID: ${randomId}

Generate CAT Question #${questionNumber + 1} for ${actualTopic.toUpperCase()}

Section Details:
- VARC: Short RC passage (150 words) OR Para jumbles, Para completion, Odd sentence
- DILR: Small table/graph/puzzle (data fits in 3-4 lines)
- QA: Arithmetic (%, Profit/Loss, TSD), Algebra, Geometry, Numbers

Difficulty:
- Q1-5: EASY (direct formula, 1-2 steps)
- Q6-15: MEDIUM (2-3 steps, moderate calculation)
- Q16-20: HARD (multi-concept, tricky)

Output ONLY JSON. Example:
{"question":"A shopkeeper buys at Rs. 80 and sells at Rs. 100. What is profit %?","options":{"A":"20%","B":"25%","C":"30%","D":"35%"},"correct":"B","explanation":"Profit = 20, CP = 80, Profit% = 20/80*100 = 25%","difficulty":"easy"}

Note: This is for ${topic === 'full' ? 'FULL MOCK TEST (mix all sections)' : actualTopic.toUpperCase() + ' section only'}.`
              }
            ]
          })
        })
        
        if (!response.ok) {
          throw new Error(`Backup API ${newApi.name} also failed`)
        }
        
        console.log(`✅ Success with backup API: ${newApi.name}`)
        
      } catch (backupError: any) {
        console.log(`❌ Backup API ${newApi.name} also failed: ${backupError.message}`)
        console.log('\n⚠️ All APIs failed, using mock question')
        return NextResponse.json(getMockQuestion(actualTopic, questionNumber))
      }
    }

    // Handle streaming response
    if (isStreaming && response.body) {
      const encoder = new TextEncoder()
      const reader = response.body.getReader()
      
      const stream = new ReadableStream({
        async pull(controller) {
          const { done, value } = await reader.read()
          
          if (done) {
            controller.close()
            return
          }
          
          const chunk = new TextDecoder().decode(value)
          const lines = chunk.split('\n')
          
          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.substring(6)
              if (data === '[DONE]') {
                controller.close()
                return
              }
              try {
                const parsed = JSON.parse(data)
                const content = parsed.choices?.[0]?.delta?.content || ''
                if (content) {
                  controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content })}\n\n`))
                }
              } catch (e) {
                // Skip invalid JSON chunks
              }
            }
          }
          
          controller.enqueue(value)
        },
        cancel() {
          reader.cancel()
        }
      })
      
      return new Response(stream, {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
        },
      })
    }
    
    // Non-streaming response (original behavior)
    if (!response.ok) {
      const errorText = await response.text()
      console.error('API Error:', response.status, errorText.substring(0, 200))
      console.log('Returning mock question due to API error')
      return NextResponse.json(getMockQuestion(actualTopic, questionNumber))
    }

    const data = await response.json()
    console.log('API Response:', data)
    
    const content = data.choices?.[0]?.message?.content
    
    if (!content) {
      console.error('No content in API response')
      return NextResponse.json(getMockQuestion(actualTopic, questionNumber))
    }
    
    console.log('Raw API Response:', content.substring(0, 500) + '...')
    
    // Try to parse JSON from response - multiple strategies
    let questionData = null
    
    // Strategy 1: Look for JSON object in the response
    const jsonMatch = content.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      try {
        questionData = JSON.parse(jsonMatch[0])
        console.log('Parsed JSON from regex match')
      } catch (e) {
        console.log('JSON parse failed from regex, trying extraction...')
      }
    }
    
    // Strategy 2: Extract from markdown format (more robust patterns)
    if (!questionData) {
      console.log('Extracting structured data from markdown response...')
      
      try {
        const extractedOptions: any = {}
        let correctAnswer: string | null = null
        let extractedExplanation = ''
        
        // Clean markdown - remove **, ###, etc
        const cleanContent = content
          .replace(/\*\*/g, '')
          .replace(/###/g, '')
          .replace(/##/g, '')
          .replace(/__/g, '')
        
        const lines = cleanContent.split('\n')
        let extractedQuestion = ''
        let inOptions = false
        let inExplanation = false
        
        for (let i = 0; i < lines.length; i++) {
          const line = lines[i].trim()
          if (!line) continue
          
          // Skip headers
          if (line.startsWith('**') || line.startsWith('##') || line.includes('Question') && line.includes('(')) continue
          if (line.includes('Options') || line.includes('---')) { inOptions = true; continue }
          if (line.toLowerCase().includes('explanation') || line.toLowerCase().includes('step-by-step')) { inExplanation = true; continue }
          
          // Extract options
          if (inOptions && !inExplanation) {
            const optionMatch = line.match(/^([A-D])[)\.]\s*(.+)$/)
            if (optionMatch) {
              extractedOptions[optionMatch[1]] = optionMatch[2].trim()
              continue
            }
          }
          
          // Extract correct answer
          if (line.toLowerCase().includes('correct answer') || line.toLowerCase().includes('answer key')) {
            const match = line.match(/([A-D])/)
            if (match) correctAnswer = match[1].toUpperCase()
          }
          
          // Extract explanation
          if (inExplanation) {
            extractedExplanation += line + ' '
          }
          
          // Extract question (before options start)
          if (!inOptions && line.length > 10) {
            extractedQuestion += line + ' '
          }
        }
        
        if (Object.keys(extractedOptions).length >= 4 && correctAnswer) {
          questionData = {
            question: extractedQuestion.trim().substring(0, 800) || 'Question',
            options: extractedOptions,
            correct: correctAnswer,
            explanation: extractedExplanation.trim() || 'Solution available',
            difficulty: questionNumber < 5 ? 'easy' : questionNumber < 15 ? 'medium' : 'hard'
          }
          console.log('Successfully extracted from markdown')
        }
      } catch (e) {
        console.log('Extraction error:', e)
      }
    }
    
    // Strategy 3: If still no data, create from available content
    if (!questionData && content.length > 100) {
      console.log('Creating fallback from content...')
      questionData = {
        question: content.substring(0, 500) + '...',
        options: {
          A: 'Option A - See explanation',
          B: 'Option B - See explanation', 
          C: 'Option C - See explanation',
          D: 'Option D - See explanation'
        },
        correct: 'B',
        explanation: content,
        difficulty: questionNumber < 5 ? 'easy' : questionNumber < 15 ? 'medium' : 'hard'
      }
    }
    
    // Fallback to mock if still no data
    if (!questionData) {
      console.error('Could not parse or extract question from response')
      return NextResponse.json(getMockQuestion(actualTopic, questionNumber))
    }

    return NextResponse.json({
      ...questionData,
      id: questionNumber
    })

  } catch (error) {
    console.error('Error generating question:', error)
    const { topic, questionNumber } = await request.json()
    return NextResponse.json(getMockQuestion(topic, questionNumber))
  }
}

// Mock question generator
function getMockQuestion(topic: string, questionNumber: number) {
  const topicNames: Record<string, string> = {
    varc: 'Verbal Ability & Reading Comprehension',
    dilr: 'Data Interpretation & Logical Reasoning',
    qa: 'Quantitative Aptitude',
    full: 'CAT Mock Test'
  }

  const questions = [
    {
      question: `A passage is followed by questions based on its content. Read carefully and answer the question.\n\n[Passage for ${topicNames[topic] || topic} - Question ${questionNumber + 1}]`,
      options: {
        A: "The author suggests that the primary cause is economic factors",
        B: "The passage indicates that social changes played a crucial role",
        C: "According to the text, technological advancement was the key driver",
        D: "The author argues that political decisions had the most impact"
      },
      correct: "B",
      explanation: "The passage clearly emphasizes social changes as the main factor, as evidenced by the discussion of demographic shifts and cultural transformations.",
      difficulty: questionNumber < 5 ? "easy" : questionNumber < 15 ? "medium" : "hard"
    }
  ]

  return questions[questionNumber % questions.length]
}
