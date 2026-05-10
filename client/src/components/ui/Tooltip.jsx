import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function Tooltip({ children, content, side = 'top', delay = 0 }) {
  const [visible, setVisible] = useState(false)

  const POSITIONS = {
    top:    { bottom: 'calc(100% + 8px)', left: '50%', transform: 'translateX(-50%)' },
    bottom: { top: 'calc(100% + 8px)',    left: '50%', transform: 'translateX(-50%)' },
    left:   { right: 'calc(100% + 8px)',  top: '50%',  transform: 'translateY(-50%)' },
    right:  { left: 'calc(100% + 8px)',   top: '50%',  transform: 'translateY(-50%)' },
  }

  const ANIM = {
    top:    { initial: { opacity: 0, y: 4  }, animate: { opacity: 1, y: 0  } },
    bottom: { initial: { opacity: 0, y: -4 }, animate: { opacity: 1, y: 0  } },
    left:   { initial: { opacity: 0, x: 4  }, animate: { opacity: 1, x: 0  } },
    right:  { initial: { opacity: 0, x: -4 }, animate: { opacity: 1, x: 0  } },
  }

  const pos = POSITIONS[side] || POSITIONS.top
  const anim = ANIM[side] || ANIM.top

  return (
    <div
      className="relative inline-flex"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      {children}
      <AnimatePresence>
        {visible && content && (
          <motion.div
            initial={anim.initial}
            animate={anim.animate}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.14, delay }}
            className="absolute z-50 pointer-events-none whitespace-nowrap"
            style={pos}
          >
            <div
              className="px-2.5 py-1.5 rounded-lg text-xs font-medium"
              style={{
                background: 'var(--bg-elevated)',
                border: '1px solid var(--border)',
                color: 'var(--text-primary)',
                boxShadow: 'var(--shadow-card)',
              }}
            >
              {content}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
