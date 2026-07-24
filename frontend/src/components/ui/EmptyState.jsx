import { Inbox } from 'lucide-react'
import Button from './Button'

export default function EmptyState({
  title = 'Nothing here yet',
  description = 'Try adjusting filters or explore legends.',
  actionLabel,
  onAction,
  icon: Icon = Inbox,
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-[var(--radius-2xl)] border border-dashed border-[var(--border-subtle)] bg-[var(--bg-glass)] px-6 py-16 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-500/10 text-orange-400">
        <Icon className="h-7 w-7" aria-hidden="true" />
      </div>
      <h3 className="font-display text-xl font-semibold text-[var(--text-primary)]">{title}</h3>
      <p className="mt-2 max-w-md text-sm text-[var(--text-secondary)]">{description}</p>
      {actionLabel && onAction && (
        <Button className="mt-6" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  )
}
