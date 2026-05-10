import { PDFParse as pdfParse } from 'pdf-parse'

import { callGemma, parseJSON } from '../services/aiService.js'

const SYSTEM_PROMPT = `You are an expert academic summarizer and educator.
Analyze the provided document and extract structured information.

CRITICAL: Respond ONLY with valid JSON. No markdown, no explanation, no code fences.

Return this exact structure:
{
  "title": "inferred document title",
  "summary": "3-5 sentence comprehensive summary",
  "keyPoints": ["point 1", "point 2", "point 3", "...up to 8 points"],
  "revisionNotes": ["note 1", "note 2", "...up to 6 notes"],
  "topics": ["topic 1", "topic 2"],
  "difficulty": "beginner|intermediate|advanced",
  "readingTime": "estimated reading time in minutes"
}`

const MAX_CHARS = 14000

export async function summarize(req, res, next) {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No PDF uploaded. Send file as "pdf" field.' })
    }

    if (req.file.mimetype !== 'application/pdf') {
      return res.status(422).json({ success: false, message: 'File must be a PDF.' })
    }

    // Extract text using new class-based API
    const parser = new pdfParse({ data: req.file.buffer })
    await parser.load()
    const result = await parser.getText()
    const rawText = result.text || ''
    const text = rawText.replace(/\s+/g, ' ').trim().slice(0, MAX_CHARS)
    
    if (!text) {
      return res.status(422).json({ success: false, message: 'Could not extract text from PDF. It may be image-based.' })
    }

    const prompt = `Analyze this document and provide a structured summary:\n\n${text}`

    const raw    = await callGemma(prompt, SYSTEM_PROMPT, 2048, 0.5)
    const parsed = parseJSON(raw, 'PDF summary')

    res.json({
      success:      true,
      pages:        result.total || 1,
      charCount:    text.length,
      truncated:    rawText.length > MAX_CHARS,
      title:        parsed.title        || 'Document Summary',
      summary:      parsed.summary      || '',
      keyPoints:    parsed.keyPoints    || [],
      revisionNotes:parsed.revisionNotes|| [],
      topics:       parsed.topics       || [],
      difficulty:   parsed.difficulty   || 'intermediate',
      readingTime:  parsed.readingTime  || null,
    })
  } catch (err) {
    next(err)
  }
}
