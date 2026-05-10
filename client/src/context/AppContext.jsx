import { createContext, useContext, useState, useEffect } from 'react'

const AppContext = createContext(null)

export function AppProvider({ children }) {
  const [streak, setStreak] = useState(() => {
    return parseInt(localStorage.getItem('ff_streak') || '0', 10)
  })
  const [totalSessions, setTotalSessions] = useState(() => {
    return parseInt(localStorage.getItem('ff_sessions') || '0', 10)
  })
  const [studyHours, setStudyHours] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('ff_study_hours') || '[]')
    } catch {
      return []
    }
  })

  // Persist to localStorage on change
  useEffect(() => {
    localStorage.setItem('ff_streak', streak)
  }, [streak])

  useEffect(() => {
    localStorage.setItem('ff_sessions', totalSessions)
  }, [totalSessions])

  useEffect(() => {
    localStorage.setItem('ff_study_hours', JSON.stringify(studyHours))
  }, [studyHours])

  const addSession = () => {
    setTotalSessions((s) => s + 1)
  }

  const incrementStreak = () => {
    setStreak((s) => s + 1)
  }

  const resetStreak = () => setStreak(0)

  return (
    <AppContext.Provider
      value={{
        streak,
        totalSessions,
        studyHours,
        addSession,
        incrementStreak,
        resetStreak,
        setStudyHours,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
