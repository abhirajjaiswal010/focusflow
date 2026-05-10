import { callGemma, parseJSON } from '../services/aiService.js'

const SYSTEM_PROMPT = `You are an expert learning coach and curriculum designer.
Generate a structured, week-by-week study roadmap.

CRITICAL: Respond ONLY with valid JSON. No markdown, no explanation, no code fences.

Return this exact structure:
{
  "title": "short roadmap title",
  "overview": "2-sentence overview of the plan",
  "roadmap": [
    {
      "week": 1,
      "title": "week theme title",
      "topics": ["topic 1", "topic 2", "topic 3"],
      "resources": ["resource 1", "resource 2"],
      "goal": "what the learner will achieve this week",
      "difficulty": "beginner|intermediate|advanced",
      "estimatedHours": 8
    }
  ]
}`

export async function generatePlan(req, res, next) {
  try {
    const { goal, timeline, level = 'beginner', focus = '' } = req.body

    if (!goal?.trim())     return res.status(400).json({ success: false, message: 'goal is required' })
    if (!timeline?.trim()) return res.status(400).json({ success: false, message: 'timeline is required' })

    const prompt = `Create a detailed study roadmap:
- Goal: ${goal}
- Timeline: ${timeline}
- Experience level: ${level}
${focus ? `- Focus areas: ${focus}` : ''}

Generate a complete week-by-week plan. Be specific and actionable.
Return ONLY valid JSON matching the schema.`

    const raw    = await callGemma(prompt, SYSTEM_PROMPT, 3500, 0.6)
    const parsed = parseJSON(raw, 'study roadmap')

    if (!parsed.roadmap || !Array.isArray(parsed.roadmap)) {
      throw new Error('Invalid roadmap structure from AI')
    }

    res.json({
      success: true,
      goal,
      timeline,
      level,
      title:    parsed.title    || `${goal} Roadmap`,
      overview: parsed.overview || '',
      roadmap:  parsed.roadmap,
      weekCount: parsed.roadmap.length,
    })
  } catch (err) {
    next(err)
  }
}
