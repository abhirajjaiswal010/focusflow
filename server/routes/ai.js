import { Router } from 'express'
import { callGemma, callGemmaStream } from '../services/aiService.js'

const router = Router()

// Generic generate endpoint
router.post('/generate', async (req, res, next) => {
  try {
    const { prompt, systemPrompt = '', maxTokens = 1024 } = req.body
    if (!prompt?.trim()) return res.status(400).json({ success: false, message: 'prompt is required' })
    const result = await callGemma(prompt, systemPrompt, maxTokens)
    res.json({ success: true, result })
  } catch (err) { next(err) }
})

// Streaming endpoint for AI Coach
router.post('/stream', async (req, res) => {
  const { prompt, systemPrompt = '' } = req.body
  if (!prompt?.trim()) {
    res.status(400).json({ success: false, message: 'prompt is required' })
    return
  }
  await callGemmaStream(prompt, systemPrompt, res)
})

export default router
