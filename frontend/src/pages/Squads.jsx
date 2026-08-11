import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, Shield, Users, Trophy } from 'lucide-react'
import { api } from '../lib/api'
import Section from '../components/ui/Section'
import Card from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import Skeleton from '../components/ui/Skeleton'
import PlayerAvatar from '../components/ui/PlayerAvatar'
import { cn } from '../utils/cn'

const TEAM_ORDER = [
  'India',
  'Australia',
  'England',
  'Pakistan',
  'New Zealand',
  'South Africa',
  'Sri Lanka',
  'West Indies',
  'Afghanistan',
  'Bangladesh',
  'Zimbabwe',
  'Ireland',
  'Scotland',
  'Netherlands',
  'UAE',
  'Nepal',
  'USA',
  'Canada',
  'Namibia',
  'Oman',
  'India Women',
  'Australia Women',
]

function PlayerCard({ p }) {
  const odi = p.stats?.odi
  const test = p.stats?.test
  const t20 = p.stats?.t20
  const totalRuns = (test?.runs || 0) + (odi?.runs || 0) + (t20?.runs || 0)
  const totalWickets = (test?.wickets || 0) + (odi?.wickets || 0) + (t20?.wickets || 0)
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
      <PlayerAvatar name={p.name} src={p.imageUrl} size="lg" className="transition group-hover:scale-105" />
      <p className="mt-3 w-full truncate text-sm font-semibold text-[var(--text-primary)] group-hover:text-[#7EC8F2]">{p.name}</p>
      <p className="mt-0.5 text-xs text-[var(--text-muted)]">{p.role}</p>
      <p className="mt-1 text-[11px] text-[var(--text-secondary)]">{statLine}</p>
      <div className="mt-2 flex items-center gap-1">
        <Badge tone="brand">{p.rating}</Badge>
        <Badge tone="muted">{p.battingStyle?.split(' ')[0] === 'Left' ? 'LHB' : 'RHB'}</Badge>
      </div>
    </Link>
  )
}

export default function Squads() {
  const [players, setPlayers] = useState([])
  const [teams, setTeams] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('All')
  const [query, setQuery] = useState('')

  useEffect(() => {
    let mounted = true
    Promise.allSettled([api.getPlayers(), api.getTeams()]).then(([p, t]) => {
      if (!mounted) return
      if (p.status === 'fulfilled' && p.value?.players?.length) setPlayers(p.value.players)
      if (t.status === 'fulfilled' && t.value?.teams?.length) setTeams(t.value.teams)
      setLoading(false)
    })
    return () => {
      mounted = false
    }
  }, [])

  const grouped = useMemo(() => {
    const map = new Map()
    for (const p of players) {
      const key = p.teams?.[0] || p.country || 'Other'
      if (!map.has(key)) map.set(key, [])
      map.get(key).push(p)
    }
    const order = [...TEAM_ORDER.filter((t) => map.has(t)), ...[...map.keys()].filter((k) => !TEAM_ORDER.includes(k))]
    return order.map((name) => ({
      name,
      players: map.get(name).sort((a, b) => (b.rating || 0) - (a.rating || 0)),
      team: teams.find((t) => t.name === name),
    }))
  }, [players, teams])

  const q = query.trim().toLowerCase()
  const filtered = (filter === 'All' ? grouped : grouped.filter((g) => g.name === filter))
    .map((g) => ({
      ...g,
      players: q
        ? g.players.filter((p) =>
            [p.name, p.fullName, p.nickName, p.role, (p.teams || []).join(' ')].filter(Boolean).some((v) => v.toLowerCase().includes(q))
          )
        : g.players,
    }))
    .filter((g) => g.players.length > 0)
  const totalPlayers = players.length

  return (
    <Section
      eyebrow="National Squads"
      title="Every country. Every player."
      description="Real players from all 20 nations — men's and women's, current stars and past legends — with career stats and photos."
      action={<Badge tone="emerald">● {totalPlayers} players · live API</Badge>}
    >
      <div className="relative mb-6 max-w-md">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-muted)]" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search this squad — e.g. Malinga, de Silva…"
          className="w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-glass)] py-3 pl-11 pr-4 text-sm text-[var(--text-primary)] outline-none transition placeholder:text-[var(--text-muted)] focus:border-[#235D94]/60 focus:ring-2 focus:ring-[#235D94]/20"
          aria-label="Search squads"
        />
      </div>
      <div className="mb-6 flex flex-wrap gap-2">
        {['All', ...grouped.map((g) => g.name)].map((name) => (
          <button
            key={name}
            type="button"
            onClick={() => setFilter(name)}
            className={cn(
              'rounded-full px-4 py-1.5 text-sm font-medium transition',
              filter === name
                ? 'bg-[#235D94] text-white'
                : 'border border-[var(--border-subtle)] bg-[var(--bg-glass)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            )}
          >
            {name}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-40" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <Card hover={false} className="p-10 text-center text-[var(--text-muted)]">
          No squads available yet.
        </Card>
      ) : (
        <div className="space-y-10">
          {filtered.map((group) => (
            <div key={group.name}>
              <div className="mb-4 flex flex-wrap items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#235D94]/15 text-[#7EC8F2]">
                  <Shield className="h-5 w-5" />
                </span>
                <div>
                  <h2 className="flex items-center gap-2 font-display text-2xl font-bold text-[var(--text-primary)]">
                    {group.name}
                    {group.team?.shortName && (
                      <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-bold tracking-widest text-[var(--text-muted)]">
                        {group.team.shortName}
                      </span>
                    )}
                  </h2>
                  <p className="flex items-center gap-3 text-xs text-[var(--text-muted)]">
                    <span className="flex items-center gap-1">
                      <Users className="h-3 w-3" /> {group.players.length} players
                    </span>
                    {group.team?.captain?.name && (
                      <span className="flex items-center gap-1">
                        <Trophy className="h-3 w-3" /> Captain: {group.team.captain.name}
                      </span>
                    )}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                {group.players.map((p) => (
                  <PlayerCard key={p._id} p={p} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </Section>
  )
}
