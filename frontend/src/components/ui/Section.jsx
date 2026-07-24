import { cn } from '../../utils/cn'

export default function Section({
  id,
  eyebrow,
  title,
  description,
  action,
  children,
  className,
  containerClassName,
}) {
  return (
    <section id={id} className={cn('py-16 md:py-24', className)}>
      <div className={cn('mx-auto max-w-[var(--container)] px-4 sm:px-6 lg:px-8', containerClassName)}>
        {(eyebrow || title || description || action) && (
          <div className="mb-10 flex flex-col gap-4 md:mb-14 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              {eyebrow && (
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-orange-400">
                  {eyebrow}
                </p>
              )}
              {title && (
                <h2 className="font-display text-3xl font-bold tracking-tight text-[var(--text-primary)] md:text-4xl">
                  {title}
                </h2>
              )}
              {description && (
                <p className="mt-3 text-base text-[var(--text-secondary)] md:text-lg">{description}</p>
              )}
            </div>
            {action}
          </div>
        )}
        {children}
      </div>
    </section>
  )
}
