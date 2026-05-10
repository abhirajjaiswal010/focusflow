import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useInView } from 'framer-motion'
import { ArrowRight, Zap } from 'lucide-react'

export default function CTASection() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <section className="py-24 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="relative rounded-3xl p-10 md:p-16 text-center overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, rgba(139,92,246,0.18) 0%, rgba(59,130,246,0.14) 50%, rgba(20,184,166,0.1) 100%)',
            border: '1px solid rgba(139,92,246,0.3)',
          }}
        >
          {/* BG orbs */}
          <div className="orb orb-purple absolute" style={{ width: 400, height: 400, top: -150, left: -100 }} />
          <div className="orb orb-blue absolute"   style={{ width: 350, height: 350, bottom: -150, right: -80 }} />

          {/* Dot grid */}
          <div
            className="absolute inset-0 opacity-10 pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.2) 1px, transparent 1px)',
              backgroundSize: '30px 30px',
            }}
          />

          <div className="relative z-10 flex flex-col items-center gap-6">
            {/* Icon */}
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              className="w-16 h-16 rounded-2xl gradient-bg flex items-center justify-center"
              style={{ boxShadow: '0 0 40px rgba(139,92,246,0.4)' }}
            >
              <Zap size={28} color="#fff" />
            </motion.div>

            <div>
              <h2
                className="text-4xl md:text-6xl font-black mb-4 leading-tight"
                style={{ fontFamily: 'Poppins, sans-serif' }}
              >
                Ready to{' '}
                <span className="gradient-text">level up?</span>
              </h2>
              <p className="text-lg md:text-xl max-w-lg mx-auto" style={{ color: 'var(--text-muted)' }}>
                Join thousands of students and developers using FocusFlow AI to
                study smarter, focus deeper, and ship faster.
              </p>
            </div>

            {/* CTA buttons */}
            <div className="flex flex-wrap gap-4 justify-center">
              <Link to="/dashboard">
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: '0 0 40px rgba(139,92,246,0.5)' }}
                  whileTap={{ scale: 0.97 }}
                  className="flex items-center gap-2 px-8 py-4 rounded-xl text-base font-bold text-white"
                  style={{ background: 'linear-gradient(135deg, #8B5CF6, #3B82F6)' }}
                >
                  Start for Free
                  <ArrowRight size={18} />
                </motion.button>
              </Link>
              <Link to="/dashboard">
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  className="flex items-center gap-2 px-8 py-4 rounded-xl text-base font-semibold"
                  style={{
                    background: 'rgba(255,255,255,0.07)',
                    border: '1px solid rgba(255,255,255,0.12)',
                    color: 'var(--text-primary)',
                  }}
                >
                  Explore Dashboard
                </motion.button>
              </Link>
            </div>

            {/* Fine print */}
            <p className="text-xs" style={{ color: 'var(--text-faint)' }}>
              Free forever · No credit card needed · Powered by Gemma 4
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
