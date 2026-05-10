import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const STATS = [
  { value: '6',    label: 'AI-Powered Tools',  suffix: '',   color: '#A78BFA', desc: 'Built for real use cases' },
  { value: '128K', label: 'Context Window',    suffix: '+',  color: '#60A5FA', desc: 'Long-form document support' },
  { value: '3',    label: 'Core Workflows',    suffix: 's',  color: '#34D399', desc: 'Plan · Focus · Analyze' },
  { value: '100',  label: 'Open Source',       suffix: '%',  color: '#FBBF24', desc: 'Fork, extend, deploy' },
]

export default function StatsSection() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section id="tools" className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div
          ref={ref}
          className="relative rounded-3xl p-8 md:p-12 overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, rgba(139,92,246,0.1) 0%, rgba(59,130,246,0.07) 50%, rgba(20,184,166,0.06) 100%)',
            border: '1px solid rgba(139,92,246,0.2)',
          }}
        >
          {/* BG decoration */}
          <div className="orb orb-purple absolute" style={{ width: 300, height: 300, top: -120, right: -80 }} />
          <div className="orb orb-teal absolute"   style={{ width: 200, height: 200, bottom: -100, left: 50 }} />

          <div className="relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5 }}
              className="text-center mb-12"
            >
              <h2
                className="text-3xl md:text-4xl font-black mb-3"
                style={{ fontFamily: 'Poppins, sans-serif' }}
              >
                Built for{' '}
                <span className="gradient-text">real productivity</span>
              </h2>
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                No fluff, no bloat — just focused tools that deliver results.
              </p>
            </motion.div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
              {STATS.map(({ value, label, suffix, color, desc }, i) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, y: 24 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="text-center flex flex-col items-center gap-2"
                >
                  <div
                    className="text-4xl md:text-5xl font-black"
                    style={{
                      fontFamily: 'Poppins, sans-serif',
                      color,
                      textShadow: `0 0 30px ${color}60`,
                    }}
                  >
                    {value}
                    <span className="text-2xl">{suffix}</span>
                  </div>
                  <div className="text-sm font-bold">{label}</div>
                  <div className="text-xs" style={{ color: 'var(--text-faint)' }}>{desc}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
