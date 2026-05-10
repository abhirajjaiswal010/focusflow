import { useLocation } from 'react-router-dom'
import { Flame, Sparkles, Menu,Zap } from 'lucide-react'
import { useApp } from '../../context/AppContext'

const PAGE_META = {
  '/dashboard':      { title: 'Dashboard',       subtitle: 'Your productivity at a glance' },
  '/planner':        { title: 'Study Planner',   subtitle: 'AI-generated learning roadmaps' },
  '/pdf-summarizer': { title: 'PDF Summarizer',  subtitle: 'Extract insights from any document' },
  '/dsa-explainer':  { title: 'DSA Explainer',   subtitle: 'Master algorithms with Gemma AI' },
  '/focus-timer':    { title: 'Focus Timer',     subtitle: 'Deep work, one Pomodoro at a time' },
  '/analytics':      { title: 'Analytics',       subtitle: 'Track your growth over time' },
  '/ai-coach':       { title: 'AI Coach',        subtitle: 'Your intelligent study companion' },
}

export default function Topbar({ onMenuClick }) {
  const location = useLocation()
  const { streak, totalSessions } = useApp()
  const meta = PAGE_META[location.pathname] || { title: 'FocusFlow AI', subtitle: '' }

  return (
    <header
      className="sticky top-4 z-40 flex items-center mx-6 md:mx-10 my-2 gap-5 px-4 md:px-10 py-5 shrink-0 bg-[#F3F0E7]/60 backdrop-blur-sm rounded-full border border-white/40 shadow-[0_8px_32px_0_rgba(31,38,135,0.07)]"
    >
      {/* Mobile menu button */}
      <button
        onClick={onMenuClick}
        className="lg:hidden p-2.5 rounded-xl transition-all duration-300 hover:bg-black/5"
        style={{ color: 'var(--text-primary)' }}
      >
        <Menu size={20} />
      </button>

      {/* Page title */}
      <div className="flex-1 min-w-0">
        <h1
          className="text-lg font-extrabold leading-tight truncate tracking-tight"
          style={{ fontFamily: 'Manrope, sans-serif' }}
        >
          {meta.title}
        </h1>
        {meta.subtitle && (
          <p className="text-[0.75rem] font-medium mt-0.5 truncate hidden sm:block" style={{ color: 'var(--text-muted)' }}>
            {meta.subtitle}
          </p>
        )}
      </div>

      {/* Right badges */}
      <div className="flex items-center gap-3 shrink-0">
        {/* Streak */}
        <div
          className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-2xl text-[0.7rem] font-bold uppercase tracking-wider shadow-sm transition-transform hover:scale-105"
          style={{
            background: streak > 0 ? '#FDF8E6' : 'rgba(255,255,255,0.4)',
            color: streak > 0 ? '#B45309' : 'var(--text-faint)',
            border: `1px solid ${streak > 0 ? '#FDE68A' : 'var(--border)'}`,
          }}
        >
          <Flame size={14} className={streak > 0 ? "text-orange-500" : ""} />
          {streak} Day Streak
        </div>

        {/* Sessions */}
        <div
          className="hidden md:flex items-center gap-2 px-4 py-2 rounded-2xl text-[0.7rem] font-bold uppercase tracking-wider shadow-sm transition-transform hover:scale-105"
          style={{
            background: '#F0F4FF',
            color: '#4338CA',
            border: '1px solid #E0E7FF',
          }}
        >
          <Sparkles size={14} className="text-indigo-500" />
          {totalSessions} Sessions
        </div>

        {/* Gemma badge */}
        <div
          className="flex items-center gap-2 px-4 py-2 rounded-2xl text-[0.7rem] font-bold uppercase tracking-wider shadow-sm transition-transform hover:scale-105"
          style={{
            background: 'linear-gradient(135deg, #2A2529, #5A5559)',
            color: '#F3F0E7',
            border: '1px solid #2A2529',
          }}
        >
          <Zap size={14} fill="#F3F0E7" />
          Gemma 4
        </div>
      </div>
    </header>
  )
}
