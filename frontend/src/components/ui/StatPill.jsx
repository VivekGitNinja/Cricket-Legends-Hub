import { cn } from '../../utils/cn'

export default function StatPill({ label, value, className }) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-glass)] px-4 py-3 text-center',
        className
      )}
    >
      <div className="font-display text-xl font-bold text-[var(--text-primary)] md:text-2xl">{value}</div>
      <div className="mt-0.5 text-[10px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">
        {label}
      </div>
    </div>
  )
}
