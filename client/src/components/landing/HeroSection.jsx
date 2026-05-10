import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useAnimation, useInView } from 'framer-motion'
import {
  ArrowRight, Sparkles, Map, FileText,
  Code2, Timer, BarChart3, MessageSquare,
} from 'lucide-react'

/* ── Animated word reveal ─────────────────────── */
function AnimatedHeadline() {
  const LINES = [
    { text: 'Study Smarter.',  color: 'var(--text-primary)' },
    { text: 'Focus Deeper.',   color: 'var(--text-primary)' },
    { text: 'Ship Faster.',    gradient: true },
  ]

  return (
    <h1
      className="text-5xl sm:text-6xl md:text-7xl font-black leading-none tracking-tight"
      style={{ fontFamily: 'Poppins, sans-serif' }}
    >
      {LINES.map(({ text, gradient }, li) => (
        <span key={li} className="block overflow-hidden">
          <motion.span
            className="block"
            initial={{ y: '110%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{
              duration: 0.7,
              delay: 0.2 + li * 0.12,
              ease: [0.22, 1, 0.36, 1],
            }}
            style={gradient ? {} : { color: 'color' }}
          >
            {gradient ? (
              <span className="gradient-text">{text}</span>
            ) : (
              text
            )}
          </motion.span>
        </span>
      ))}
    </h1>
  )
}

/* ── Floating pills ───────────────────────────── */
const PILLS = [
  { icon: Map,          label: 'Study Planner',  color: '#A78BFA', delay: 0.9  },
  { icon: Code2,        label: 'DSA Explainer',  color: '#F472B6', delay: 1.0  },
  { icon: FileText,     label: 'PDF Summarizer', color: '#60A5FA', delay: 1.1  },
  { icon: Timer,        label: 'Focus Timer',    color: '#FBBF24', delay: 1.2  },
  { icon: BarChart3,    label: 'Analytics',      color: '#34D399', delay: 1.3  },
  { icon: MessageSquare,label: 'AI Coach',       color: '#2DD4BF', delay: 1.4  },
]

function FloatingPills() {
  return (
    <div className="flex flex-wrap gap-2 justify-center md:justify-start">
      {PILLS.map(({ icon: Icon, label, color, delay }) => (
        <motion.div
          key={label}
          initial={{ opacity: 0, scale: 0.85, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.4, delay, ease: 'backOut' }}
          whileHover={{ y: -2, scale: 1.04 }}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold"
          style={{
            background: `${color}14`,
            border: `1px solid ${color}30`,
            color,
          }}
        >
          <Icon size={12} />
          {label}
        </motion.div>
      ))}
    </div>
  )
}

/* ── Mock UI preview card ─────────────────────── */
function HeroPreview() {
  return (
    <motion.div
      initial={{ opacity: 0, x: 40, rotate: 2 }}
      animate={{ opacity: 1, x: 0, rotate: 0 }}
      transition={{ duration: 0.9, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="relative"
    >
      {/* Glow behind */}
      

      {/* Main card */}
      <div
        className="relative rounded-2xl overflow-hidden"
        style={{
          background: 'var(--bg-card)',
          border: '3px solid rgba(139,92,246,0.25)',
         
        }}
      >
        {/* Fake topbar */}
        <div
          className="flex items-center gap-2 px-4 py-3"
          style={{ borderBottom: '1px solid var(--border)', background: 'rgba(17,24,39,0.9)' }}
        >
          <div className="w-3 h-3 rounded-full bg-red-500 opacity-80" />
          <div className="w-3 h-3 rounded-full bg-yellow-500 opacity-80" />
          <div className="w-3 h-3 rounded-full bg-green-500 opacity-80" />
          <div
            className="ml-2 flex-1 rounded-md px-3 py-1 text-xs"
            style={{ background: 'var(--bg-elevated)', color: 'var(--text-faint)' }}
          >
            focusflow.ai/dashboard
          </div>
        </div>

        {/* Fake sidebar + content */}
        <div className="flex" style={{ height: 320 }}>
          {/* Sidebar */}
          <div
            className="w-44 shrink-0 p-3 flex flex-col gap-1"
            style={{ borderRight: '1px solid var(--border)', background: 'rgba(17,24,39,0.7)' }}
          >
            <div className="flex items-center gap-2 px-2 py-2 mb-2">
              <div className="w-6 h-6 rounded-lg gradient-bg flex items-center justify-center">
                <Sparkles size={11} color="#fff" />
              </div>
              <span className="text-xs font-bold">FocusFlow</span>
            </div>
            {[
              { label: 'Dashboard', active: true, color: '#A78BFA' },
              { label: 'Study Planner',  color: '#60A5FA' },
              { label: 'PDF Summarizer', color: '#2DD4BF' },
              { label: 'DSA Explainer',  color: '#F472B6' },
              { label: 'Focus Timer',    color: '#FBBF24' },
              { label: 'Analytics',      color: '#34D399' },
            ].map(({ label, active, color }) => (
              <div
                key={label}
                className="px-2 py-1.5 rounded-lg text-xs font-medium flex items-center gap-2"
                style={{
                  background: active ? 'rgba(139,92,246,0.12)' : 'transparent',
                  color: active ? '#C4B5FD' : 'var(--text-faint)',
                  borderLeft: active ? '2px solid #8B5CF6' : '2px solid transparent',
                }}
              >
                <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: color }} />
                {label}
              </div>
            ))}
          </div>

          {/* Content */}
          <div className="flex-1 p-4 flex flex-col gap-3">
            {/* Stat row */}
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: 'Streak', value: '7 days', color: '#FBBF24' },
                { label: 'Sessions', value: '24', color: '#A78BFA' },
              ].map(({ label, value, color }) => (
                <div
                  key={label}
                  className="p-2.5 rounded-xl flex items-center gap-2"
                  style={{ background: `${color}10`, border: `1px solid ${color}22` }}
                >
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: `${color}20` }}>
                    <div className="w-2 h-2 rounded-full" style={{ background: color }} />
                  </div>
                  <div>
                    <div className="text-xs font-bold" style={{ color }}>{value}</div>
                    <div className="text-xs" style={{ color: 'var(--text-faint)' }}>{label}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Feature cards */}
            <div className="grid grid-cols-2 gap-2 flex-1">
              {[
                { label: 'Study Planner', desc: 'AI roadmaps',   color: '#A78BFA' },
                { label: 'DSA Explainer', desc: 'Code mastery',  color: '#F472B6' },
                { label: 'Focus Timer',   desc: 'Pomodoro',      color: '#FBBF24' },
                { label: 'Analytics',     desc: 'Track growth',  color: '#34D399' },
              ].map(({ label, desc, color }) => (
                <div
                  key={label}
                  className="p-2.5 rounded-xl flex flex-col gap-1"
                  style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)' }}
                >
                  <div className="w-5 h-5 rounded-lg" style={{ background: `${color}25` }}>
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full" style={{ background: color }} />
                    </div>
                  </div>
                  <div className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>{label}</div>
                  <div className="text-xs" style={{ color: 'var(--text-faint)' }}>{desc}</div>
                </div>
              ))}
            </div>

            {/* AI response preview */}
            <motion.div
              animate={{ opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 2.5, repeat: Infinity }}
              className="p-2.5 rounded-xl flex items-center gap-2"
              style={{ background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.2)' }}
            >
              <Sparkles size={12} style={{ color: '#A78BFA' }} />
              <span className="text-xs" style={{ color: '#C4B5FD' }}>
                Gemma 4 is generating your roadmap...
              </span>
              <div className="flex gap-0.5 ml-auto">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="w-1 h-1 rounded-full"
                    style={{ background: '#A78BFA' }}
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1, delay: i * 0.25, repeat: Infinity }}
                  />
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

/* ── Hero Section ─────────────────────────────── */
export default function HeroSection() {
  return (
    <section
      className="relative min-h-screen flex flex-col items-center justify-center px-4 pt-28 pb-20 overflow-hidden"
      style={{ background: 'var(--bg-primary)' }}
    >
      {/* Background orbs */}
      <div className="orb orb-purple absolute" style={{ width: 600, height: 600, top: -200, left: -150 }} />
      <div className="orb orb-blue absolute"   style={{ width: 500, height: 500, top: 100, right: -200, animationDelay: '5s' }} />
      <div className="orb orb-teal absolute"   style={{ width: 400, height: 400, bottom: -100, left: '40%', animationDelay: '9s' }} />

      {/* Dot grid overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.15) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

        {/* Left — copy */}
        <div className="flex flex-col gap-8 text-center lg:text-left">

          {/* Top badge */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex justify-center lg:justify-start"
          >
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold"
              style={{
                background: 'rgba(139,92,246,0.12)',
                border: '1px solid rgba(139,92,246,0.3)',
                color: '#C4B5FD',
              }}
            >
              <motion.span
                animate={{ rotate: [0, 15, -15, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              >
                ✦
              </motion.span>
              Built for the Gemma 4 Challenge — 2026
            </div>
          </motion.div>

          {/* Headline */}
          <AnimatedHeadline />

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-base md:text-lg leading-relaxed max-w-lg mx-auto lg:mx-0"
            style={{ color: 'var(--text-muted)' }}
          >
            The AI-powered productivity platform for students, developers, and
            deep-work practitioners. Create roadmaps, summarize PDFs, master DSA,
            and track your focus — all powered by{' '}
            <span style={{ color: '#A78BFA', fontWeight: 600 }}>Gemma 4</span>.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.75 }}
            className="flex flex-wrap gap-3 justify-center lg:justify-start"
          >
            <Link to="/dashboard">
              <motion.button
                whileHover={{ scale: 1.04, boxShadow: '0 0 30px rgba(139,92,246,0.4)' }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-white"
                style={{ background: 'linear-gradient(135deg, #8B5CF6, #3B82F6)' }}
              >
                Start for Free
                <ArrowRight size={16} />
              </motion.button>
            </Link>
            <button
              onClick={() => document.querySelector('#how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
            >
              <motion.div
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold"
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: 'var(--text-primary)',
                }}
              >
                See How it Works
              </motion.div>
            </button>
          </motion.div>

          {/* Feature pills */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.85 }}
          >
            <p className="text-xs font-medium mb-3 text-center lg:text-left" style={{ color: 'var(--text-faint)' }}>
              6 AI-powered tools included
            </p>
            <FloatingPills />
          </motion.div>
        </div>

        {/* Right — UI preview */}
        <div className="hidden lg:block">
          <HeroPreview />
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        style={{ color: 'var(--text-faint)' }}
      >
        <span className="text-xs">Scroll to explore</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
          className="w-5 h-8 rounded-full border flex items-start justify-center pt-1.5"
          style={{ borderColor: 'var(--border)' }}
        >
          <div className="w-1 h-2 rounded-full" style={{ background: 'var(--accent-1)' }} />
        </motion.div>
      </motion.div>
    </section>
  )
}
