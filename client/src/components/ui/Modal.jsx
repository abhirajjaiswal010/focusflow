import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'

const SIZES = {
  sm:   'max-w-sm',
  md:   'max-w-md',
  lg:   'max-w-lg',
  xl:   'max-w-2xl',
  full: 'max-w-5xl',
}

export default function Modal({
  open,
  onClose,
  title,
  subtitle,
  children,
  size = 'md',
  showClose = true,
  footer,
  className = '',
}) {
  // Close on Escape
  useEffect(() => {
    if (!open) return
    const handler = (e) => { if (e.key === 'Escape') onClose?.() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open, onClose])

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          onClick={(e) => { if (e.target === e.currentTarget) onClose?.() }}
        >
          <motion.div
            className={`w-full ${SIZES[size] || SIZES.md} ${className}`}
            initial={{ opacity: 0, scale: 0.93, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 8 }}
            transition={{ type: 'spring', stiffness: 350, damping: 28 }}
          >
            <div
              className="card p-6 w-full"
              style={{
                maxHeight: '90vh',
                overflowY: 'auto',
                background: 'var(--bg-elevated)',
                border: '1px solid rgba(255,255,255,0.1)',
              }}
            >
              {/* Header */}
              {(title || showClose) && (
                <div className="flex items-start justify-between mb-5">
                  <div>
                    {title && (
                      <h2 className="text-lg font-bold" style={{ fontFamily: 'Poppins, sans-serif' }}>
                        {title}
                      </h2>
                    )}
                    {subtitle && (
                      <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
                        {subtitle}
                      </p>
                    )}
                  </div>
                  {showClose && (
                    <button
                      onClick={onClose}
                      className="p-1.5 rounded-lg transition-colors ml-4 shrink-0"
                      style={{ color: 'var(--text-faint)' }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.07)' }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>
              )}

              {/* Body */}
              <div>{children}</div>

              {/* Footer */}
              {footer && (
                <div className="mt-5 pt-4 flex items-center justify-end gap-3 divider">
                  {footer}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
