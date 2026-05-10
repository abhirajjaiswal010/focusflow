import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Map, Sparkles, ChevronDown, ChevronUp,
  Clock, Target, BookOpen, RefreshCw,
  Copy, Check, AlertCircle, Zap,
} from 'lucide-react'
import { useAI } from '../hooks/useAI'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import Badge from '../components/ui/Badge'
import Skeleton from '../components/ui/Skeleton'

/* ── Constants ───────────────────────────────────── */
const LEVELS = [
  { value: 'beginner',     label: 'Beginner',      desc: 'New to this topic' },
  { value: 'intermediate', label: 'Intermediate',  desc: 'Some experience' },
  { value: 'advanced',     label: 'Advanced',      desc: 'Building on solid base' },
]

const DIFFICULTY_COLORS = {
  beginner:     { color: '#34D399', variant: 'success'  },
  intermediate: { color: '#FBBF24', variant: 'warning'  },
  advanced:     { color: '#F472B6', variant: 'pink'     },
}

const WEEK_COLORS = [
  '#A78BFA', '#60A5FA', '#34D399', '#FBBF24',
  '#F472B6', '#2DD4BF', '#FB923C', '#E879F9',
]

/* ── Loading Skeleton ────────────────────────────── */
function PlannerSkeleton() {
  return (
    <div className="space-y-4">
      {/* Overview card */}
      <div className="card p-5 space-y-3">
        <Skeleton width="40%" height={20} />
        <Skeleton.Text lines={2} />
      </div>
      {/* Week cards */}
      {[1, 2, 3].map((i) => (
        <div key={i} className="card p-5 space-y-3">
          <div className="flex items-center gap-3">
            <Skeleton width={48} height={48} rounded="lg" />
            <div className="flex-1 space-y-2">
              <Skeleton width="50%" height={16} />
              <Skeleton width="30%" height={12} />
            </div>
          </div>
          <Skeleton.Text lines={3} />
        </div>
      ))}
    </div>
  )
}

/* ── Week Card ───────────────────────────────────── */
function WeekCard({ week, index }) {
  const [open, setOpen] = useState(index === 0)
  const color  = WEEK_COLORS[index % WEEK_COLORS.length]
  const diff   = DIFFICULTY_COLORS[week.difficulty] || DIFFICULTY_COLORS.intermediate

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
      className="card overflow-hidden transition-all duration-500"
      style={{ borderColor: open ? `${color}40` : 'var(--border)', boxShadow: open ? 'var(--shadow-lg)' : 'var(--shadow-sm)' }}
    >
      {/* Header — always visible */}
      <button
        className="w-full flex items-center gap-6 p-6 text-left group"
        onClick={() => setOpen(!open)}
      >
        {/* Week number badge */}
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 font-black text-xl shadow-inner"
          style={{
            background: `${color}10`,
            border: `1px solid ${color}20`,
            color,
            fontFamily: 'Manrope, sans-serif',
          }}
        >
          {week.week}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 flex-wrap">
            <h3
              className="font-extrabold text-lg leading-tight tracking-tight"
              style={{ fontFamily: 'Manrope, sans-serif' }}
            >
              {week.title}
            </h3>
            <Badge variant={diff.variant} size="xs" weight="bold" uppercase>{week.difficulty}</Badge>
          </div>
          <div className="flex items-center gap-4 mt-2">
            <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-faint)' }}>
              <BookOpen size={13} />
              {week.topics?.length || 0} Topics
            </span>
            {week.estimatedHours && (
              <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-faint)' }}>
                <Clock size={13} />
                {week.estimatedHours} Hours
              </span>
            )}
          </div>
        </div>

        <div style={{ color: 'var(--text-faint)', transform: open ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.3s' }}>
          <ChevronDown size={20} strokeWidth={2.5} />
        </div>
      </button>

      {/* Expandable body */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div
              className="px-6 pb-8 space-y-6"
              style={{ borderTop: `1px solid var(--border)` }}
            >
              {/* Goal */}
              {week.goal && (
                <div
                  className="mt-6 p-5 rounded-2xl flex items-start gap-4"
                  style={{ background: `${color}08`, border: `1px solid ${color}15` }}
                >
                  <Target size={18} style={{ color, marginTop: 2 }} />
                  <div>
                    <p className="text-[0.65rem] font-black uppercase tracking-[0.2em] mb-2" style={{ color }}>
                      Weekly Objective
                    </p>
                    <p className="text-[0.92rem] leading-relaxed font-medium" style={{ color: 'var(--text-primary)' }}>
                      {week.goal}
                    </p>
                  </div>
                </div>
              )}

              <div className="grid sm:grid-cols-2 gap-8">
                {/* Topics */}
                {week.topics?.length > 0 && (
                  <div>
                    <p
                      className="text-[0.65rem] font-black uppercase tracking-[0.2em] mb-4"
                      style={{ color: 'var(--text-faint)' }}
                    >
                      Curriculum
                    </p>
                    <ul className="space-y-3">
                      {week.topics.map((t, i) => (
                        <li key={i} className="flex items-start gap-3 group">
                          <div
                            className="w-2 h-2 rounded-full mt-1.5 shrink-0 transition-transform group-hover:scale-125"
                            style={{ background: color }}
                          />
                          <span className="text-[0.9rem] font-medium" style={{ color: 'var(--text-muted)' }}>{t}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Resources */}
                {week.resources?.length > 0 && (
                  <div>
                    <p
                      className="text-[0.65rem] font-black uppercase tracking-[0.2em] mb-4"
                      style={{ color: 'var(--text-faint)' }}
                    >
                      Learning Assets
                    </p>
                    <ul className="space-y-3">
                      {week.resources.map((r, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <div className="w-5 h-5 rounded-lg flex items-center justify-center shrink-0" style={{ background: 'var(--bg-primary)' }}>
                            <BookOpen
                              size={12}
                              style={{ color: 'var(--text-faint)' }}
                            />
                          </div>
                          <span className="text-[0.9rem] font-medium" style={{ color: 'var(--text-muted)' }}>{r}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

/* ── Roadmap Result ──────────────────────────────── */
function RoadmapResult({ data, onRegenerate, regenerating }) {
  const [copied, setCopied] = useState(false)

  const copyRoadmap = () => {
    const text = data.roadmap
      .map((w) => `Week ${w.week}: ${w.title}\nTopics: ${w.topics?.join(', ')}\nGoal: ${w.goal}`)
      .join('\n\n')
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-5">
      {/* Header row */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-start justify-between gap-4 flex-wrap"
      >
        <div>
          <h2
            className="text-xl font-bold"
            style={{ fontFamily: 'Poppins, sans-serif' }}
          >
            {data.title}
          </h2>
          {data.overview && (
            <p className="text-sm mt-1 max-w-2xl" style={{ color: 'var(--text-muted)' }}>
              {data.overview}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Button
            variant="ghost"
            size="sm"
            icon={copied ? Check : Copy}
            onClick={copyRoadmap}
          >
            {copied ? 'Copied!' : 'Copy'}
          </Button>
          <Button
            variant="secondary"
            size="sm"
            icon={RefreshCw}
            loading={regenerating}
            onClick={onRegenerate}
          >
            Regenerate
          </Button>
        </div>
      </motion.div>

      {/* Stats row */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="flex flex-wrap gap-3"
      >
        {[
          { label: 'Weeks',    value: data.weekCount,  icon: Map,    color: '#A78BFA' },
          { label: 'Level',    value: data.level,      icon: Target, color: '#60A5FA' },
          { label: 'Timeline', value: data.timeline,   icon: Clock,  color: '#34D399' },
        ].map(({ label, value, icon: Icon, color }) => (
          <div
            key={label}
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm"
            style={{
              background: `${color}10`,
              border: `1px solid ${color}25`,
              color,
            }}
          >
            <Icon size={13} />
            <span className="font-semibold">{label}:</span>
            <span className="capitalize">{value}</span>
          </div>
        ))}
      </motion.div>

      {/* Week cards */}
      <div className="space-y-3">
        {data.roadmap.map((week, i) => (
          <WeekCard key={week.week} week={week} index={i} />
        ))}
      </div>
    </div>
  )
}

/* ── Main Page ───────────────────────────────────── */
export default function StudyPlanner() {
  const [goal,     setGoal]     = useState('')
  const [timeline, setTimeline] = useState('')
  const [level,    setLevel]    = useState('intermediate')
  const [focus,    setFocus]    = useState('')
  const [result,   setResult]   = useState(null)

  const { call, loading, error } = useAI('/api/planner/generate', {
    onSuccess: (data) => setResult(data),
  })

  const handleGenerate = () => {
    if (!goal.trim() || !timeline.trim()) return
    setResult(null)
    call({ goal, timeline, level, focus })
  }

  const handleRegenerate = () => {
    setResult(null)
    call({ goal, timeline, level, focus })
  }

  const isReady = goal.trim() && timeline.trim()

  return (
    <div className="max-w-5xl mx-auto space-y-6">

      {/* ── Input Panel ──────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="card p-6"
      >
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div
            className="w-10 h-10 rounded-2xl flex items-center justify-center"
            style={{ background: 'rgba(139,92,246,0.15)', border: '1px solid rgba(139,92,246,0.3)' }}
          >
            <Map size={18} style={{ color: '#A78BFA' }} />
          </div>
          <div>
            <h2 className="font-bold text-base" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Generate Your Roadmap
            </h2>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
              Tell Gemma 4 your goal — get a structured week-by-week plan
            </p>
          </div>
          <div className="ml-auto">
            <Badge variant="purple" size="sm" icon={Sparkles}>Gemma 4</Badge>
          </div>
        </div>

        {/* Form grid */}
        <div className="grid sm:grid-cols-2 gap-4 mb-4">
          <Input
            label="What do you want to learn?"
            placeholder="e.g. Learn React from scratch, Master DSA for interviews"
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            icon={Target}
            containerClassName="sm:col-span-2"
          />
          <Input
            label="Timeline"
            placeholder="e.g. 4 weeks, 2 months, 60 days"
            value={timeline}
            onChange={(e) => setTimeline(e.target.value)}
            icon={Clock}
          />
          <Input
            label="Focus areas (optional)"
            placeholder="e.g. JavaScript, LeetCode, System Design"
            value={focus}
            onChange={(e) => setFocus(e.target.value)}
            icon={BookOpen}
          />
        </div>

        {/* Level selector */}
        <div className="mb-5">
          <p className="text-sm font-medium mb-2" style={{ color: 'var(--text-muted)' }}>
            Experience Level
          </p>
          <div className="grid grid-cols-3 gap-2">
            {LEVELS.map(({ value, label, desc }) => {
              const isSelected = level === value
              return (
                <button
                  key={value}
                  onClick={() => setLevel(value)}
                  className="flex flex-col items-center gap-1 p-3 rounded-xl text-center transition-all"
                  style={{
                    background: isSelected ? 'rgba(139,92,246,0.12)' : 'var(--bg-elevated)',
                    border: `1px solid ${isSelected ? 'rgba(139,92,246,0.4)' : 'var(--border)'}`,
                    color: isSelected ? '#C4B5FD' : 'var(--text-muted)',
                  }}
                >
                  <span className="text-sm font-semibold">{label}</span>
                  <span className="text-xs" style={{ color: 'var(--text-faint)' }}>{desc}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Error */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mb-4 p-3 rounded-xl flex items-start gap-3"
              style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}
            >
              <AlertCircle size={16} style={{ color: '#F87171', marginTop: 1 }} />
              <div>
                <p className="text-sm font-semibold" style={{ color: '#F87171' }}>
                  Generation failed
                </p>
                <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{error}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Generate button */}
        <Button
          variant="primary"
          size="lg"
          icon={Zap}
          loading={loading}
          disabled={!isReady}
          onClick={handleGenerate}
          fullWidth
        >
          {loading ? 'Gemma 4 is building your roadmap…' : 'Generate Roadmap'}
        </Button>

        {!isReady && (
          <p className="text-xs text-center mt-2" style={{ color: 'var(--text-faint)' }}>
            Enter a goal and timeline to continue
          </p>
        )}
      </motion.div>

      {/* ── Result Panel ─────────────────────────── */}
      <AnimatePresence mode="wait">
        {loading && !result && (
          <motion.div
            key="skeleton"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* AI "thinking" label */}
            <div
              className="flex items-center gap-2 mb-4 px-4 py-3 rounded-xl"
              style={{ background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.2)' }}
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
              >
                <Sparkles size={14} style={{ color: '#A78BFA' }} />
              </motion.div>
              <span className="text-sm font-medium" style={{ color: '#A78BFA' }}>
                Gemma 4 is crafting your personalised roadmap…
              </span>
              <div className="ml-auto flex gap-1">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ background: '#A78BFA' }}
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1, delay: i * 0.2, repeat: Infinity }}
                  />
                ))}
              </div>
            </div>
            <PlannerSkeleton />
          </motion.div>
        )}

        {result && !loading && (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <RoadmapResult
              data={result}
              onRegenerate={handleRegenerate}
              regenerating={loading}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Empty state */}
      {!loading && !result && !error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16 flex flex-col items-center gap-4"
        >
          <div
            className="w-20 h-20 rounded-3xl flex items-center justify-center"
            style={{ background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.15)' }}
          >
            <Map size={36} style={{ color: '#A78BFA', opacity: 0.5 }} />
          </div>
          <div>
            <p className="text-base font-semibold" style={{ color: 'var(--text-muted)' }}>
              Your roadmap will appear here
            </p>
            <p className="text-sm mt-1" style={{ color: 'var(--text-faint)' }}>
              Fill in the form above and click Generate
            </p>
          </div>
        </motion.div>
      )}
    </div>
  )
}
