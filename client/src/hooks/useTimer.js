import { useState, useEffect, useRef, useCallback } from 'react'

const PHASES = {
  FOCUS: { label: 'Focus', duration: 25 * 60, color: '#8B5CF6' },
  SHORT: { label: 'Short Break', duration: 5 * 60, color: '#10B981' },
  LONG:  { label: 'Long Break',  duration: 15 * 60, color: '#3B82F6' },
}

export function useTimer() {
  const [phase, setPhase] = useState('FOCUS')
  const [timeLeft, setTimeLeft] = useState(PHASES.FOCUS.duration)
  const [isRunning, setIsRunning] = useState(false)
  const [sessionCount, setSessionCount] = useState(0)
  const intervalRef = useRef(null)

  const tick = useCallback(() => {
    setTimeLeft((prev) => {
      if (prev <= 1) {
        clearInterval(intervalRef.current)
        setIsRunning(false)
        if (phase === 'FOCUS') {
          setSessionCount((c) => c + 1)
        }
        return 0
      }
      return prev - 1
    })
  }, [phase])

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(tick, 1000)
    } else {
      clearInterval(intervalRef.current)
    }
    return () => clearInterval(intervalRef.current)
  }, [isRunning, tick])

  const start  = () => setIsRunning(true)
  const pause  = () => setIsRunning(false)
  const reset  = () => { setIsRunning(false); setTimeLeft(PHASES[phase].duration) }

  const switchPhase = (newPhase) => {
    setIsRunning(false)
    setPhase(newPhase)
    setTimeLeft(PHASES[newPhase].duration)
  }

  const progress = 1 - timeLeft / PHASES[phase].duration

  const formatTime = (s) => {
    const m = Math.floor(s / 60).toString().padStart(2, '0')
    const sec = (s % 60).toString().padStart(2, '0')
    return `${m}:${sec}`
  }

  return {
    phase,
    phases: PHASES,
    timeLeft,
    isRunning,
    sessionCount,
    progress,
    formattedTime: formatTime(timeLeft),
    start,
    pause,
    reset,
    switchPhase,
  }
}
