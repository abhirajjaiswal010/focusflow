const VARIANTS = {
  default:  { bg: 'rgba(255,255,255,0.07)', color: 'var(--text-muted)',   border: 'var(--border)' },
  purple:   { bg: 'rgba(139,92,246,0.12)',  color: '#A78BFA',             border: 'rgba(139,92,246,0.25)' },
  blue:     { bg: 'rgba(59,130,246,0.12)',  color: '#60A5FA',             border: 'rgba(59,130,246,0.25)' },
  teal:     { bg: 'rgba(20,184,166,0.12)',  color: '#2DD4BF',             border: 'rgba(20,184,166,0.25)' },
  success:  { bg: 'rgba(16,185,129,0.12)',  color: '#34D399',             border: 'rgba(16,185,129,0.25)' },
  warning:  { bg: 'rgba(245,158,11,0.12)',  color: '#FBBF24',             border: 'rgba(245,158,11,0.25)' },
  danger:   { bg: 'rgba(239,68,68,0.12)',   color: '#F87171',             border: 'rgba(239,68,68,0.25)' },
  pink:     { bg: 'rgba(244,114,182,0.12)', color: '#F472B6',             border: 'rgba(244,114,182,0.25)' },
}

const SIZES = {
  xs: { padding: '2px 8px',  fontSize: '0.7rem',  borderRadius: '6px' },
  sm: { padding: '3px 10px', fontSize: '0.75rem', borderRadius: '8px' },
  md: { padding: '4px 12px', fontSize: '0.8rem',  borderRadius: '8px' },
  lg: { padding: '6px 14px', fontSize: '0.875rem',borderRadius: '10px' },
}

export default function Badge({
  children,
  variant = 'default',
  size = 'sm',
  icon: Icon,
  dot = false,
  className = '',
}) {
  const v = VARIANTS[variant] || VARIANTS.default
  const s = SIZES[size] || SIZES.sm

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-semibold select-none ${className}`}
      style={{
        background: v.bg,
        color: v.color,
        border: `1px solid ${v.border}`,
        ...s,
      }}
    >
      {dot && (
        <span
          className="w-1.5 h-1.5 rounded-full shrink-0"
          style={{ background: v.color }}
        />
      )}
      {Icon && <Icon size={11} />}
      {children}
    </span>
  )
}
