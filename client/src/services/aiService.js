import api from './api'

export const generateStudyPlan = (payload) =>
  api.post('/api/planner/generate', payload)

export const summarizePDF = (formData) =>
  api.post('/api/pdf/summarize', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })

export const explainDSA = (payload) =>
  api.post('/api/dsa/explain', payload)

export const generateAIResponse = (payload) =>
  api.post('/api/ai/generate', payload)
