import { useState, useCallback, useRef } from 'react'
import api from '../services/api'

/**
 * useAI — generic hook for making AI API calls with loading/error/data state.
 *
 * Usage:
 *   const { call, data, loading, error, reset } = useAI('/api/planner/generate')
 *   await call({ goal: 'Learn React', timeline: '4 weeks' })
 *
 * @param {string}   endpoint    - Backend API path (e.g. '/api/planner/generate')
 * @param {object}   options
 * @param {string}   options.method      - HTTP method (default 'POST')
 * @param {Function} options.onSuccess   - Callback when response is received
 * @param {Function} options.onError     - Callback on error
 */
export function useAI(endpoint, options = {}) {
  const { method = 'POST', onSuccess, onError } = options

  const [data,    setData]    = useState(null)
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState(null)

  const abortRef = useRef(null)

  const call = useCallback(async (payload) => {
    setLoading(true)
    setError(null)

    // Cancel any previous in-flight request
    abortRef.current?.abort()
    abortRef.current = new AbortController()

    try {
      const config = { signal: abortRef.current.signal }
      let response

      if (method === 'POST') {
        response = await api.post(endpoint, payload, config)
      } else if (method === 'GET') {
        response = await api.get(endpoint, { params: payload, ...config })
      }

      const result = response.data
      setData(result)
      onSuccess?.(result)
      return result

    } catch (err) {
      if (err.name === 'CanceledError') return // silently ignore aborts

      const message =
        err.response?.data?.message ||
        err.message ||
        'Something went wrong. Please try again.'

      setError(message)
      onError?.(message)
    } finally {
      setLoading(false)
    }
  }, [endpoint, method, onSuccess, onError])

  const reset = useCallback(() => {
    setData(null)
    setError(null)
    setLoading(false)
  }, [])

  const cancel = useCallback(() => {
    abortRef.current?.abort()
    setLoading(false)
  }, [])

  return { call, data, loading, error, reset, cancel }
}

/**
 * useAIStream — hook for streaming AI responses (AI Coach feature).
 * Calls the SSE endpoint and accumulates tokens into `text`.
 *
 * @param {string} systemPrompt - System prompt for AI Coach persona
 */
export function useAIStream(systemPrompt = '') {
  const [text,    setText]    = useState('')
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState(null)

  const stream = useCallback(async (userPrompt) => {
    setLoading(true)
    setError(null)
    setText('')

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/ai/stream`,
        {
          method:  'POST',
          headers: { 'Content-Type': 'application/json' },
          body:    JSON.stringify({ prompt: userPrompt, systemPrompt }),
        },
      )

      if (!response.ok) {
        throw new Error(`Server error ${response.status}`)
      }

      const reader  = response.body.getReader()
      const decoder = new TextDecoder()

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value)
        const lines = chunk.split('\n').filter((l) => l.startsWith('data: '))

        for (const line of lines) {
          const payload = line.slice(6).trim()
          if (payload === '[DONE]') break
          try {
            const { token, error: sseError } = JSON.parse(payload)
            if (sseError) throw new Error(sseError)
            if (token) setText((prev) => prev + token)
          } catch { /* skip malformed SSE */ }
        }
      }
    } catch (err) {
      setError(err.message || 'Streaming failed')
    } finally {
      setLoading(false)
    }
  }, [systemPrompt])

  const reset = useCallback(() => {
    setText('')
    setError(null)
    setLoading(false)
  }, [])

  return { stream, text, loading, error, reset }
}
