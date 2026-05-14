import { NextRequest, NextResponse } from 'next/server'
import { getActiveApi, rotateToNextApi, recordApiFailure } from '@/lib/api-failover'

export async function POST(request: NextRequest) {
  try {
    const { question, topic } = await request.json()

    // Use current active API with failover
    let api = getActiveApi()
    let response = null
    let lastError = ''

    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        console.log(`\n=== Getting Hint via API: ${api.name} ===`)
        response = await fetch(api.url, {
          method: "POST",
      headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${api.key}`,
      },
      body: JSON.stringify({
            model: api.model,
        max_tokens: 256,
        messages: [
          {
            role: 'system',
            content: `You are a CAT exam tutor with 10+ years of experience. Given a question, provide a short helpful hint (2-3 lines max) that guides the student toward the answer without revealing it directly. Focus on the key concept or approach needed. Be encouraging and specific.`
          },
          {
            role: 'user',
            content: `Provide a hint for this CAT ${topic} question: ${question}`
          }
        ]
      })
    })

    if (!response.ok) {
          const errData = await response.text()
          console.error(`❌ API Error (${response.status}) from ${api.name}:`, errData)
          recordApiFailure()
          lastError = `API Error (${response.status}): ${errData}`

          if (attempt < 1) {
            console.log(`🔄 Rotating to next API and retrying...`)
            rotateToNextApi()
            api = getActiveApi()
            continue
          }
          return NextResponse.json({ hint: lastError })
        }

        // Success!
        const data = await response.json()
        const hint = data.choices?.[0]?.message?.content || "Focus on the key information. Eliminate obviously wrong options first."
        console.log(`✅ Hint generated successfully via ${api.name}`)
        return NextResponse.json({ hint })

      } catch (error: any) {
        console.error(`❌ Failed to connect to ${api.name}:`, error)
        recordApiFailure()
        lastError = error.message || 'Connection failed'

        if (attempt < 1) {
          console.log(`🔄 Attempting next API...`)
          rotateToNextApi()
          api = getActiveApi()
        } else {
          console.error(`❌ All API endpoints failed`)
          return NextResponse.json({ hint: lastError })
  }
}
    }

    return NextResponse.json({ hint: "Failed to generate hint after all attempts" })

  } catch (error) {
    console.error('Error in hint route:', error)
    return NextResponse.json({
      hint: "Focus on the key information given in the question. Try to eliminate obviously wrong options first. Look for keywords that indicate what the question is really asking."
    })
  }
}

