import { callGemma, parseJSON } from '../services/aiService.js'

const SYSTEM_PROMPT = `You are an expert DSA (Data Structures & Algorithms) teacher and coding interview coach.
Explain problems in a clear, educational way for students.

CRITICAL: Respond ONLY with valid JSON. No markdown outside the JSON, no code fences around the JSON.

Return this exact structure:
{
  "problemTitle": "short problem title",
  "category": "Array|String|Tree|Graph|DP|Sorting|etc",
  "intuition": "2-3 sentences explaining the key insight",
  "bruteForce": {
    "approach": "explanation of brute force",
    "timeComplexity": "O(...)",
    "spaceComplexity": "O(...)"
  },
  "optimal": {
    "approach": "explanation of optimal approach",
    "code": "clean code implementation",
    "timeComplexity": "O(...)",
    "spaceComplexity": "O(...)"
  },
  "dryRun": "step-by-step trace through an example",
  "commonMistakes": ["mistake 1", "mistake 2", "mistake 3"],
  "similarProblems": ["problem 1", "problem 2"]
}`

export async function explain(req, res, next) {
  try {
    const { problem, code = '', language = 'python' } = req.body

    if (!problem?.trim()) {
      return res.status(400).json({ success: false, message: 'problem description is required' })
    }

    const prompt = `Explain this DSA problem thoroughly in ${language}:

Problem Statement:
${problem}
${code ? `\nUser's Code Attempt:\n\`\`\`${language}\n${code}\n\`\`\`` : ''}

Provide intuition, brute force, optimal solution with ${language} code, dry run trace, common mistakes, and similar problems.
Return ONLY valid JSON.`

    const raw    = await callGemma(prompt, SYSTEM_PROMPT, 3500, 0.5)
    const parsed = parseJSON(raw, 'DSA explanation')

    res.json({
      success:  true,
      language,
      ...parsed,
    })
  } catch (err) {
    next(err)
  }
}
