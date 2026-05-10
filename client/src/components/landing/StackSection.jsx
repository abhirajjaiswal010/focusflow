import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const STACK = [
  { name: 'Gemma 4',       category: 'AI Model',    color: '#A78BFA', emoji: '🧠' },
  { name: 'OpenRouter',    category: 'AI Gateway',  color: '#60A5FA', emoji: '🔀' },
  { name: 'React',         category: 'Frontend',    color: '#61DAFB', emoji: '⚛️' },
  { name: 'Vite',          category: 'Build Tool',  color: '#FBBF24', emoji: '⚡' },
  { name: 'Tailwind CSS',  category: 'Styling',     color: '#2DD4BF', emoji: '🎨' },
  { name: 'Framer Motion', category: 'Animations',  color: '#F472B6', emoji: '✨' },
  { name: 'Express.js',    category: 'Backend',     color: '#34D399', emoji: '🚀' },
  { name: 'MongoDB',       category: 'Database',    color: '#4DB33D', emoji: '🗄️' },
  { name: 'Recharts',      category: 'Charts',      color: '#FB923C', emoji: '📊' },
  { name: 'Lucide React',  category: 'Icons',       color: '#C084FC', emoji: '🎯' },
]

export default function StackSection() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <section id="stack" className="py-24 px-4 relative overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold mb-6"
            style={{
              background: 'rgba(20,184,166,0.1)',
              border: '1px solid rgba(20,184,166,0.25)',
              color: '#2DD4BF',
            }}
          >
            ✦ Tech Stack
          </div>
          <h2
            className="text-4xl md:text-5xl font-black mb-5"
            style={{ fontFamily: 'Poppins, sans-serif' }}
          >
            Powered by the{' '}
            <span className="gradient-text">best tools</span>
          </h2>
          <p className="text-lg max-w-xl mx-auto" style={{ color: 'var(--text-muted)' }}>
            Modern, fast, and production-ready. Every piece of this stack was chosen
            for speed, developer experience, and scale.
          </p>
        </motion.div>

        {/* Stack grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {STACK.map(({ name, category, color, emoji }, i) => (
            <motion.div
              key={name}
              initial={{ opacity: 0, scale: 0.88 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.4, delay: i * 0.06, ease: 'backOut' }}
              whileHover={{ y: -4, borderColor: `${color}50` }}
              className="flex flex-col items-center gap-2 p-4 rounded-2xl text-center cursor-default"
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
                transition: 'border-color 0.2s, box-shadow 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = `0 8px 30px rgba(0,0,0,0.3), 0 0 20px ${color}20`
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = 'none'
              }}
            >
              <span className="text-2xl">{emoji}</span>
              <div>
                <div className="text-sm font-bold leading-tight">{name}</div>
                <div className="text-xs mt-0.5" style={{ color }}>{category}</div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Gemma highlight */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="mt-10 rounded-2xl p-6 flex flex-col md:flex-row items-center gap-6"
          style={{
            background: 'linear-gradient(135deg, rgba(139,92,246,0.12), rgba(59,130,246,0.08))',
            border: '1px solid rgba(139,92,246,0.25)',
          }}
        >
          <div className="text-4xl">🧠</div>
          <div className="text-center md:text-left">
            <h3 className="font-bold text-lg mb-1" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Gemma 4 is the core intelligence
            </h3>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
              Every AI feature — study plans, PDF summaries, DSA explanations, and coaching —
              runs through Google DeepMind's{' '}
              <span style={{ color: '#A78BFA', fontWeight: 600 }}>Gemma 4 27B model</span>{' '}
              via OpenRouter, with structured JSON outputs for rich UI rendering.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
