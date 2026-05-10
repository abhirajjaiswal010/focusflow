import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Map, FileText, Code2, Timer,
  BarChart3, MessageSquare, Flame,
  Clock, Target, TrendingUp, Zap,
  ArrowRight, BookOpen, Brain,
} from 'lucide-react'
import { useApp } from '../context/AppContext'
import Card from '../components/ui/Card'
import Badge from '../components/ui/Badge'

/* ── Animation helpers ─────────────────────────── */
const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
}
const item = {
  hidden: { opacity: 0, y: 16 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] } },
}

/* ── Feature cards data ────────────────────────── */
const FEATURES = [
  {
    path: '/planner',
    icon: Map,
    label: 'Study Planner',
    desc: 'Generate a personalized week-by-week roadmap for any goal',
    badge: 'AI-Powered',
    badgeVariant: 'purple',
    color: '#4A6094', // Muted Blue
    glow: 'rgba(74, 96, 148, 0.12)',
  },
  {
    path: '/pdf-summarizer',
    icon: FileText,
    label: 'PDF Summarizer',
    desc: 'Upload any PDF and get a structured summary with key points',
    badge: 'Gemma 4',
    badgeVariant: 'blue',
    color: '#4A6652', // Muted Green
    glow: 'rgba(74, 102, 82, 0.12)',
  },
  {
    path: '/dsa-explainer',
    icon: Code2,
    label: 'DSA Explainer',
    desc: 'Paste any coding problem and get a full breakdown with code',
    badge: 'For Devs',
    badgeVariant: 'pink',
    color: '#2A2529', // Charcoal
    glow: 'rgba(42, 37, 41, 0.12)',
  },
  {
    path: '/focus-timer',
    icon: Timer,
    label: 'Focus Timer',
    desc: 'Pomodoro sessions with streak tracking and deep work modes',
    badge: 'Productivity',
    badgeVariant: 'warning',
    color: '#B45309', // Muted Amber
    glow: 'rgba(180, 83, 9, 0.1)',
  },
  {
    path: '/analytics',
    icon: BarChart3,
    label: 'Analytics',
    desc: 'Visualize your study hours, streaks and productivity trends',
    badge: 'Insights',
    badgeVariant: 'success',
    color: '#4A6652',
    glow: 'rgba(74, 102, 82, 0.1)',
  },
  {
    path: '/ai-coach',
    icon: MessageSquare,
    label: 'AI Coach',
    desc: 'Chat with your personal Gemma-powered productivity mentor',
    badge: 'Chat',
    badgeVariant: 'teal',
    color: '#2A2529',
    glow: 'rgba(42, 37, 41, 0.1)',
  },
]

/* ── Stat card ─────────────────────────────────── */
function StatCard({ icon: Icon, label, value, sub, color }) {
  return (
    <motion.div variants={item}>
      <div
        className="card p-6 flex items-center gap-5"
        style={{
          background: 'var(--bg-card)',
          border: `1px solid var(--border)`,
          boxShadow: 'var(--shadow-card)',
        }}
      >
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-sm"
          style={{ background: `${color}10`, border: `1px solid ${color}20` }}
        >
          <Icon size={24} style={{ color }} />
        </div>
        <div>
          <p className="stat-number text-3xl tracking-tighter" style={{ fontFamily: 'Manrope, sans-serif' }}>{value}</p>
          <p className="text-[0.7rem] uppercase tracking-wider font-bold mt-1" style={{ color: 'var(--text-faint)' }}>{label}</p>
          {sub && <p className="text-[10px] font-medium mt-0.5 truncate" style={{ color: 'var(--text-muted)' }}>{sub}</p>}
        </div>
      </div>
    </motion.div>
  )
}

/* ── Feature card ──────────────────────────────── */
function FeatureCard({ path, icon: Icon, label, desc, badge, badgeVariant, color, glow }) {
  return (
    <motion.div variants={item}>
      <Link to={path}>
        <motion.div
          className="card p-6 h-full flex flex-col gap-5 cursor-pointer group border-transparent"
          whileHover={{ y: -6, boxShadow: 'var(--shadow-lg)' }}
          transition={{ type: 'spring', stiffness: 350, damping: 25 }}
        >
          <div className="flex items-start justify-between">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm transition-transform group-hover:scale-110"
              style={{ background: `${color}10`, border: `1px solid ${color}25` }}
            >
              <Icon size={22} style={{ color }} />
            </div>
            <Badge variant={badgeVariant} size="xs" uppercase weight="bold">{badge}</Badge>
          </div>

          <div className="flex-1">
            <h3 className="font-extrabold text-[1.05rem] mb-2 tracking-tight" style={{ fontFamily: 'Manrope, sans-serif' }}>
              {label}
            </h3>
            <p className="text-[0.85rem] leading-relaxed" style={{ color: 'var(--text-muted)' }}>
              {desc}
            </p>
          </div>

          <div
            className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest transition-all group-hover:gap-3"
            style={{ color }}
          >
            Explore
            <ArrowRight
              size={14}
              className="transition-transform"
            />
          </div>
        </motion.div>
      </Link>
    </motion.div>
  )
}

/* ── Quick action ──────────────────────────────── */
function QuickAction({ icon: Icon, label, path, color }) {
  return (
    <Link to={path}>
      <motion.div
        whileHover={{ scale: 1.05, y: -2 }}
        whileTap={{ scale: 0.95 }}
        className="flex flex-col items-center gap-2.5 p-5 rounded-3xl cursor-pointer text-center transition-all shadow-sm hover:shadow-md"
        style={{ background: 'white', border: `1px solid var(--border)` }}
      >
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${color}10` }}>
          <Icon size={20} style={{ color }} />
        </div>
        <span className="text-[0.7rem] font-bold uppercase tracking-wider" style={{ color: 'var(--text-primary)' }}>{label}</span>
      </motion.div>
    </Link>
  )
}

/* ── Main Dashboard ────────────────────────────── */
export default function Dashboard() {
  const { streak, totalSessions } = useApp()

  const stats = [
    { icon: Flame,      label: 'Day Streak',    value: streak,         sub: streak === 0 ? 'Start your streak!' : 'Consistency is key', color: '#B45309' },
    { icon: Clock,      label: 'Focus Hours',   value: '12.4h',        sub: 'Total study time',                               color: '#4A6094' },
    { icon: Target,     label: 'Tasks Done',    value: 42,            sub: 'This month',                                     color: '#4A6652' },
    { icon: TrendingUp, label: 'Efficiency',    value: '94%',         sub: 'Top 5% of users',                                color: '#2A2529' },
  ]

  return (
    <div className="max-w-7xl mx-auto space-y-12">

      {/* ── Welcome hero ─────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative overflow-hidden rounded-[32px] p-8 md:p-12 shadow-sm border border-[var(--border)]"
        style={{
          background: 'linear-gradient(135deg, #F3F0E7 0%, #EAE7DC 100%)',
        }}
      >
        {/* Decorative noise/texture */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/cubes.png")' }} />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center gap-10">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-6">
              <Badge variant="purple" size="sm" dot weight="bold">Active Session</Badge>
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/5 border border-black/5 text-[10px] font-bold uppercase tracking-wider text-black/60">
                Gemma 4.0 Pro
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight leading-[1.1]" style={{ fontFamily: 'Manrope, sans-serif' }}>
              Elevate your <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2A2529] to-[#5A5559]">learning flow.</span>
            </h1>
            <p className="text-[0.95rem] md:text-lg leading-relaxed max-w-xl font-medium" style={{ color: 'var(--text-muted)' }}>
              Welcome back. Your personalized AI OS is ready to help you master any subject. 
              Which tool will you leverage today?
            </p>
          </div>

          {/* Quick actions */}
          <div className="grid grid-cols-3 gap-4 shrink-0">
            <QuickAction icon={Brain}    label="Coach"    path="/ai-coach"      color="#2A2529" />
            <QuickAction icon={Timer}    label="Focus"    path="/focus-timer"   color="#B45309" />
            <QuickAction icon={BookOpen} label="Plan"     path="/planner"       color="#4A6094" />
          </div>
        </div>
      </motion.div>

      {/* ── Stats row ────────────────────────────── */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-2">
          <h2 className="text-[0.8rem] uppercase tracking-[0.2em] font-black text-[var(--text-faint)]">
            Productivity Metrics
          </h2>
        </div>
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {stats.map((s) => (
            <StatCard key={s.label} {...s} />
          ))}
        </motion.div>
      </div>

      {/* ── Feature cards ────────────────────────── */}
      <div className="space-y-6">
        <div className="flex items-center justify-between px-2">
          <div>
            <h2 className="text-[0.8rem] uppercase tracking-[0.2em] font-black text-[var(--text-faint)]">
              Intelligent Tools
            </h2>
          </div>
          <div
            className="flex items-center gap-2 text-xs font-bold px-3 py-1.5 rounded-full bg-white border border-[var(--border)] shadow-sm"
            style={{ color: 'var(--text-primary)' }}
          >
            <Zap size={14} fill="currentColor" />
            6 POWERED BY GEMMA
          </div>
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6"
        >
          {FEATURES.map((f) => (
            <FeatureCard key={f.path} {...f} />
          ))}
        </motion.div>
      </div>

      {/* ── Getting started tip ──────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="rounded-[24px] p-6 flex flex-col md:flex-row items-center gap-6"
        style={{
          background: 'white',
          border: '1px solid var(--border)',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-inner"
          style={{ background: 'var(--bg-primary)' }}
        >
          <Zap size={24} className="text-[#2A2529]" fill="#2A2529" />
        </div>
        <div className="text-center md:text-left">
          <p className="text-sm font-black uppercase tracking-widest mb-1" style={{ color: 'var(--text-primary)' }}>
            Pro Strategy
          </p>
          <p className="text-[0.9rem] leading-relaxed max-w-2xl" style={{ color: 'var(--text-muted)' }}>
            Combine the <strong className="text-[var(--text-primary)]">PDF Summarizer</strong> with the <strong className="text-[var(--text-primary)]">AI Coach</strong>. 
            Upload your syllabus, get a summary, and then ask the Coach to test you on the key concepts.
          </p>
        </div>
        <button className="md:ml-auto px-6 py-3 rounded-xl bg-[var(--text-primary)] text-white text-[0.8rem] font-bold uppercase tracking-widest hover:scale-105 transition-transform active:scale-95 shadow-lg shadow-black/10">
          Try it now
        </button>
      </motion.div>

    </div>
  )
}
