import { cn } from '../../utils/cn'

export default function Select({ className, children, ...props }) {
  return (
    <select
      className={cn(
        'w-full rounded-[var(--radius-lg)] border border-[var(--border-subtle)] bg-[var(--bg-elevated)] px-4 py-2.5 text-[var(--text-primary)] outline-none transition focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20',
        className
      )}
      {...props}
    >
      {children}
    </select>
  )
}
