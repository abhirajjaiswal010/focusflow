import { callGemma } from '../services/aiService.js'

export async function generate(req, res, next) {
  try {
    const { prompt, systemPrompt } = req.body
    if (!prompt) return res.status(400).json({ success: false, message: 'prompt is required' })

    const result = await callGemma(prompt, systemPrompt)
    res.json({ success: true, result })
  } catch (err) {
    next(err)
  }
}
