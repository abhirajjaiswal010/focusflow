import { forwardRef } from 'react'

const Input = forwardRef(function Input({
  label,
  error,
  hint,
  icon: Icon,
  iconRight: IconRight,
  size = 'md',
  className = '',
  containerClassName = '',
  ...props
}, ref) {
  const PADDING = {
    sm: { input: Icon ? 'pl-9 pr-3 py-2' : 'px-3 py-2',   icon: 'left-2.5', size: 14 },
    md: { input: Icon ? 'pl-10 pr-4 py-2.5' : 'px-4 py-2.5', icon: 'left-3',   size: 16 },
    lg: { input: Icon ? 'pl-11 pr-4 py-3' : 'px-4 py-3',   icon: 'left-3.5', size: 18 },
  }
  const p = PADDING[size] || PADDING.md

  return (
    <div className={`flex flex-col gap-1.5 ${containerClassName}`}>
      {label && (
        <label className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <Icon
            size={p.size}
            className={`absolute top-1/2 -translate-y-1/2 ${p.icon} pointer-events-none`}
            style={{ color: 'var(--text-faint)' }}
          />
        )}
        <input
          ref={ref}
          className={`input-base focus-ring ${p.input} ${className}`}
          style={{
            borderColor: error ? 'var(--danger)' : undefined,
          }}
          {...props}
        />
        {IconRight && (
          <IconRight
            size={p.size}
            className="absolute top-1/2 -translate-y-1/2 right-3 pointer-events-none"
            style={{ color: 'var(--text-faint)' }}
          />
        )}
      </div>
      {error && (
        <p className="text-xs" style={{ color: 'var(--danger)' }}>{error}</p>
      )}
      {hint && !error && (
        <p className="text-xs" style={{ color: 'var(--text-faint)' }}>{hint}</p>
      )}
    </div>
  )
})

export default Input
