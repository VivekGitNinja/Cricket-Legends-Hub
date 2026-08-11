import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, Crown, Flame, MapPin, Shield, Trophy, Users } from 'lucide-react'
import { api } from '../lib/api'
import Section from '../components/ui/Section'
import Card from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import Skeleton from '../components/ui/Skeleton'
import PlayerAvatar from '../components/ui/PlayerAvatar'
import { cn } from '../utils/cn'

const FORMATS = [
  { key: 'test', label: 'Tests' },
  { key: 'odi', label: 'ODIs' },
  { key: 't20', label: 'T20Is' },
]

function StatBlock({ label, value, sub }) {
  return (
    <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-glass)] p-3 text-center">
      <p className="text-[10px] font-semibold uppercase tracking-widest text-[var(--text-muted)]">{label}</p>
      <p className="mt-1 font-display text-xl font-bold text-[var(--text-primary)]">{value ?? '—'}</p>
      {sub && <p className="mt-0.5 text-[10px] text-[var(--text-secondary)]">{sub}</p>}
    </div>
  )
}

function FormatCard({ title, stats }) {
  if (!stats) return null
  return (
    <Card hover={false} className="p-5">
      <h3 className="mb-4 font-display text-lg font-bold text-[var(--text-primary)]">{title}</h3>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatBlock label="Matches" value={stats.matches || 0} />
        <StatBlock label="Runs" value={stats.runs ? stats.runs.toLocaleString() : 0} />
        <StatBlock label="Wickets" value={stats.wickets || 0} />
        <StatBlock label="Average" value={stats.average ? stats.average.toFixed(2) : '—'} />
      </div>
      {stats.strikeRate > 0 && (
        <p className="mt-3 text-xs text-[var(--text-secondary)]">
          Strike rate: <span className="font-semibold text-[var(--text-primary)]">{stats.strikeRate.toFixed(1)}</span>
        </p>
      )}
    </Card>
  )
}

export default function PlayerDetail() {
  const { id } = useParams()
  const [player, setPlayer] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    setLoading(true)
    api.getPlayer(id).then((p) => {
      if (!mounted) return
      setPlayer(p)
      setLoading(false)
    })
    return () => {
      mounted = false
    }
  }, [id])

  if (loading) {
    return (
      <Section>
        <div className="mx-auto max-w-3xl space-y-4">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-40 w-40 rounded-full" />
          <Skeleton className="h-6 w-full max-w-md" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
      </Section>
    )
  }

  if (!player) {
    return (
      <Section>
        <Card hover={false} className="p-12 text-center">
          <p className="text-lg font-semibold text-[var(--text-primary)]">Player not found</p>
          <Link to="/players" className="mt-3 inline-block text-sm text-[#7EC8F2] hover:underline">
            ← Back to all players
          </Link>
        </Card>
      </Section>
    )
  }

  const totalRuns =
    (player.stats?.test?.runs || 0) + (player.stats?.odi?.runs || 0) + (player.stats?.t20?.runs || 0)
  const totalWickets =
    (player.stats?.test?.wickets || 0) + (player.stats?.odi?.wickets || 0) + (player.stats?.t20?.wickets || 0)

  return (
    <Section>
      <Link
        to="/players"
        className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-[var(--text-secondary)] transition hover:text-[var(--text-primary)]"
      >
        <ArrowLeft className="h-4 w-4" /> All players
      </Link>

      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="relative overflow-hidden rounded-3xl border border-[var(--border-subtle)] bg-gradient-to-br from-[#161b22] via-[var(--bg-card)] to-[#1c2230] p-6 sm:p-10">
          <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#235D94]/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-[#539AC1]/10 blur-3xl" />
          <div className="relative flex flex-col items-center gap-6 sm:flex-row sm:items-start">
            <div className="shrink-0">
              <PlayerAvatar name={player.name} src={player.imageUrl} size="xl" className="ring-4 ring-[#235D94]/30" />
            </div>
            <div className="flex-1 text-center sm:text-left">
              <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                {player.isLegend && (
                  <Badge tone="gold">
                    <Crown className="mr-1 h-3 w-3" /> Legend
                  </Badge>
                )}
                {player.nickName && <Badge tone="brand">{player.nickName}</Badge>}
                {player.rating > 0 && <Badge tone="emerald">{player.rating} rating</Badge>}
              </div>
              <h1 className="mt-3 font-display text-3xl font-extrabold text-[var(--text-primary)] sm:text-4xl">
                {player.name}
              </h1>
              <p className="mt-1 text-sm text-[var(--text-secondary)]">
                {player.fullName && player.fullName !== player.name ? `${player.fullName} · ` : ''}
                {player.role}
              </p>
              <div className="mt-4 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm text-[var(--text-secondary)] sm:justify-start">
                <span className="flex items-center gap-1.5">
                  <MapPin className="h-4 w-4 text-[#7EC8F2]" /> {player.country}
                </span>
                <span className="flex items-center gap-1.5">
                  <Shield className="h-4 w-4 text-[#7EC8F2]" /> {player.battingStyle || 'Right-hand bat'}
                </span>
                {player.bowlingStyle && player.bowlingStyle !== '—' && (
                  <span className="flex items-center gap-1.5">
                    <Flame className="h-4 w-4 text-[#539AC1]" /> {player.bowlingStyle}
                  </span>
                )}
              </div>
              <div className="mt-5 grid grid-cols-3 gap-3">
                <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-glass)] p-3 text-center">
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-[var(--text-muted)]">Career runs</p>
                  <p className="mt-1 font-display text-xl font-bold text-[var(--text-primary)]">
                    {totalRuns ? totalRuns.toLocaleString() : '—'}
                  </p>
                </div>
                <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-glass)] p-3 text-center">
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-[var(--text-muted)]">Career wickets</p>
                  <p className="mt-1 font-display text-xl font-bold text-[var(--text-primary)]">
                    {totalWickets ? totalWickets.toLocaleString() : '—'}
                  </p>
                </div>
                <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-glass)] p-3 text-center">
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-[var(--text-muted)]">Teams</p>
                  <p className="mt-1 truncate font-display text-xl font-bold text-[var(--text-primary)]">
                    {(player.teams || [player.country]).length}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bio */}
        {player.bio && (
          <Card hover={false} className="mt-6 p-6">
            <h2 className="mb-2 flex items-center gap-2 font-display text-lg font-bold text-[var(--text-primary)]">
              <Users className="h-5 w-5 text-[#7EC8F2]" /> About
            </h2>
            <p className="text-sm leading-relaxed text-[var(--text-secondary)]">{player.bio}</p>
          </Card>
        )}

        {/* Achievements */}
        {player.achievements?.length > 0 && (
          <Card hover={false} className="mt-6 p-6">
            <h2 className="mb-4 flex items-center gap-2 font-display text-lg font-bold text-[var(--text-primary)]">
              <Trophy className="h-5 w-5 text-[#539AC1]" /> Achievements
            </h2>
            <ul className="grid gap-3 sm:grid-cols-2">
              {player.achievements.map((a) => (
                <li
                  key={a}
                  className="flex items-start gap-3 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-glass)] p-3 text-sm text-[var(--text-secondary)]"
                >
                  <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[#539AC1]" />
                  {a}
                </li>
              ))}
            </ul>
          </Card>
        )}

        {/* Stats */}
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {FORMATS.map((f) => (
            <FormatCard key={f.key} title={f.label} stats={player.stats?.[f.key]} />
          ))}
        </div>

        {/* Teams */}
        {(player.teams || []).length > 0 && (
          <Card hover={false} className="mt-6 p-6">
            <h2 className="mb-4 flex items-center gap-2 font-display text-lg font-bold text-[var(--text-primary)]">
              <Shield className="h-5 w-5 text-[#7EC8F2]" /> Represented teams
            </h2>
            <div className="flex flex-wrap gap-2">
              {(player.teams || []).map((t) => (
                <span
                  key={t}
                  className={cn(
                    'rounded-full border px-3 py-1 text-xs font-medium',
                    'border-[var(--border-subtle)] bg-[var(--bg-glass)] text-[var(--text-secondary)]'
                  )}
                >
                  {t}
                </span>
              ))}
            </div>
          </Card>
        )}
      </div>
    </Section>
  )
}
