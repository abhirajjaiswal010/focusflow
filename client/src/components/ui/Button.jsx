import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'

const VARIANTS = {
  primary: {
    base: 'text-white font-bold uppercase tracking-widest',
    style: { background: 'var(--accent-1)', border: '1px solid var(--accent-1)', boxShadow: '0 4px 12px rgba(42, 37, 41, 0.15)' },
    hover: { scale: 1.02, boxShadow: '0 8px 20px rgba(42, 37, 41, 0.25)' },
  },
  secondary: {
    base: 'text-[var(--text-primary)] font-bold uppercase tracking-widest',
    style: { background: 'white', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' },
    hover: { scale: 1.02, borderColor: 'var(--border-accent)', boxShadow: 'var(--shadow-card)' },
  },
  ghost: {
    base: 'font-bold uppercase tracking-widest',
    style: { color: 'var(--text-muted)', background: 'transparent' },
    hover: { background: 'rgba(42, 37, 41, 0.05)', color: 'var(--text-primary)' },
  },
  outline: {
    base: 'font-bold uppercase tracking-widest',
    style: {
      color: 'var(--accent-1)',
      background: 'transparent',
      border: '2px solid var(--accent-1)',
    },
    hover: { background: 'rgba(42, 37, 41, 0.04)' },
  },
  danger: {
    base: 'text-white font-bold uppercase tracking-widest',
    style: { background: '#E38484', border: '1px solid #E38484', boxShadow: '0 4px 12px rgba(227, 132, 132, 0.2)' },
    hover: { opacity: 0.9, scale: 1.02 },
  },
}

const SIZES = {
  xs: 'px-3 py-1.5 text-[0.65rem] rounded-lg',
  sm: 'px-4 py-2.5 text-[0.7rem] rounded-xl',
  md: 'px-6 py-3.5 text-[0.75rem] rounded-2xl',
  lg: 'px-8 py-4.5 text-[0.8rem] rounded-2xl',
  xl: 'px-10 py-5 text-[0.9rem] rounded-[24px]',
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon: Icon,
  iconRight: IconRight,
  fullWidth = false,
  onClick,
  type = 'button',
  className = '',
  ...props
}) {
  const v = VARIANTS[variant] || VARIANTS.primary
  const isDisabled = disabled || loading

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      whileHover={isDisabled ? {} : v.hover}
      whileTap={isDisabled ? {} : { scale: 0.96 }}
      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      className={[
        'inline-flex items-center justify-center gap-2.5 select-none',
        'transition-all duration-300 focus-ring',
        SIZES[size],
        v.base,
        fullWidth ? 'w-full' : '',
        isDisabled ? 'opacity-40 cursor-not-allowed grayscale' : '',
        className,
      ].join(' ')}
      style={{ ...v.style, fontFamily: 'Manrope, sans-serif' }}
      {...props}
    >
      {loading ? (
        <Loader2 size={16} className="animate-spin" />
      ) : Icon ? (
        <Icon size={16} strokeWidth={2.5} />
      ) : null}
      <span className="leading-none">{children}</span>
      {IconRight && !loading && <IconRight size={16} strokeWidth={2.5} />}
    </motion.button>
  )
}
