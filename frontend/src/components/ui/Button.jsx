import { cn } from '../../utils/cn'

const variants = {
  primary:
    'bg-gradient-to-r from-[#235D94] to-[#0D4669] text-white shadow-[var(--shadow-glow)] hover:brightness-115',
  secondary:
    'bg-[var(--bg-glass-strong)] text-[var(--text-primary)] border border-[var(--border-subtle)] hover:border-[var(--border-strong)]',
  ghost: 'bg-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-glass)]',
  gold: 'bg-gradient-to-r from-[#539AC1] to-[#235D94] text-[#021B30] font-semibold shadow-[var(--shadow-gold)]',
  danger: 'bg-rose-500/15 text-rose-300 border border-rose-500/30 hover:bg-rose-500/25',
}

const sizes = {
  sm: 'px-3 py-1.5 text-sm rounded-[var(--radius-md)]',
  md: 'px-4 py-2.5 text-sm rounded-[var(--radius-lg)]',
  lg: 'px-6 py-3 text-base rounded-[var(--radius-xl)]',
  icon: 'p-2.5 rounded-[var(--radius-lg)]',
}

export default function Button({
  as: Comp = 'button',
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...props
}) {
  return (
    <Comp
      className={cn(
        'inline-flex items-center justify-center gap-2 font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#539AC1]/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-base)] disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]',
        (variant === 'primary' || variant === 'gold') && 'btn-shine',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </Comp>
  )
}
