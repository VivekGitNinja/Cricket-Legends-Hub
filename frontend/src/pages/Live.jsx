import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Radio, ExternalLink, MonitorPlay, CalendarClock, ClipboardList } from 'lucide-react'
import { api } from '../lib/api'
import Section from '../components/ui/Section'
import Card from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import Skeleton from '../components/ui/Skeleton'
import { cn } from '../utils/cn'

const POLL_MS = 20000

function ScoreBlock({ team, score, batting, align }) {
  if (!score) return null
  return (
    <div className={cn('flex flex-col gap-1', align === 'right' ? 'items-end text-right' : 'items-start')}>
      <span className="flex items-center gap-1.5 text-sm font-semibold text-[var(--text-primary)]">
        {batting && <span className="live-dot h-1.5 w-1.5 rounded-full bg-[#539AC1]" />}
        {team}
      </span>
      <span className="font-display text-2xl font-bold tabular-nums text-[var(--text-primary)]">
        {score.runs}/{score.wickets}
      </span>
      <span className="text-xs text-[var(--text-muted)]">
        {score.overs} ov · RR {score.runRate}
      </span>
    </div>
  )
}

function LiveMatchCard({ m }) {
  const ls = m.liveScore
  const t1 = m.team1?.shortName || m.team1?.name || 'Home'
  const t2 = m.team2?.shortName || m.team2?.name || 'Away'
  const phase = ls?.phase

  return (
    <Card className="relative overflow-hidden p-6">
      {phase !== 'complete' && (
        <span className="absolute right-4 top-4 flex items-center gap-1.5 rounded-full bg-[#235D94]/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-[#7EC8F2]">
          <span className="live-dot h-1.5 w-1.5 rounded-full bg-[#539AC1]" /> Live
        </span>
      )}
      <p className="text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]">{m.series}</p>
      <div className="mt-4 flex items-start justify-between gap-4">
        <ScoreBlock team={t1} score={ls?.score1} batting={phase === 'innings-1'} />
        <span className="mt-1 text-sm text-[var(--text-muted)]">vs</span>
        <ScoreBlock team={t2} score={ls?.score2} batting={phase === 'chase'} align="right" />
      </div>
      <p className="mt-4 rounded-xl bg-[var(--bg-glass)] px-4 py-2.5 text-sm font-medium text-[var(--text-secondary)]">
        {ls?.summary}
      </p>
      <div className="mt-4 flex items-center justify-between text-xs text-[var(--text-muted)]">
        <span>{m.venue?.name || 'TBD'}</span>
        <span className="flex items-center gap-1.5">
          <Radio className="h-3.5 w-3.5 text-[#7EC8F2]" />
          {ls?.lastUpdated ? new Date(ls.lastUpdated).toLocaleTimeString() : ''}
        </span>
      </div>
      <Link
        to={`/matches/${m._id}`}
        className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-[#235D94] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#2F74B4]"
      >
        <ClipboardList className="h-3.5 w-3.5" /> Full scorecard
      </Link>
    </Card>
  )
}

function CommentaryPanel({ lines }) {
  return (
    <Card hover={false} className="flex max-h-[26rem] flex-col p-6">
      <h3 className="flex items-center gap-2 font-display text-lg font-semibold text-[var(--text-primary)]">
        <Radio className="h-4 w-4 text-[#7EC8F2]" /> Live commentary
      </h3>
      <ul className="mt-4 flex-1 space-y-3 overflow-y-auto pr-1 text-sm">
        {lines.length === 0 && (
          <li className="text-[var(--text-muted)]">Waiting for the first ball…</li>
        )}
        {lines.map((c, i) => (
          <motion.li
            key={`${c.over}-${i}`}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            className={cn(
              'flex gap-3 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-glass)] px-3 py-2',
              i === 0 && 'border-[#235D94]/30 bg-[#235D94]/10'
            )}
          >
            <span className="shrink-0 rounded-md bg-white/10 px-1.5 py-0.5 font-mono text-[11px] text-[var(--text-muted)]">
              {c.over}
            </span>
            <span className="text-[var(--text-secondary)]">{c.text}</span>
          </motion.li>
        ))}
      </ul>
    </Card>
  )
}

function StreamCard({ s }) {
  const embed = s.embedUrl
  return (
    <Card className="overflow-hidden">
      <div className="aspect-video w-full bg-[var(--bg-glass)]">
        {embed && s.isLive ? (
          <iframe
            src={embed}
            title={s.title}
            className="h-full w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            loading="lazy"
          />
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-2 bg-gradient-to-br from-[#235D94]/10 to-[#0D4669]/5 p-6 text-center">
            <MonitorPlay className="h-8 w-8 text-[#7EC8F2]" />
            <p className="text-sm font-semibold text-[var(--text-primary)]">{s.provider}</p>
            {!s.isLive && (
              <p className="flex items-center gap-1.5 text-xs text-[var(--text-muted)]">
                <CalendarClock className="h-3.5 w-3.5" />
                Starts {new Date(s.startsAt).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}
              </p>
            )}
          </div>
        )}
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-sm font-semibold text-[var(--text-primary)]">{s.title}</h3>
          <Badge tone={s.isLive ? 'emerald' : 'muted'}>{s.isLive ? '● Live' : 'Upcoming'}</Badge>
        </div>
        <p className="mt-1 line-clamp-2 text-xs text-[var(--text-muted)]">{s.description}</p>
        <div className="mt-3 flex items-center justify-between">
          <span className="text-xs font-medium text-[var(--text-secondary)]">{s.provider}</span>
          {s.isLive && s.viewers > 0 && (
            <span className="text-xs text-[var(--text-muted)]">{s.viewers.toLocaleString()} watching</span>
          )}
        </div>
        {s.externalUrl && (
          <Button as="a" href={s.externalUrl} target="_blank" rel="noopener noreferrer" size="sm" variant="secondary" className="mt-3 w-full">
            <ExternalLink className="h-3.5 w-3.5" /> Watch on {s.provider}
          </Button>
        )}
      </div>
    </Card>
  )
}

export default function Live() {
  const [matches, setMatches] = useState([])
  const [streams, setStreams] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const timer = useRef(null)

  const load = () => {
    Promise.allSettled([api.getLiveMatches(), api.getStreams()])
      .then(([mRes, sRes]) => {
        setMatches(mRes.status === 'fulfilled' ? mRes.value : [])
        setStreams(sRes.status === 'fulfilled' ? sRes.value : [])
        setError(false)
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    load()
    timer.current = setInterval(load, POLL_MS)
    return () => clearInterval(timer.current)
  }, [])

  // Aggregate commentary across live matches for the feed
  const commentary = matches.flatMap((m) =>
    (m.liveScore?.commentary || []).map((c) => ({
      ...c,
      match: `${m.team1?.shortName || 'T1'} vs ${m.team2?.shortName || 'T2'}`,
    }))
  )
  commentary.sort((a, b) => b.over.localeCompare(a.over, undefined, { numeric: true }))

  const liveStreams = streams.filter((s) => s.isLive)
  const upcomingStreams = streams.filter((s) => !s.isLive)

  return (
    <Section
      eyebrow="Live & Streaming"
      title="Match Centre"
      description="Live scores, ball-by-ball commentary and stream links — refreshed every 20 seconds."
      action={<Badge tone={matches.length ? 'emerald' : 'muted'}>{matches.length ? `${matches.length} live` : 'Live'} · polling</Badge>}
    >
      {loading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-48" />
          ))}
        </div>
      ) : error ? (
        <Card hover={false} className="p-8 text-center">
          <p className="text-[var(--text-secondary)]">Live data is temporarily unavailable. Check your connection and try again.</p>
        </Card>
      ) : (
        <>
          <div className="grid gap-4 lg:grid-cols-3">
            <div className="grid gap-4 md:grid-cols-2 lg:col-span-2 lg:grid-cols-2">
              {matches.map((m) => (
                <LiveMatchCard key={m._id} m={m} />
              ))}
            </div>
            <div className="lg:col-span-1">
              <CommentaryPanel lines={commentary.slice(0, 14)} />
            </div>
          </div>

          <div className="mt-14">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="font-display text-2xl font-bold text-[var(--text-primary)]">Live streams</h2>
              <Badge tone="brand">{liveStreams.length} on air</Badge>
            </div>
            {liveStreams.length ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {liveStreams.map((s) => (
                  <StreamCard key={s._id} s={s} />
                ))}
              </div>
            ) : (
              <Card hover={false} className="p-8 text-center text-[var(--text-muted)]">
                No broadcast is live right now — check back at match time.
              </Card>
            )}
          </div>

          {upcomingStreams.length > 0 && (
            <div className="mt-14">
              <div className="mb-5 flex items-center justify-between">
                <h2 className="font-display text-2xl font-bold text-[var(--text-primary)]">Upcoming broadcasts</h2>
                <Badge tone="muted">{upcomingStreams.length} scheduled</Badge>
              </div>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {upcomingStreams.map((s) => (
                  <StreamCard key={s._id} s={s} />
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </Section>
  )
}
