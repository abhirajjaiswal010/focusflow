import { motion } from 'framer-motion'

export default function Card({
  children,
  className = '',
  hover = true,
  glow = false,
  elevated = false,
  padding = 'p-6',
  onClick,
  style,
}) {
  return (
    <motion.div
      onClick={onClick}
      whileHover={hover ? { y: -4, borderColor: 'var(--border-accent)' } : {}}
      transition={{ type: 'spring', stiffness: 350, damping: 25 }}
      className={[
        elevated ? 'card-elevated' : 'card',
        hover ? 'card-hover' : '',
        glow ? 'glow-purple' : '',
        onClick ? 'cursor-pointer' : '',
        padding,
        className,
      ].join(' ')}
      style={style}
    >
      {children}
    </motion.div>
  )
}

/* Sub-components for composition */
Card.Header = function CardHeader({ children, className = '' }) {
  return (
    <div className={`mb-5 ${className}`}>
      {children}
    </div>
  )
}

Card.Title = function CardTitle({ children, className = '' }) {
  return (
    <h3 className={`text-lg font-extrabold leading-tight tracking-tight ${className}`} style={{ fontFamily: 'Manrope, sans-serif' }}>
      {children}
    </h3>
  )
}

Card.Body = function CardBody({ children, className = '' }) {
  return <div className={`text-[0.92rem] leading-relaxed ${className}`}>{children}</div>
}

Card.Footer = function CardFooter({ children, className = '' }) {
  return (
    <div className={`mt-5 pt-5 border-t border-[var(--border)] ${className}`}>
      {children}
    </div>
  )
}
