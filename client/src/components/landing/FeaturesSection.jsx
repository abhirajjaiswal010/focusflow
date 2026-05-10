import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import {
  Map, FileText, Code2, Timer, BarChart3, MessageSquare,
} from 'lucide-react'

const FEATURES = [
  {
    icon: Map,
    title: 'AI Study Planner',
    description:
      'Tell Gemma your goal and timeline. Get a complete, week-by-week learning roadmap structured as beautiful cards — instantly.',
    badge: 'Roadmaps',
    color: '#A78BFA',
    glow: 'rgba(139,92,246,0.15)',
    tag: 'Most Popular',
  },
  {
    icon: FileText,
    title: 'PDF Summarizer',
    description:
      'Upload any PDF — textbook, paper, notes. Gemma extracts a clean summary, key bullet points, and revision notes in seconds.',
    badge: 'Documents',
    color: '#60A5FA',
    glow: 'rgba(59,130,246,0.12)',
  },
  {
    icon: Code2,
    title: 'DSA Problem Explainer',
    description:
      'Paste any coding problem or LeetCode link. Get the intuition, brute force, optimal approach, dry run, and common mistakes.',
    badge: 'Algorithms',
    color: '#F472B6',
    glow: 'rgba(244,114,182,0.12)',
    tag: 'For Devs',
  },
  {
    icon: Timer,
    title: 'Focus Timer',
    description:
      'Pomodoro-based deep work sessions. Track your daily streaks, celebrate consistency, and stay in flow with beautiful timers.',
    badge: 'Productivity',
    color: '#FBBF24',
    glow: 'rgba(245,158,11,0.1)',
  },
  {
    icon: BarChart3,
    title: 'Productivity Analytics',
    description:
      'See your study hours, session counts, and streak history in clean Recharts dashboards. Data-driven consistency.',
    badge: 'Insights',
    color: '#34D399',
    glow: 'rgba(16,185,129,0.1)',
  },
  {
    icon: MessageSquare,
    title: 'AI Coach',
    description:
      'Chat with a Gemma-powered productivity mentor. Get motivation, study strategies, and real-time guidance tailored to your goals.',
    badge: 'Coaching',
    color: '#2DD4BF',
    glow: 'rgba(20,184,166,0.1)',
    tag: 'Coming Soon',
  },
]

function FeatureCard({ feature, index }) {
  const { icon: Icon, title, description, badge, color, glow, tag } = feature
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay: (index % 3) * 0.1, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.div
        className="relative h-full rounded-2xl p-6 flex flex-col gap-4 group"
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          transition: 'border-color 0.2s, box-shadow 0.2s',
        }}
        whileHover={{
          y: -5,
          boxShadow: `0 16px 50px rgba(0,0,0,0.4), 0 0 40px ${glow}`,
          borderColor: `${color}40`,
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 28 }}
      >
        {/* Tag */}
        {tag && (
          <div
            className="absolute top-4 right-4 px-2.5 py-1 rounded-full text-xs font-bold"
            style={{
              background: `${color}18`,
              color,
              border: `1px solid ${color}30`,
            }}
          >
            {tag}
          </div>
        )}

        {/* Icon */}
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center"
          style={{
            background: `${color}15`,
            border: `1px solid ${color}28`,
            boxShadow: `0 0 20px ${glow}`,
          }}
        >
          <Icon size={22} style={{ color }} />
        </div>

        {/* Badge */}
        <div>
          <span
            className="text-xs font-bold uppercase tracking-widest"
            style={{ color }}
          >
            {badge}
          </span>
          <h3
            className="text-lg font-bold mt-1"
            style={{ fontFamily: 'Poppins, sans-serif' }}
          >
            {title}
          </h3>
        </div>

        {/* Description */}
        <p
          className="text-sm leading-relaxed flex-1"
          style={{ color: 'var(--text-muted)' }}
        >
          {description}
        </p>

        {/* Bottom accent line */}
        <div
          className="h-px w-0 group-hover:w-full transition-all duration-500 rounded-full"
          style={{ background: `linear-gradient(90deg, ${color}, transparent)` }}
        />
      </motion.div>
    </motion.div>
  )
}

export default function FeaturesSection() {
  const headerRef = useRef(null)
  const headerInView = useInView(headerRef, { once: true })

  return (
    <section id="features" className="py-24 px-4 relative overflow-hidden">
      {/* Subtle bg orb */}
      <div
        className="absolute inset-0 pointer-events-none opacity-40"
        style={{
          background: 'radial-gradient(ellipse 80% 60% at 50% 100%, rgba(139,92,246,0.08), transparent)',
        }}
      />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 24 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold mb-6"
            style={{
              background: 'rgba(59,130,246,0.1)',
              border: '1px solid rgba(59,130,246,0.2)',
              color: '#60A5FA',
            }}
          >
            ✦ Everything you need
          </div>
          <h2
            className="text-4xl md:text-5xl font-black mb-5"
            style={{ fontFamily: 'Poppins, sans-serif' }}
          >
            6 AI Tools.{' '}
            <span className="gradient-text">One Platform.</span>
          </h2>
          <p
            className="text-lg max-w-2xl mx-auto leading-relaxed"
            style={{ color: 'var(--text-muted)' }}
          >
            Every tool is deeply integrated with Gemma 4, purpose-built for
            students, developers, and self-learners who demand more from their
            productivity stack.
          </p>
        </motion.div>

        {/* 3-column grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((f, i) => (
            <FeatureCard key={f.title} feature={f} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
