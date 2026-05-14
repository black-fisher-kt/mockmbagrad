import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { question, studentAnswer, correctAnswer, topic } = await request.json()

    const apiKey = "sk-OywRLa0NAH6y6r6LtG4oxJZTULf1mFOqEJwWQ5J3eBk"

    const response = await fetch('https://freeaiapikey.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'openai/gpt-5',
        max_tokens: 512,
        messages: [
          {
            role: 'system',
            content: `You are a CAT exam expert with 10+ years of teaching experience. Given a question, the student's wrong answer, and the correct answer, explain: 1) The correct approach to solve this step-by-step, 2) Why the student's answer is wrong or what mistake they made, 3) A tip or shortcut to remember for similar questions. Be concise, clear, and encouraging.`
          },
          {
            role: 'user',
            content: `Question: ${question}\n\nStudent's Answer: ${studentAnswer}\nCorrect Answer: ${correctAnswer}\nTopic: ${topic}\n\nPlease explain the solution.`
          }
        ]
      })
    })

    if (!response.ok) {
      throw new Error('API error')
    }

    const data = await response.json()
    const explanation = data.choices?.[0]?.message?.content || `The correct answer is ${correctAnswer}. Review the question carefully and understand why option ${correctAnswer} is correct.`

    return NextResponse.json({ explanation })

  } catch (error) {
    console.error('Error reviewing question:', error)
    return NextResponse.json({
      explanation: `The correct answer is ${correctAnswer}. Review the question carefully and understand why option ${correctAnswer} is correct. Practice similar questions to master this concept.`
    })
  }
}
