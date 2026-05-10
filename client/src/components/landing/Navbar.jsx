import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Zap, Menu, X } from 'lucide-react'

const NAV_LINKS = [
  { label: 'Features',   href: '#features'    },
  { label: 'How it works', href: '#how-it-works' },
  { label: 'Tools',      href: '#tools'       },
  { label: 'Stack',      href: '#stack'       },
]

export default function Navbar() {
  const [scrolled, setScrolled]   = useState(false)
  const [menuOpen, setMenuOpen]   = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 30)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  const scrollTo = (href) => {
    setMenuOpen(false)
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <motion.header
      initial={{ y: -64, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
      className="fixed top-0 left-0 right-0 z-50 px-4"
      style={{ paddingTop: '12px' }}
    >
      <div
        className="max-w-6xl mx-auto rounded-2xl px-5 py-3 flex items-center gap-6 transition-all duration-300 "
        style={{
          background: scrolled ? 'rgba(11,15,25,0.92)' : 'rgba(11,15,25,0.6)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: `1px solid ${scrolled ? 'rgba(139,92,246,0.2)' : 'rgba(255,255,255,0.06)'}`,
          boxShadow: scrolled ? '0 8px 40px rgba(0,0,0,0.4)' : 'none',
        }}
      >
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 shrink-0">
          <div className="w-8 h-8 rounded-xl gradient-bg flex items-center justify-center">
            <Zap size={15} color="#fff" />
          </div>
          <span className="font-bold text-sm text-white" style={{ fontFamily: 'Poppins, sans-serif' }}>
            FocusFlow <span className="text-white">AI</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex justify-center gap-1 flex-1">
          {NAV_LINKS.map(({ label, href }) => (
            <button
              key={href}
              onClick={() => scrollTo(href)}
              className="px-3 py-1.5 rounded-lg text-sm font-medium transition-colors text-white "
              
              onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--text-primary)'; e.currentTarget.style.background = 'rgba(255,255,255,0.05)' }}
              onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.background = 'transparent' }}
            >
              {label}
            </button>
          ))}
        </nav>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-3 ml-auto">
          <Link to="/dashboard">
            <button
              className="text-sm font-medium px-3 py-1.5 rounded-lg transition-colors text-white"
              
              onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text-primary)'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
            >
              Sign in
            </button>
          </Link>
          <Link to="/dashboard">
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className="gradient-bg text-white text-sm font-semibold px-4 py-1.5 rounded-xl"
            >
              Get Started →
            </motion.button>
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden ml-auto p-2 rounded-lg"
          style={{ color: 'var(--text-muted)' }}
        >
          {menuOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="max-w-6xl mx-auto mt-2 rounded-2xl p-4 flex flex-col gap-1"
            style={{
              background: 'rgba(17,24,39,0.97)',
              border: '1px solid rgba(139,92,246,0.2)',
              backdropFilter: 'blur(20px)',
            }}
          >
            {NAV_LINKS.map(({ label, href }) => (
              <button
                key={href}
                onClick={() => scrollTo(href)}
                className="text-left px-4 py-3 rounded-xl text-sm font-medium transition-colors"
                style={{ color: 'var(--text-muted)' }}
              >
                {label}
              </button>
            ))}
            <div className="divider my-1" />
            <Link to="/dashboard" onClick={() => setMenuOpen(false)}>
              <button className="w-full gradient-bg text-white text-sm font-semibold px-4 py-3 rounded-xl">
                Launch App →
              </button>
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
