import { forwardRef } from 'react'

const Textarea = forwardRef(function Textarea({
  label,
  error,
  hint,
  rows = 4,
  resize = 'vertical',
  className = '',
  containerClassName = '',
  ...props
}, ref) {
  return (
    <div className={`flex flex-col gap-1.5 ${containerClassName}`}>
      {label && (
        <label className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        rows={rows}
        className={`input-base focus-ring px-4 py-3 ${className}`}
        style={{
          resize,
          minHeight: '80px',
          borderColor: error ? 'var(--danger)' : undefined,
        }}
        {...props}
      />
      {error && <p className="text-xs" style={{ color: 'var(--danger)' }}>{error}</p>}
      {hint && !error && <p className="text-xs" style={{ color: 'var(--text-faint)' }}>{hint}</p>}
    </div>
  )
})

export default Textarea
