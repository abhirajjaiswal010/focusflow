import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { connectDB } from './config/db.js'

// Route imports
import healthRouter  from './routes/health.js'
import aiRouter      from './routes/ai.js'
import plannerRouter from './routes/planner.js'
import pdfRouter     from './routes/pdf.js'
import dsaRouter     from './routes/dsa.js'
import authRouter    from './routes/auth.js'

const app  = express()
const PORT = process.env.PORT || 5000

// ── Middleware ────────────────────────────────────────
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:3000',
    process.env.FRONTEND_URL || 'https://your-frontend.vercel.app',
  ],
  credentials: true,
}))
app.use(express.json({ limit: '15mb' }))
app.use(express.urlencoded({ extended: true, limit: '15mb' }))

// ── Request logger (dev only) ─────────────────────────
if (process.env.NODE_ENV !== 'production') {
  app.use((req, _res, next) => {
    console.log(`→ ${req.method} ${req.path}`)
    next()
  })
}

// ── Routes ────────────────────────────────────────────
app.use('/api',          healthRouter)
app.use('/api/ai',       aiRouter)
app.use('/api/planner',  plannerRouter)
app.use('/api/pdf',      pdfRouter)
app.use('/api/dsa',      dsaRouter)
app.use('/api/auth',     authRouter)

// ── 404 handler ───────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.path} not found` })
})

// ── Global error handler ──────────────────────────────
app.use((err, req, res, _next) => {
  const status  = err.status || err.response?.status || 500
  const message = err.message || 'Internal Server Error'

  // Surface OpenRouter API errors clearly
  const detail = err.response?.data?.error?.message || null

  console.error(`❌ [${status}] ${message}`, detail || '')
  res.status(status).json({
    success: false,
    message: detail || message,
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
  })
})

// ── Start server ──────────────────────────────────────
async function start() {
  // MongoDB is optional — AI routes work without it
  if (process.env.MONGODB_URI && !process.env.MONGODB_URI.includes('<')) {
    await connectDB().catch((err) => {
      console.warn('⚠️  MongoDB skipped:', err.message)
    })
  } else {
    console.log('ℹ️  MongoDB URI not set — running in AI-only mode')
  }

  app.listen(PORT, () => {
    console.log(`\n✅ FocusFlow API  →  http://localhost:${PORT}`)
    console.log(`🤖 Model          →  ${process.env.GEMINI_MODEL || 'gemma-4-26b-a4b-it'}`)
    console.log(`🔑 API Key        →  ${process.env.GEMINI_API_KEY ? '✓ set' : '✗ MISSING — set GEMINI_API_KEY in .env'}`)
    console.log(`\n   Health check   →  http://localhost:${PORT}/api/health\n`)
  })
}

start()
