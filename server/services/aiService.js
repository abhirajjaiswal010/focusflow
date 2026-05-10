import { GoogleGenAI, ThinkingLevel } from '@google/genai'

/* ── Helpers ─────────────────────────────────────── */

export function stripFences(raw) {
  return raw
    .replace(/^```(?:json)?\s*/m, '')
    .replace(/\s*```\s*$/m, '')
    .trim()
}

export function parseJSON(raw, context = 'AI response') {
  try {
    return JSON.parse(stripFences(raw))
  } catch {
    throw new Error(`Failed to parse ${context} as JSON. Raw:\n${raw.slice(0, 400)}`)
  }
}

/* ── Core AI call ────────────────────────────────── */

/**
 * Call Gemma 4 via the official Google Gemini API (@google/genai)
 */
export async function callGemma(
  userPrompt,
  systemPrompt = '',
  maxTokens    = 2048,
  temperature  = 0.7,
) {
  if (!process.env.GEMINI_API_KEY) {
    throw Object.assign(
      new Error('GEMINI_API_KEY is not set. Add it to server/.env (Get it from Google AI Studio)'),
      { status: 503 }
    )
  }

  // Initialize the Gemini API client
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })
  const model = process.env.GEMINI_MODEL || 'gemma-4-26b-a4b-it'

  try {
    // Enable High Thinking Process for DSA or logical tasks
    const isLogicalTask = systemPrompt.includes('DSA') || systemPrompt.includes('code')

    const config = {
      maxOutputTokens: maxTokens,
      temperature: temperature,
    }

    if (systemPrompt && systemPrompt.trim() !== '') {
      config.systemInstruction = systemPrompt
    }

    // Temporarily disabled to make generation instantly fast
    // if (isLogicalTask) {
    //   config.thinkingConfig = {
    //     thinkingLevel: ThinkingLevel.HIGH,
    //   }
    // }

    const response = await ai.models.generateContent({
      model: model,
      contents: userPrompt,
      config: config
    })

    const content = response.text

    if (!content || content.trim() === '') {
      throw new Error('Gemma returned an empty response. Try again.')
    }

    // Log token usage in dev
    if (process.env.NODE_ENV !== 'production' && response.usageMetadata) {
      const usage = response.usageMetadata
      console.log(`🤖 Tokens — prompt: ${usage.promptTokenCount}, completion: ${usage.candidatesTokenCount}`)
      if (usage.promptTokensDetails) {
         console.log(`🧠 Reasoning tokens used: ${response.usageMetadata.reasoningTokenCount || 0}`)
      }
    }

    return content

  } catch (err) {
    const status = err.status || err.response?.status
    
    // Classify error for the global handler
    if (status === 401 || err.message.includes('API key')) {
      throw Object.assign(new Error('Invalid GEMINI_API_KEY. Check your key in .env'), { status: 401 })
    }
    if (status === 429) {
      throw Object.assign(new Error('Google AI Studio rate limit reached. Please wait a minute.'), { status: 429 })
    }

    throw err
  }
}

/* ── Streaming (SSE) support ─────────────────────── */

export async function callGemmaStream(userPrompt, systemPrompt = '', res) {
  if (!process.env.GEMINI_API_KEY) {
    res.write(`data: ${JSON.stringify({ error: 'GEMINI_API_KEY not set' })}\n\n`)
    res.end()
    return
  }

  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })
  const model = process.env.GEMINI_MODEL || 'gemma-4-26b-a4b-it'

  res.setHeader('Content-Type', 'text/event-stream')
  res.setHeader('Cache-Control', 'no-cache')
  res.setHeader('Connection', 'keep-alive')
  res.flushHeaders()

  try {
    const config = { temperature: 0.7 }
    if (systemPrompt && systemPrompt.trim() !== '') {
      config.systemInstruction = systemPrompt
    }

    const stream = await ai.models.generateContentStream({
      model: model,
      contents: userPrompt,
      config: config
    })

    for await (const chunk of stream) {
      const token = chunk.text
      if (token) {
        res.write(`data: ${JSON.stringify({ token })}\n\n`)
      }
    }

    res.write('data: [DONE]\n\n')
    res.end()

  } catch (err) {
    res.write(`data: ${JSON.stringify({ error: err.message })}\n\n`)
    res.end()
  }
}
