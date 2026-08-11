import { cn } from '../../utils/cn'

const tones = {
  brand: 'bg-[#235D94]/20 text-[#A5C7E0] border-[#539AC1]/40',
  gold: 'bg-[#539AC1]/15 text-[#7EC8F2] border-[#539AC1]/30',
  sky: 'bg-sky-500/15 text-sky-300 border-sky-500/25',
  emerald: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/25',
  violet: 'bg-violet-500/15 text-violet-300 border-violet-500/25',
  muted: 'bg-white/5 text-[var(--text-secondary)] border-[var(--border-subtle)]',
}

export default function Badge({ children, tone = 'brand', className }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold tracking-wide',
        tones[tone],
        className
      )}
    >
      {children}
    </span>
  )
}
