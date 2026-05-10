import { motion } from 'framer-motion'
import { Zap } from 'lucide-react'

export default function PageLoader() {
  return (
    <div
      className="flex items-center justify-center min-h-screen flex-col gap-4"
      style={{ background: 'var(--bg-primary)' }}
    >
      <motion.div
        animate={{ scale: [1, 1.15, 1], opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        className="w-14 h-14 rounded-2xl gradient-bg flex items-center justify-center"
      >
        <Zap size={28} color="#fff" />
      </motion.div>
      <p className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>
        Loading FocusFlow…
      </p>
    </div>
  )
}
