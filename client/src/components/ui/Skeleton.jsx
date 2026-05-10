/**
 * Skeleton — shimmer loading placeholders
 * Usage: <Skeleton width="100%" height={20} />
 *        <Skeleton.Text lines={3} />
 *        <Skeleton.Card />
 *        <Skeleton.Avatar size={40} />
 */
export default function Skeleton({ width = '100%', height = 16, rounded = 'md', className = '' }) {
  const radius = { xs: '6px', sm: '8px', md: '12px', lg: '16px', full: '9999px' }[rounded] || '12px'
  return (
    <div
      className={`skeleton ${className}`}
      style={{ width, height, borderRadius: radius }}
    />
  )
}

Skeleton.Text = function SkeletonText({ lines = 3, className = '' }) {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          width={i === lines - 1 ? '65%' : '100%'}
          height={14}
          rounded="sm"
        />
      ))}
    </div>
  )
}

Skeleton.Card = function SkeletonCard({ className = '' }) {
  return (
    <div className={`card p-5 flex flex-col gap-3 ${className}`}>
      <div className="flex items-center gap-3">
        <Skeleton width={40} height={40} rounded="md" />
        <div className="flex-1 flex flex-col gap-2">
          <Skeleton width="60%" height={14} rounded="sm" />
          <Skeleton width="40%" height={12} rounded="sm" />
        </div>
      </div>
      <Skeleton.Text lines={2} />
    </div>
  )
}

Skeleton.Avatar = function SkeletonAvatar({ size = 40 }) {
  return <Skeleton width={size} height={size} rounded="full" />
}

Skeleton.Row = function SkeletonRow({ columns = 3, className = '' }) {
  return (
    <div className={`grid gap-4 ${className}`} style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
      {Array.from({ length: columns }).map((_, i) => (
        <Skeleton.Card key={i} />
      ))}
    </div>
  )
}
