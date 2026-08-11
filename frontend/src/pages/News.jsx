import { useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowUpRight, X, Clock } from 'lucide-react'
import { api } from '../lib/api'
import Section from '../components/ui/Section'
import Card from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import Skeleton from '../components/ui/Skeleton'
import { cn } from '../utils/cn'

const CATEGORIES = ['All', 'Match', 'Series', 'ICC', 'Women', 'IPL', 'Records', 'Analysis']

function timeAgo(iso) {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `${Math.max(1, mins)}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  return `${days}d ago`
}

export default function News() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [category, setCategory] = useState('All')
  const [open, setOpen] = useState(null)

  useEffect(() => {
    api
      .getNews()
      .then(setItems)
      .catch(() => setItems([]))
      .finally(() => setLoading(false))
  }, [])

  const filtered = useMemo(
    () => (category === 'All' ? items : items.filter((n) => n.category === category)),
    [items, category]
  )
  const featured = filtered.find((n) => n.featured) || filtered[0]

  return (
    <Section
      eyebrow="Newsroom"
      title="Cricket news"
      description="The latest headlines from across the cricket world, powered by the Cricket Legends Hub API."
      action={<Badge tone="emerald">● Live feed</Badge>}
    >
      <div className="mb-6 flex flex-wrap gap-2">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setCategory(c)}
            className={cn(
              'rounded-full px-4 py-1.5 text-sm font-medium transition',
              category === c
                ? 'bg-[#235D94] text-white'
                : 'border border-[var(--border-subtle)] bg-[var(--bg-glass)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            )}
          >
            {c}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-4">
          <Skeleton className="h-64" />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Skeleton className="h-40" />
            <Skeleton className="h-40" />
            <Skeleton className="h-40" />
          </div>
        </div>
      ) : filtered.length === 0 ? (
        <Card hover={false} className="p-10 text-center text-[var(--text-muted)]">
          No stories in this category yet.
        </Card>
      ) : (
        <>
          {featured && (
            <button
              type="button"
              onClick={() => setOpen(featured)}
              className="group mb-6 block w-full overflow-hidden rounded-[var(--radius-2xl)] border border-[var(--border-subtle)] bg-gradient-to-br from-[#235D94]/10 via-transparent to-transparent text-left"
            >
              <div className="grid gap-4 p-6 md:grid-cols-[1.4fr_1fr] md:p-8">
                <div>
                  <div className="flex items-center gap-2">
                    <Badge tone="brand">{featured.category}</Badge>
                    {featured.featured && <Badge tone="gold">Featured</Badge>}
                  </div>
                  <h2 className="mt-4 font-display text-2xl font-bold leading-snug text-[var(--text-primary)] group-hover:text-[#7EC8F2] transition-colors md:text-3xl">
                    {featured.title}
                  </h2>
                  <p className="mt-3 text-[var(--text-secondary)]">{featured.excerpt}</p>
                  <p className="mt-4 flex items-center gap-3 text-xs text-[var(--text-muted)]">
                    <span>{featured.author}</span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" /> {timeAgo(featured.publishedAt)}
                    </span>
                    <span className="ml-auto inline-flex items-center gap-1 font-semibold text-[#7EC8F2]">
                      Read story <ArrowUpRight className="h-3.5 w-3.5" />
                    </span>
                  </p>
                </div>
                <div className="hidden items-center justify-center rounded-2xl border border-dashed border-[var(--border-strong)] bg-[var(--bg-glass)] md:flex">
                  <span className="font-display text-5xl font-black text-[#235D94]/20">CL</span>
                </div>
              </div>
            </button>
          )}

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filtered
              .filter((n) => n._id !== featured?._id)
              .map((n) => (
                <button
                  key={n._id}
                  type="button"
                  onClick={() => setOpen(n)}
                  className="group flex flex-col rounded-[var(--radius-2xl)] border border-[var(--border-subtle)] bg-[var(--bg-glass)] p-5 text-left transition hover:border-[#235D94]/40"
                >
                  <div className="flex items-center gap-2">
                    <Badge tone={n.category === 'Women' ? 'rose' : 'muted'}>{n.category}</Badge>
                    <span className="text-xs text-[var(--text-muted)]">{timeAgo(n.publishedAt)}</span>
                  </div>
                  <h3 className="mt-3 font-display text-lg font-semibold leading-snug text-[var(--text-primary)] group-hover:text-[#7EC8F2] transition-colors">
                    {n.title}
                  </h3>
                  <p className="mt-2 line-clamp-3 flex-1 text-sm text-[var(--text-secondary)]">{n.excerpt}</p>
                  <p className="mt-4 flex items-center justify-between text-xs text-[var(--text-muted)]">
                    <span>{n.source}</span>
                    <span className="inline-flex items-center gap-1 font-semibold text-[#7EC8F2]">
                      Read <ArrowUpRight className="h-3.5 w-3.5" />
                    </span>
                  </p>
                </button>
              ))}
          </div>
        </>
      )}

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[var(--z-modal)] flex items-end justify-center bg-black/60 p-0 backdrop-blur-sm sm:items-center sm:p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(null)}
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label={open.title}
              className="max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-t-3xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)] p-6 shadow-[var(--shadow-lg)] sm:rounded-3xl sm:p-8"
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 40, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-2">
                  <Badge tone="brand">{open.category}</Badge>
                  <span className="text-xs text-[var(--text-muted)]">{timeAgo(open.publishedAt)}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setOpen(null)}
                  className="rounded-xl p-2 text-[var(--text-muted)] transition hover:bg-[var(--bg-glass)] hover:text-[var(--text-primary)]"
                  aria-label="Close article"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <h2 className="mt-4 font-display text-2xl font-bold leading-snug text-[var(--text-primary)]">
                {open.title}
              </h2>
              <p className="mt-2 text-sm text-[var(--text-muted)]">
                By {open.author} · {open.source}
              </p>
              <div className="mt-5 space-y-4 text-[15px] leading-relaxed text-[var(--text-secondary)]">
                {String(open.content || '').split('\n').filter(Boolean).map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
              {open.tags?.length > 0 && (
                <div className="mt-6 flex flex-wrap gap-2">
                  {open.tags.map((t) => (
                    <span key={t} className="rounded-full bg-white/10 px-3 py-1 text-xs text-[var(--text-muted)]">
                      #{t}
                    </span>
                  ))}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Section>
  )
}
