import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  timeout: 150000, // 150s to allow backend retries
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor — attach auth token if present
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('ff_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor — handle global errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('ff_token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api
