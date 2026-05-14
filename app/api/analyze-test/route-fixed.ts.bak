import { NextRequest, NextResponse } from 'next/server'
import { getActiveApi, rotateToNextApi, getApiStatus } from '@/lib/api-failover'

export async function POST(request: NextRequest) {
  try {
    const { topic, questions, answers, results } = await request.json()
    
    console.log('\n=== Analyzing Test ===')
    console.log(getApiStatus())
    
    // Use current active API
    const api = getActiveApi()
    let response = null
    
    try {
      console.log(`📡 Analyzing with API: ${api.name}`)
      
      response = await fetch(api.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${api.key}`,
        },
        body: JSON.stringify({
          model: api.model,
          max_tokens: 2048,
          temperature: 0.7,
          messages: [
            {
              role: 'system',
              content: `You are an expert CAT exam analyst. Analyze the student's test performance and provide detailed feedback.

Return ONLY valid JSON in this format:
{
  "overallAnalysis": "2-3 sentence overall performance summary",
  "strengths": ["strength 1", "strength 2", "strength 3"],
  "weaknesses": ["weakness 1", "weakness 2"],
  "recommendations": ["recommendation 1", "recommendation 2", "recommendation 3"],
  "topicWisePerformance": {
    "accuracy": "percentage",
    "timeManagement": "good/average/poor",
    "difficultyHandling": "easy/medium/hard questions handled well"
  },
  "scoreBreakdown": {
    "attempted": number,
    "correct": number,
    "wrong": number,
    "skipped": number
  }
}`
            },
            {
              role: 'user',
              content: `Analyze this CAT mock test performance:

Topic: ${topic}
Total Questions: ${questions.length}
Correct: ${results.correct}
Wrong: ${results.wrong}
Skipped: ${results.skipped}
Score: ${results.score}/${results.total}
Percentile: ${results.percentile.toFixed(1)}

Question Details:
${questions.map((q: any, i: number) => `Q${i + 1}: ${q.isCorrect ? '✓ Correct' : q.userAnswer ? '✗ Wrong' : '○ Skipped'} - Your answer: ${q.userAnswer || 'None'}, Correct: ${q.correctAnswer}`).join('\n')}

Provide detailed analysis and recommendations.`
            }
          ]
        })
      })
      
      if (!response.ok) {
        throw new Error(`API ${api.name} failed: ${response.status}`)
      }
      
      console.log(`✅ Analysis success with API: ${api.name}`)
      
    } catch (fetchError: any) {
      console.log(`❌ API ${api.name} error: ${fetchError.message || 'Connection failed'}`)
      console.log('🔄 Rotating to next API...')
      
      // Rotate to next API
      rotateToNextApi()
      
      // Try with new active API
      const newApi = getActiveApi()
      console.log(`📡 Retrying analysis with API: ${newApi.name}`)
      
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
            temperature: 0.7,
            messages: [
              {
                role: 'system',
                content: `You are an expert CAT exam analyst. Analyze the student's test performance and provide detailed feedback.

Return ONLY valid JSON in this format:
{
  "overallAnalysis": "2-3 sentence overall performance summary",
  "strengths": ["strength 1", "strength 2", "strength 3"],
  "weaknesses": ["weakness 1", "weakness 2"],
  "recommendations": ["recommendation 1", "recommendation 2", "recommendation 3"],
  "topicWisePerformance": {
    "accuracy": "percentage",
    "timeManagement": "good/average/poor",
    "difficultyHandling": "easy/medium/hard questions handled well"
  },
  "scoreBreakdown": {
    "attempted": number,
    "correct": number,
    "wrong": number,
    "skipped": number
  }
}`
              },
              {
                role: 'user',
                content: `Analyze this CAT mock test performance:

Topic: ${topic}
Total Questions: ${questions.length}
Correct: ${results.correct}
Wrong: ${results.wrong}
Skipped: ${results.skipped}
Score: ${results.score}/${results.total}
Percentile: ${results.percentile.toFixed(1)}

Question Details:
${questions.map((q: any, i: number) => `Q${i + 1}: ${q.isCorrect ? '✓ Correct' : q.userAnswer ? '✗ Wrong' : '○ Skipped'} - Your answer: ${q.userAnswer || 'None'}, Correct: ${q.correctAnswer}`).join('\n')}

Provide detailed analysis and recommendations.`
              }
            ]
          })
        })
        
        if (!response.ok) {
          throw new Error(`Backup API ${newApi.name} also failed`)
        }
        
        console.log(`✅ Analysis success with backup API: ${newApi.name}`)
        
      } catch (backupError: any) {
        console.log(`❌ Backup API ${newApi.name} also failed`)
        console.log('\n⚠️ All APIs failed, returning basic analysis')
        
        return NextResponse.json({
          overallAnalysis: `You scored ${results.score}/${results.total} with ${results.correct} correct answers.`,
          strengths: ['Completed the test', 'Attempted most questions'],
          weaknesses: ['Need more practice'],
          recommendations: ['Practice daily', 'Focus on weak areas', 'Take more mock tests'],
          topicWisePerformance: {
            accuracy: ((results.correct / questions.length) * 100).toFixed(1) + '%',
            timeManagement: 'average',
            difficultyHandling: 'moderate'
          },
          scoreBreakdown: {
            attempted: results.correct + results.wrong,
            correct: results.correct,
            wrong: results.wrong,
            skipped: results.skipped
          }
        })
      }
    }

    const data = await response.json()
    const content = data.choices?.[0]?.message?.content
    
    if (!content) {
      return NextResponse.json({ error: 'No analysis content' })
    }
    
    // Parse JSON from response
    const jsonMatch = content.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      const analysis = JSON.parse(jsonMatch[0])
      return NextResponse.json(analysis)
    }
    
    return NextResponse.json({ error: 'Invalid analysis format' })
  } catch (error) {
    console.error('Error analyzing test:', error)
    return NextResponse.json({ error: 'Analysis failed' }, { status: 500 })
  }
}
