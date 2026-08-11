import { cn } from '../../utils/cn'

export default function Card({ className, hover = true, shine = true, children, as: Comp = 'div', ...props }) {
  return (
    <Comp
      className={cn(
        'rounded-[var(--radius-2xl)] border border-[var(--border-subtle)] bg-[var(--bg-glass)] backdrop-blur-xl',
        shine && 'card-shine',
        hover &&
          'transition-all duration-300 hover:-translate-y-1 hover:border-[var(--border-brand)] hover:shadow-[var(--shadow-lg)]',
        className
      )}
      {...props}
    >
      {children}
    </Comp>
  )
}
