import { Link } from 'react-router-dom'
import { Heart, Star } from 'lucide-react'
import { motion } from 'framer-motion'
import { useApp } from '../../context/AppContext'
import { formatNumber } from '../../utils/format'
import { fadeUp } from '../../animations/variants'
import Avatar from '../ui/Avatar'
import Badge from '../ui/Badge'
import Card from '../ui/Card'
import { cn } from '../../utils/cn'

export default function LegendCard({ legend, index = 0 }) {
  const { isFavorite, toggleFavorite } = useApp()
  const fav = isFavorite(legend.id)
  const testRuns = legend.stats?.test?.runs || 0
  const odiRuns = legend.stats?.odi?.runs || 0

  return (
    <motion.div variants={fadeUp} custom={index}>
      <Card className="group relative overflow-hidden p-5">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-orange-400/60 to-transparent opacity-0 transition group-hover:opacity-100" />
        <div className="flex items-start justify-between gap-3">
          <Link to={`/legends/${legend.id}`} className="flex items-center gap-3">
            <Avatar name={legend.name} src={legend.image} size="md" />
            <div>
              <h3 className="font-display text-lg font-semibold text-[var(--text-primary)] transition group-hover:text-orange-400">
                {legend.name}
              </h3>
              <p className="text-sm text-[var(--text-muted)]">
                {legend.country} · {legend.role}
              </p>
            </div>
          </Link>
          <button
            type="button"
            aria-label={fav ? 'Remove from favorites' : 'Add to favorites'}
            onClick={() => toggleFavorite(legend.id)}
            className={cn(
              'rounded-xl p-2 transition',
              fav ? 'bg-rose-500/15 text-rose-400' : 'text-[var(--text-muted)] hover:bg-[var(--bg-glass)]'
            )}
          >
            <Heart className={cn('h-4 w-4', fav && 'fill-current')} />
          </button>
        </div>

        <div className="mt-4 flex flex-wrap gap-1.5">
          {(legend.tags || []).slice(0, 3).map((tag) => (
            <Badge key={tag} tone={tag === 'GOAT' ? 'gold' : 'muted'}>
              {tag}
            </Badge>
          ))}
        </div>

        <div className="mt-5 grid grid-cols-3 gap-2">
          <div className="rounded-xl bg-[var(--bg-glass)] p-2.5 text-center">
            <div className="text-sm font-bold text-[var(--text-primary)]">{formatNumber(testRuns)}</div>
            <div className="text-[10px] uppercase tracking-wide text-[var(--text-muted)]">Test Runs</div>
          </div>
          <div className="rounded-xl bg-[var(--bg-glass)] p-2.5 text-center">
            <div className="text-sm font-bold text-[var(--text-primary)]">{formatNumber(odiRuns)}</div>
            <div className="text-[10px] uppercase tracking-wide text-[var(--text-muted)]">ODI Runs</div>
          </div>
          <div className="rounded-xl bg-[var(--bg-glass)] p-2.5 text-center">
            <div className="flex items-center justify-center gap-1 text-sm font-bold text-amber-300">
              <Star className="h-3.5 w-3.5 fill-current" />
              {legend.goatScore}
            </div>
            <div className="text-[10px] uppercase tracking-wide text-[var(--text-muted)]">GOAT</div>
          </div>
        </div>

        <Link
          to={`/legends/${legend.id}`}
          className="mt-5 inline-flex text-sm font-semibold text-orange-400 transition hover:text-orange-300"
        >
          View profile →
        </Link>
      </Card>
    </motion.div>
  )
}
