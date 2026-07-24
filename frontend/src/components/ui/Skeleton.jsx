import { cn } from '../../utils/cn'

export default function Skeleton({ className }) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-[var(--radius-lg)] bg-gradient-to-r from-white/5 via-white/10 to-white/5 bg-[length:200%_100%]',
        className
      )}
      aria-hidden="true"
    />
  )
}
