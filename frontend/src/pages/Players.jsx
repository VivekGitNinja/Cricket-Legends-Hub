import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Crown, Search, SlidersHorizontal, Users } from 'lucide-react'
import { api } from '../lib/api'
import Section from '../components/ui/Section'
import Card from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import Skeleton from '../components/ui/Skeleton'
import PlayerAvatar from '../components/ui/PlayerAvatar'
import { cn } from '../utils/cn'

const ROLES = ['All', 'Batsman', 'Bowler', 'All-rounder', 'Wicket-keeper']

function PlayerCard({ p, compact = false }) {
  const totalRuns =
    (p.stats?.test?.runs || 0) + (p.stats?.odi?.runs || 0) + (p.stats?.t20?.runs || 0)
  const totalWickets =
    (p.stats?.test?.wickets || 0) + (p.stats?.odi?.wickets || 0) + (p.stats?.t20?.wickets || 0)
  const statLine = totalRuns
    ? `${totalRuns.toLocaleString()} runs${totalWickets ? ` · ${totalWickets} wkts` : ''}`
    : totalWickets
      ? `${totalWickets} wickets`
      : 'Rising star'

  return (
    <Link
      to={`/players/${p._id}`}
      className="group flex flex-col items-center rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-glass)] p-4 text-center transition hover:-translate-y-0.5 hover:border-[#235D94]/40 hover:bg-[var(--bg-elevated)]/60"
    >
      <div className="relative">
        <PlayerAvatar name={p.name} src={p.imageUrl} size={compact ? 'md' : 'lg'} className="transition group-hover:scale-105" />
        {p.isLegend && (
          <span className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-[#539AC1] text-[#3d2b00] shadow-md" title="Legend">
            <Crown className="h-3.5 w-3.5" />
          </span>
        )}
      </div>
      <p className="mt-3 w-full truncate text-sm font-semibold text-[var(--text-primary)] group-hover:text-[#7EC8F2]">
        {p.name}
      </p>
      <p className="mt-0.5 w-full truncate text-xs text-[var(--text-muted)]">
        {p.role} · {p.country}
      </p>
      {!compact && <p className="mt-1 text-[11px] text-[var(--text-secondary)]">{statLine}</p>}
    </Link>
  )
}

export default function Players() {
  const [all, setAll] = useState([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [country, setCountry] = useState('All')
  const [role, setRole] = useState('All')
  const [onlyLegends, setOnlyLegends] = useState(false)
  const inputRef = useRef(null)

  useEffect(() => {
    let mounted = true
    api.getPlayers().then((res) => {
      if (!mounted) return
      if (res?.players?.length) setAll(res.players)
      setLoading(false)
    })
    return () => {
      mounted = false
    }
  }, [])

  const countries = useMemo(() => {
    const set = new Set()
    for (const p of all) {
      const c = p.country || 'Other'
      set.add(c === 'England' ? 'England' : c)
    }
    return ['All', ...[...set].sort()]
  }, [all])

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    return all
      .filter((p) => {
        if (onlyLegends && !p.isLegend) return false
        if (country !== 'All' && p.country !== country) return false
        if (role !== 'All') {
          const r = p.role || ''
          if (role === 'Wicket-keeper') {
            if (!/Wicket/.test(r)) return false
          } else if (r !== role) return false
        }
        if (q) {
          const hay = [p.name, p.fullName, p.nickName, p.country, p.role, (p.teams || []).join(' ')]
            .filter(Boolean)
            .join(' ')
            .toLowerCase()
          if (!hay.includes(q)) return false
        }
        return true
      })
      .sort((a, b) => Number(Boolean(b.isLegend)) - Number(Boolean(a.isLegend)) || (b.rating || 0) - (a.rating || 0))
  }, [all, query, country, role, onlyLegends])

  return (
    <Section
      eyebrow="The Complete Archive"
      title="Every player. Every country. Every era."
      description="Search 340+ real cricketers from 20 nations — current stars and legends of the past — with photos and career stats. From Afghanistan to Zimbabwe."
      action={<Badge tone="emerald">● {all.length} players · live API</Badge>}
    >
      <Card hover={false} className="mb-6 space-y-4 p-4 sm:p-5">
        <div className="relative">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[var(--text-muted)]" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name — e.g. Tendulkar, Malinga, Gerhard Erasmus, Ellyse Perry…"
            className="w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-glass)] py-3.5 pl-12 pr-4 text-sm text-[var(--text-primary)] outline-none transition placeholder:text-[var(--text-muted)] focus:border-[#235D94]/60 focus:ring-2 focus:ring-[#235D94]/20"
            aria-label="Search players"
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-[var(--text-muted)]" />
          <select
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-glass)] px-3 py-2 text-sm text-[var(--text-primary)] outline-none"
            aria-label="Filter by country"
          >
            {countries.map((c) => (
              <option key={c} value={c}>
                {c === 'All' ? 'All countries' : c}
              </option>
            ))}
          </select>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-glass)] px-3 py-2 text-sm text-[var(--text-primary)] outline-none"
            aria-label="Filter by role"
          >
            {ROLES.map((r) => (
              <option key={r} value={r}>
                {r === 'All' ? 'All roles' : r}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={() => setOnlyLegends((v) => !v)}
            className={cn(
              'flex items-center gap-1.5 rounded-lg border px-3 py-2 text-sm font-medium transition',
              onlyLegends
                ? 'border-[#539AC1]/60 bg-[#539AC1]/15 text-[#539AC1]'
                : 'border-[var(--border-subtle)] bg-[var(--bg-glass)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            )}
          >
            <Crown className="h-4 w-4" /> Legends only
          </button>
        </div>
      </Card>

      <div className="mb-4 flex items-center justify-between">
        <p className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
          <Users className="h-4 w-4" />
          {loading ? 'Loading players…' : `${results.length} player${results.length === 1 ? '' : 's'}`}
        </p>
        {!loading && results.length === 0 && (
          <p className="text-sm text-[var(--text-muted)]">No matches — try a different name.</p>
        )}
      </div>

      {loading ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {Array.from({ length: 12 }).map((_, i) => (
            <Skeleton key={i} className="h-44" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {results.map((p) => (
            <PlayerCard key={p._id} p={p} />
          ))}
        </div>
      )}
    </Section>
  )
}
