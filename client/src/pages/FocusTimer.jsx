import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Play, Pause, RotateCcw, Coffee, Zap,
  Volume2, VolumeX, Settings, CheckCircle2, Flame
} from 'lucide-react'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'

// Focus Timer Settings
const MODES = {
  FOCUS: { id: 'FOCUS', label: 'Focus', time: 25 * 60, color: '#8B5CF6', icon: Zap },
  BREAK: { id: 'BREAK', label: 'Short Break', time: 5 * 60, color: '#10B981', icon: Coffee },
}

export default function FocusTimer() {
  const [mode, setMode] = useState(MODES.FOCUS)
  const [timeLeft, setTimeLeft] = useState(mode.time)
  const [isActive, setIsActive] = useState(false)
  const [sessions, setSessions] = useState(0)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [streak, setStreak] = useState(0)

  // Use refs for audio to prevent unnecessary re-renders
  const audioRef = useRef(null)

  // Initialize audio lazily or assume the user will interact first
  useEffect(() => {
    audioRef.current = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3')
    
    // Load local storage data
    const savedSessions = localStorage.getItem('ff_sessions')
    if (savedSessions) setSessions(parseInt(savedSessions, 10))
    const savedStreak = localStorage.getItem('ff_streak')
    if (savedStreak) setStreak(parseInt(savedStreak, 10))
  }, [])

  const switchMode = (newMode) => {
    setMode(newMode)
    setTimeLeft(newMode.time)
    setIsActive(false)
  }

  const toggleTimer = () => setIsActive(!isActive)
  const resetTimer = () => {
    setIsActive(false)
    setTimeLeft(mode.time)
  }

  const playSound = () => {
    if (soundEnabled && audioRef.current) {
      audioRef.current.currentTime = 0
      audioRef.current.play().catch(() => {}) // Catch browser auto-play restrictions
    }
  }

  const handleSessionComplete = useCallback(() => {
    playSound()
    if (mode.id === 'FOCUS') {
      const newSessions = sessions + 1
      setSessions(newSessions)
      localStorage.setItem('ff_sessions', newSessions)
      
      // Basic streak logic
      const newStreak = streak + 1
      setStreak(newStreak)
      localStorage.setItem('ff_streak', newStreak)

      switchMode(MODES.BREAK)
    } else {
      switchMode(MODES.FOCUS)
    }
  }, [mode, sessions, streak, soundEnabled])

  // Timer Tick Logic
  useEffect(() => {
    let interval = null
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft(t => t - 1), 1000)
    } else if (isActive && timeLeft === 0) {
      setIsActive(false)
      handleSessionComplete()
    }
    return () => clearInterval(interval)
  }, [isActive, timeLeft, handleSessionComplete])

  // Formatting math
  const minutes = Math.floor(timeLeft / 60)
  const seconds = timeLeft % 60
  const progress = ((mode.time - timeLeft) / mode.time) * 100
  const strokeDashoffset = 283 - (283 * progress) / 100

  return (
    <div className="h-[calc(100vh-100px)] w-full flex items-center justify-center p-6 -mt-6">
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="card w-full max-w-xl p-8 relative overflow-hidden"
      >
        {/* Background glow orb */}
        <div 
          className="absolute inset-0 opacity-20 pointer-events-none transition-colors duration-1000"
          style={{ background: `radial-gradient(circle at 50% 50%, ${mode.color}, transparent 60%)` }}
        />

        <div className="relative z-10 flex flex-col items-center">
          
          {/* Header Stats */}
          <div className="w-full flex items-center justify-between mb-8">
            <Badge variant="ghost" icon={Flame} style={{ color: '#F97316' }}>
              {streak} Day Streak
            </Badge>
            <div className="flex gap-2">
              <button 
                onClick={() => setSoundEnabled(!soundEnabled)}
                className="p-2 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border)] text-[var(--text-muted)] hover:text-white transition"
              >
                {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
              </button>
            </div>
          </div>

          {/* Mode Selector */}
          <div className="flex bg-[var(--bg-elevated)] p-1 rounded-xl mb-12 border border-[var(--border)]">
            {Object.values(MODES).map((m) => (
              <button
                key={m.id}
                onClick={() => switchMode(m)}
                className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ${
                  mode.id === m.id 
                    ? 'bg-white/10 text-white shadow-sm' 
                    : 'text-[var(--text-muted)] hover:text-white'
                }`}
              >
                <m.icon size={16} style={{ color: mode.id === m.id ? m.color : 'currentColor' }} />
                {m.label}
              </button>
            ))}
          </div>

          {/* Circular Timer Display */}
          <div className="relative flex justify-center items-center mb-12">
            <svg className="w-64 h-64 transform -rotate-90">
              <circle
                cx="128" cy="128" r="120"
                fill="none"
                stroke="var(--bg-elevated)"
                strokeWidth="8"
              />
              <motion.circle
                cx="128" cy="128" r="120"
                fill="none"
                stroke={mode.color}
                strokeWidth="8"
                strokeLinecap="round"
                initial={{ strokeDasharray: 754, strokeDashoffset: 754 }}
                animate={{ strokeDashoffset: 754 - (754 * progress) / 100 }}
                transition={{ duration: 1, ease: "linear" }}
              />
            </svg>
            
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-6xl font-['JetBrains_Mono'] font-bold tracking-tighter" style={{ color: mode.color, textShadow: `0 0 40px ${mode.color}40` }}>
                {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
              </span>
              <span className="text-sm text-[var(--text-muted)] mt-2 uppercase tracking-widest font-bold">
                {mode.label}
              </span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="lg"
              className="w-14 h-14 !p-0 flex items-center justify-center rounded-2xl"
              onClick={resetTimer}
            >
              <RotateCcw size={20} />
            </Button>

            <button
              onClick={toggleTimer}
              className="w-20 h-20 rounded-3xl flex items-center justify-center text-white transition-all transform hover:scale-105 active:scale-95 shadow-lg"
              style={{ background: mode.color, boxShadow: `0 8px 30px ${mode.color}50` }}
            >
              {isActive ? <Pause size={32} className="fill-current" /> : <Play size={32} className="fill-current ml-2" />}
            </button>
            
            <div className="w-14" /> {/* Spacer for balance */}
          </div>

          {/* Session Tracker */}
          <div className="mt-12 flex flex-col items-center">
            <p className="text-xs text-[var(--text-faint)] uppercase tracking-widest font-bold mb-3">Daily Focus</p>
            <div className="flex gap-2">
              {[...Array(4)].map((_, i) => (
                <div 
                  key={i} 
                  className={`w-12 h-2 rounded-full transition-colors duration-500 ${
                    i < sessions % 4 ? 'bg-[#8B5CF6]' : 'bg-[var(--bg-elevated)] border border-[var(--border)]'
                  }`}
                />
              ))}
            </div>
            <p className="text-xs text-[var(--text-muted)] mt-3">
              {sessions} session{sessions !== 1 && 's'} completed
            </p>
          </div>

        </div>
      </motion.div>
    </div>
  )
}
