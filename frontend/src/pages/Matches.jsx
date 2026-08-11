import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Radio, CalendarClock, Trophy, ClipboardList } from 'lucide-react'
import { api, normalizeApiMatch } from '../lib/api'
import { MATCHES } from '../data/legends'
import Section from '../components/ui/Section'
import Card from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import Skeleton from '../components/ui/Skeleton'
import { cn } from '../utils/cn'

const TABS = [
  { id: 'live', label: 'Live now', icon: Radio },
  { id: 'upcoming', label: 'Upcoming', icon: CalendarClock },
  { id: 'completed', label: 'Completed', icon: Trophy },
]

function Countdown({ date }) {
  const [now, setNow] = useState(Date.now())
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 30000)
    return () => clearInterval(t)
  }, [])
  const diff = new Date(date).getTime() - now
  if (diff <= 0) return <span className="text-emerald-400">Starts soon</span>
  const d = Math.floor(diff / 86400000)
  const h = Math.floor((diff % 86400000) / 3600000)
  const m = Math.floor((diff % 3600000) / 60000)
  const parts = []
  if (d > 0) parts.push(`${d}d`)
  if (h > 0 || d > 0) parts.push(`${h}h`)
  parts.push(`${m}m`)
  return <span className="tabular-nums text-sky-400">in {parts.join(' ')}</span>
}

function MatchCard({ m, live }) {
  const ls = m.liveScore
  return (
    <Card className="relative overflow-hidden p-6">
      {live && (
        <span className="absolute right-4 top-4 flex items-center gap-1.5 rounded-full bg-[#235D94]/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-[#7EC8F2]">
          <span className="live-dot h-1.5 w-1.5 rounded-full bg-[#539AC1]" /> Live
        </span>
      )}
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-display text-xl font-semibold text-[var(--text-primary)]">
            {m.teamA} vs {m.teamB}
          </h3>
          <p className="mt-1 text-sm text-[var(--text-muted)]">{m.title}</p>
        </div>
        <Badge tone="sky">{m.format}</Badge>
      </div>

      {live && ls ? (
        <div className="mt-4 grid grid-cols-2 items-center gap-4">
          <div>
            <p className="text-xs text-[var(--text-muted)]">{m.teamA}</p>
            <p className="font-display text-2xl font-bold tabular-nums text-[var(--text-primary)]">
              {ls.score1?.runs}/{ls.score1?.wickets}
              <span className="ml-1 text-xs font-normal text-[var(--text-muted)]">{ls.score1?.overs} ov</span>
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-[var(--text-muted)]">{m.teamB}</p>
            <p className="font-display text-2xl font-bold tabular-nums text-[var(--text-primary)]">
              {ls.score2 ? `${ls.score2.runs}/${ls.score2.wickets}` : '—'}
              {ls.score2 && <span className="ml-1 text-xs font-normal text-[var(--text-muted)]">{ls.score2.overs} ov</span>}
            </p>
          </div>
        </div>
      ) : (
        <div className="mt-4 flex items-center justify-between text-sm text-[var(--text-secondary)]">
          <span>{m.scoreA}</span>
          <span className="text-[var(--text-muted)]">vs</span>
          <span>{m.scoreB}</span>
        </div>
      )}

      <p className="mt-4 text-sm text-[var(--text-secondary)]">
        {live && ls ? ls.summary : m.highlight}
      </p>
      <div className="mt-5 flex items-center justify-between border-t border-[var(--border-subtle)] pt-4 text-xs text-[var(--text-muted)]">
        <span>{m.venue}</span>
        {m.status === 'Scheduled' ? (
          <Countdown date={m.date} />
        ) : (
          <span className={cn('font-semibold capitalize', live ? 'text-emerald-400' : 'text-sky-400')}>
            {m.status === 'Live' ? 'Live' : m.status}
          </span>
        )}
      </div>
      {(live || m.status === 'Completed') && (
        <div className="mt-4 flex flex-wrap gap-2 border-t border-[var(--border-subtle)] pt-3">
          <Link
            to={`/matches/${m.id}`}
            className="inline-flex items-center gap-1.5 rounded-xl bg-[#235D94] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#2F74B4]"
          >
            <ClipboardList className="h-3.5 w-3.5" /> Full scorecard
          </Link>
          {live && (
            <Link
              to="/live"
              className="inline-flex items-center gap-1.5 rounded-xl border border-[#235D94]/40 bg-[#235D94]/10 px-4 py-2 text-xs font-semibold text-[#7EC8F2] transition hover:bg-[#235D94]/20"
            >
              <Radio className="h-3.5 w-3.5" /> Match centre
            </Link>
          )}
        </div>
      )}
    </Card>
  )
}

export default function Matches() {
  const [tab, setTab] = useState('live')
  const [live, setLive] = useState([])
  const [upcoming, setUpcoming] = useState([])
  const [completed, setCompleted] = useState([])
  const [loading, setLoading] = useState(true)
  const [source, setSource] = useState('local')

  useEffect(() => {
    let mounted = true
    Promise.allSettled([api.getLiveMatches(), api.getUpcomingMatches(), api.getMatches()]).then(
      ([l, u, c]) => {
        if (!mounted) return
        const norm = (list) => list.map(normalizeApiMatch).filter(Boolean)
        if (l.status === 'fulfilled' && l.value.length) setLive(norm(l.value))
        if (u.status === 'fulfilled' && u.value.length) setUpcoming(norm(u.value))
        const cData = c.status === 'fulfilled' ? c.value : null
        if (cData?.matches?.length) {
          setSource(cData.source === 'api' ? 'api' : 'local')
          const apiCompleted = norm(cData.matches).filter((m) => m.status === 'Completed')
          setCompleted(apiCompleted.length ? apiCompleted : MATCHES)
        } else {
          setCompleted(MATCHES)
        }
        setLoading(false)
      }
    )
    return () => {
      mounted = false
    }
  }, [])

  const list = useMemo(() => {
    if (tab === 'live') return live
    if (tab === 'upcoming') return upcoming
    return completed
  }, [tab, live, upcoming, completed])

  const counts = { live: live.length, upcoming: upcoming.length, completed: completed.length }

  return (
    <Section
      eyebrow="Match Centre"
      title="Fixtures & results"
      description="Follow the action live, plan for what's next, and relive the greatest games."
      action={
        <Badge tone={source === 'api' ? 'emerald' : 'muted'}>
          {source === 'api' ? '● Live API data' : 'Offline archive'}
        </Badge>
      }
    >
      <div className="mb-6 flex flex-wrap gap-2">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id)}
            className={cn(
              'flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition',
              tab === id
                ? 'bg-[#235D94] text-white shadow-[var(--shadow-glow)]'
                : 'border border-[var(--border-subtle)] bg-[var(--bg-glass)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            )}
          >
            <Icon className="h-4 w-4" />
            {label}
            {counts[id] > 0 && (
              <span className={cn('rounded-full px-1.5 text-[10px] font-bold', tab === id ? 'bg-white/20' : 'bg-[#235D94]/15 text-[#7EC8F2]')}>
                {counts[id]}
              </span>
            )}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="grid gap-4 md:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="rounded-[var(--radius-2xl)] border border-[var(--border-subtle)] bg-[var(--bg-glass)] p-6">
              <Skeleton className="h-6 w-2/3" />
              <Skeleton className="mt-3 h-4 w-1/2" />
              <Skeleton className="mt-6 h-4 w-full" />
              <Skeleton className="mt-3 h-4 w-3/4" />
            </div>
          ))}
        </div>
      ) : list.length === 0 ? (
        <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-glass)] p-10 text-center">
          <p className="text-[var(--text-secondary)]">No {tab} matches right now.</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {list.map((m) => (
            <MatchCard key={m.id} m={m} live={tab === 'live' || m.status === 'Live'} />
          ))}
        </div>
      )}
    </Section>
  )
}
