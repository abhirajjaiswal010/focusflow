import { Router } from 'express'
const router = Router()

router.get('/health', (req, res) => {
  const aiStatus = {
    provider: 'Google AI Studio',
    model: process.env.GEMINI_MODEL || 'gemma-4-26b-a4b-it',
    apiKey: process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.length > 20 && !process.env.GEMINI_API_KEY.startsWith('your_') 
      ? '✓ configured' : '❌ missing or invalid',
    ready: !!process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.length > 20 && !process.env.GEMINI_API_KEY.startsWith('your_')
  }

  res.json({
    success:   true,
    status:    'online',
    timestamp: new Date().toISOString(),
    ai:        aiStatus,
    server: {
      env:     process.env.NODE_ENV || 'development',
      port:    process.env.PORT || 5000,
      version: '1.0.0',
    },
  })
})

export default router
