import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Target, Cpu, BarChart3 } from 'lucide-react'

const STEPS = [
  {
    number: '01',
    icon: Target,
    title: 'Set Your Goal',
    description:
      'Tell FocusFlow what you want to learn — "master React in 4 weeks," "crack FAANG interviews," or "summarize this 80-page research paper."',
    color: '#A78BFA',
    detail: ['Enter your goal', 'Set a timeline', 'Choose your level'],
  },
  {
    number: '02',
    icon: Cpu,
    title: 'Gemma 4 Gets to Work',
    description:
      'Our OpenRouter-powered Gemma 4 integration analyzes your input and generates structured, actionable output — roadmaps, summaries, or explanations.',
    color: '#60A5FA',
    detail: ['Gemma 4 processes your input', 'Structured JSON output', 'Real-time generation'],
  },
  {
    number: '03',
    icon: BarChart3,
    title: 'Track & Stay Consistent',
    description:
      'Use the Focus Timer for deep work sessions, track your daily streak, and view your productivity analytics to stay on course.',
    color: '#34D399',
    detail: ['Pomodoro sessions', 'Daily streak tracker', 'Analytics dashboard'],
  },
]

function StepCard({ step, index }) {
  const { number, icon: Icon, title, description, color, detail } = step
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.15, ease: [0.22, 1, 0.36, 1] }}
      className="relative flex flex-col gap-6"
    >
      {/* Connector line (not on last) */}
      {index < STEPS.length - 1 && (
        <div
          className="hidden lg:block absolute top-10 left-[calc(100%+0px)] w-full h-px"
          style={{
            background: `linear-gradient(90deg, ${color}50, transparent)`,
            zIndex: 0,
          }}
        />
      )}

      {/* Step number + icon */}
      <div className="flex items-center gap-4">
        <div className="relative">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center"
            style={{
              background: `${color}15`,
              border: `1px solid ${color}30`,
              boxShadow: `0 0 30px ${color}20`,
            }}
          >
            <Icon size={24} style={{ color }} />
          </div>
          <div
            className="absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-black "
            style={{
              background: 'var(--bg-primary)',
              border: `1px solid ${color}50`,
              color,
              fontFamily: 'Poppins, sans-serif',
            }}
          >
            {index + 1}
          </div>
        </div>

        <div
          className="hidden lg:block font-black text-6xl leading-none select-none"
          style={{ color: `${color}50`, fontFamily: 'Poppins, sans-serif' }}
        >
          {number}
        </div>
      </div>

      {/* Content */}
      <div>
        <h3
          className="text-xl font-bold mb-3"
          style={{ fontFamily: 'Poppins, sans-serif' }}
        >
          {title}
        </h3>
        <p className="text-sm leading-relaxed mb-4" >
          {description}
        </p>

        {/* Detail checklist */}
        <div className="flex flex-col gap-2">
          {detail.map((d) => (
            <div key={d} className="flex items-center gap-2">
              <div
                className="w-4 h-4 rounded-full flex items-center justify-center shrink-0"
                style={{ background: `${color}20` }}
              >
                <div className="w-1.5 h-1.5 rounded-full" style={{ background: color }} />
              </div>
              <span className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>
                {d}
              </span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

export default function HowItWorksSection() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })

  return (
    <section id="how-it-works" className="py-24 px-4 relative">
      {/* Section bg */}
     

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold mb-6"
            style={{
              background: 'rgba(139,92,246,0.1)',
              border: '1px solid rgba(139,92,246,0.25)',
              color: '#A78BFA',
            }}
          >
            ✦ Simple workflow
          </div>
          <h2
            className="text-4xl md:text-5xl font-black mb-5"
            style={{ fontFamily: 'Poppins, sans-serif' }}
          >
            How{' '}
            <span className="gradient-text">FocusFlow</span>{' '}
            Works
          </h2>
          <p className="text-lg max-w-xl mx-auto" style={{ color: 'var(--text-muted)' }}>
            Three steps to go from scattered to structured — powered entirely by
            Gemma 4 under the hood.
          </p>
        </motion.div>

        {/* Steps grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-16">
          {STEPS.map((step, i) => (
            <StepCard key={step.number} step={step} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
