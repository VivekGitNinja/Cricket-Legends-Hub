import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, Radio, MapPin, Users } from 'lucide-react'
import { api } from '../lib/api'
import Section from '../components/ui/Section'
import Card from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import Skeleton from '../components/ui/Skeleton'

const STATUS_TONE = {
  Live: 'emerald',
  Scheduled: 'sky',
  Completed: 'muted',
  Cancelled: 'rose',
  Tied: 'gold',
  'No Result': 'sky',
}

function BattingTable({ inn }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[32rem] text-sm">
        <thead>
          <tr className="border-b border-[var(--border-subtle)] text-left text-[11px] uppercase tracking-wider text-[var(--text-muted)]">
            <th className="py-2 pr-3 font-semibold">Batter</th>
            <th className="py-2 px-3 font-semibold">Dismissal</th>
            <th className="py-2 px-3 text-right font-semibold">R</th>
            <th className="py-2 px-3 text-right font-semibold">B</th>
            <th className="py-2 px-3 text-right font-semibold">4s</th>
            <th className="py-2 px-3 text-right font-semibold">6s</th>
            <th className="py-2 pl-3 text-right font-semibold">SR</th>
          </tr>
        </thead>
        <tbody>
          {inn.batters.map((b) => (
            <tr key={b.name} className="border-b border-[var(--border-subtle)]/60 last:border-0">
              <td className="py-2.5 pr-3 font-semibold text-[var(--text-primary)]">{b.name}</td>
              <td className="py-2.5 px-3 text-xs text-[var(--text-muted)]">{b.out || 'not out'}</td>
              <td className="py-2.5 px-3 text-right font-bold tabular-nums text-[var(--text-primary)]">{b.runs}</td>
              <td className="py-2.5 px-3 text-right tabular-nums text-[var(--text-secondary)]">{b.balls}</td>
              <td className="py-2.5 px-3 text-right tabular-nums text-[var(--text-secondary)]">{b.fours}</td>
              <td className="py-2.5 px-3 text-right tabular-nums text-[var(--text-secondary)]">{b.sixes}</td>
              <td className="py-2.5 pl-3 text-right tabular-nums text-[var(--text-secondary)]">{b.sr}</td>
            </tr>
          ))}
          {inn.didNotBat?.length > 0 && (
            <tr>
              <td className="py-2.5 pr-3 text-xs text-[var(--text-muted)]">
                Did not bat: {inn.didNotBat.join(', ')}
              </td>
            </tr>
          )}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan="2" className="pt-3 text-sm font-bold text-[var(--text-primary)]">
              Total
            </td>
            <td className="pt-3 text-right font-display text-lg font-bold text-[#7EC8F2]">
              {inn.runs}/{inn.wickets}
            </td>
            <td className="pt-3 pl-1 text-xs text-[var(--text-muted)]">({inn.overs} ov)</td>
            <td colSpan="2" className="pt-3 text-right text-xs text-[var(--text-muted)]">
              Extras {inn.extras}
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  )
}

function BowlingTable({ inn }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[30rem] text-sm">
        <thead>
          <tr className="border-b border-[var(--border-subtle)] text-left text-[11px] uppercase tracking-wider text-[var(--text-muted)]">
            <th className="py-2 pr-3 font-semibold">Bowler</th>
            <th className="py-2 px-3 text-right font-semibold">O</th>
            <th className="py-2 px-3 text-right font-semibold">M</th>
            <th className="py-2 px-3 text-right font-semibold">R</th>
            <th className="py-2 px-3 text-right font-semibold">W</th>
            <th className="py-2 pl-3 text-right font-semibold">Econ</th>
          </tr>
        </thead>
        <tbody>
          {inn.bowlers.map((b) => (
            <tr key={b.name} className="border-b border-[var(--border-subtle)]/60 last:border-0">
              <td className="py-2.5 pr-3 font-semibold text-[var(--text-primary)]">{b.name}</td>
              <td className="py-2.5 px-3 text-right tabular-nums text-[var(--text-secondary)]">{b.overs}</td>
              <td className="py-2.5 px-3 text-right tabular-nums text-[var(--text-secondary)]">{b.maidens}</td>
              <td className="py-2.5 px-3 text-right tabular-nums text-[var(--text-secondary)]">{b.runs}</td>
              <td className="py-2.5 px-3 text-right font-bold tabular-nums text-[var(--text-primary)]">{b.wickets}</td>
              <td className="py-2.5 pl-3 text-right tabular-nums text-[var(--text-secondary)]">{b.econ}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default function MatchDetail() {
  const { id } = useParams()
  const [match, setMatch] = useState(null)
  const [error, setError] = useState(false)
  const [offline, setOffline] = useState(false)

  useEffect(() => {
    let mounted = true
    api
      .getMatchLive(id)
      .then((m) => mounted && setMatch(m))
      .catch((err) => {
        if (!mounted) return
        setError(true)
        // A 404 is a genuinely unknown match; anything else is the API being offline.
        setOffline(!err?.status || err.status !== 404)
      })
    return () => {
      mounted = false
    }
  }, [id])

  if (error) {
    return (
      <Section title={offline ? 'Live backend offline' : 'Match not found'}>
        <Card hover={false} className="p-10 text-center">
          <p className="text-[var(--text-secondary)]">
            {offline
              ? 'This site has no live backend right now, so match details aren\'t available here. Run the app locally, or deploy the API + database (see docs/DEPLOY_BACKEND.md) to unlock real scorecards on this URL.'
              : "We couldn't find that match."}
          </p>
          <Button as={Link} to="/matches" className="mt-6">
            Back to matches
          </Button>
        </Card>
      </Section>
    )
  }

  if (!match) {
    return (
      <Section title="Loading match…">
        <Skeleton className="h-48" />
        <Skeleton className="mt-4 h-96" />
      </Section>
    )
  }

  const status = match.status || 'Scheduled'
  const live = status === 'Live' || match.live?.inProgress
  const innings = match.scorecard?.innings || []
  const t1 = match.team1?.name || 'Team A'
  const t2 = match.team2?.name || 'Team B'
  const ls = match.liveScore

  return (
    <Section eyebrow={match.series || 'Match Centre'} title={`${t1} vs ${t2}`}>
      <Link
        to="/matches"
        className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-[var(--text-muted)] transition hover:text-[#7EC8F2]"
      >
        <ArrowLeft className="h-4 w-4" /> Back to matches
      </Link>

      <Card className="p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone="sky">{match.format}</Badge>
              <Badge tone={STATUS_TONE[status]}>{status}</Badge>
              {live && (
                <span className="flex items-center gap-1.5 rounded-full bg-[#235D94]/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-[#7EC8F2]">
                  <span className="live-dot h-1.5 w-1.5 rounded-full bg-[#539AC1]" /> Live
                </span>
              )}
            </div>
            <p className="mt-3 flex items-center gap-2 text-sm text-[var(--text-muted)]">
              <MapPin className="h-3.5 w-3.5" />
              {[match.venue?.name, match.venue?.city, match.venue?.country].filter(Boolean).join(', ') || 'Venue TBD'}
            </p>
            <p className="mt-1 text-sm text-[var(--text-muted)]">
              {new Date(match.date).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}
            </p>
          </div>
          {ls?.summary && (
            <p className="rounded-xl bg-[var(--bg-glass)] px-4 py-2.5 text-sm font-medium text-[var(--text-secondary)]">
              {ls.summary}
            </p>
          )}
          {live && (
            <Button as={Link} to="/live" variant="secondary" size="sm">
              <Radio className="h-3.5 w-3.5" /> Match centre
            </Button>
          )}
        </div>
      </Card>

      {innings.length === 0 ? (
        <Card hover={false} className="mt-6 p-10 text-center text-[var(--text-muted)]">
          No scorecard yet — the match hasn't started.
        </Card>
      ) : (
        <div className="mt-6 space-y-6">
          {innings.map((inn, i) => (
            <Card key={i} className="overflow-hidden">
              <div className="flex items-center justify-between border-b border-[var(--border-subtle)] bg-[var(--bg-glass)]/60 px-6 py-4">
                <h3 className="flex items-center gap-2 font-display text-lg font-semibold text-[var(--text-primary)]">
                  <Users className="h-4 w-4 text-[#7EC8F2]" />
                  {inn.battingTeam} innings
                </h3>
                <div className="text-right">
                  <span className="font-display text-2xl font-bold text-[#7EC8F2]">
                    {inn.runs}/{inn.wickets}
                  </span>
                  <span className="ml-2 text-xs text-[var(--text-muted)]">({inn.overs} ov)</span>
                </div>
              </div>

              <div className="grid gap-0 lg:grid-cols-[1.6fr_1fr]">
                <div className="p-6">
                  <p className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                    Batting
                  </p>
                  <BattingTable inn={inn} />
                </div>
                <div className="border-t border-[var(--border-subtle)] p-6 lg:border-l lg:border-t-0">
                  <p className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                    Bowling — {inn.bowlingTeam}
                  </p>
                  <BowlingTable inn={inn} />
                  {inn.fallOfWickets?.length > 0 && (
                    <div className="mt-5">
                      <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                        Fall of wickets
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {inn.fallOfWickets.map((f, j) => (
                          <span
                            key={j}
                            className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-glass)] px-2.5 py-1 text-xs text-[var(--text-secondary)]"
                            title={`${f.batsman} · ${f.bowler}`}
                          >
                            {f.score}/{f.over}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {live && ls?.commentary?.length > 0 && (
        <Card className="mt-6 p-6">
          <h3 className="flex items-center gap-2 font-display text-lg font-semibold text-[var(--text-primary)]">
            <Radio className="h-4 w-4 text-[#7EC8F2]" /> Recent commentary
          </h3>
          <ul className="mt-4 space-y-2">
            {ls.commentary.slice(0, 8).map((c, i) => (
              <li key={i} className="flex gap-3 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-glass)] px-3 py-2 text-sm">
                <span className="shrink-0 rounded-md bg-white/10 px-1.5 py-0.5 font-mono text-[11px] text-[var(--text-muted)]">
                  {c.over}
                </span>
                <span className="text-[var(--text-secondary)]">{c.text}</span>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </Section>
  )
}
