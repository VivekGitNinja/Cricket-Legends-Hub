import { Link, useParams } from 'react-router-dom'
import { Download, Heart, Printer, Share2, Star, Users } from 'lucide-react'
import { getLegendById } from '../data/legends'
import { useApp } from '../context/AppContext'
import { computeGoatBreakdown } from '../utils/goat'
import { formatAverage, formatNumber } from '../utils/format'
import { downloadCsv, downloadJson, legendToExportRows, printPage, shareText } from '../utils/export'
import Avatar from '../components/ui/Avatar'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import CareerRadar from '../components/charts/CareerRadar'
import EmptyState from '../components/ui/EmptyState'
import Section from '../components/ui/Section'
import Seo from '../components/ui/Seo'
import StatPill from '../components/ui/StatPill'

export default function LegendDetail() {
  const { id } = useParams()
  const legend = getLegendById(id)
  const { isFavorite, toggleFavorite, addToDreamTeam, inDreamTeam } = useApp()

  if (!legend) {
    return (
      <Section title="Legend not found">
        <EmptyState
          title="Player not found"
          description="This legend profile does not exist in the collection."
        />
        <div className="mt-6 text-center">
          <Button as={Link} to="/legends" variant="secondary">
            Browse legends
          </Button>
        </div>
      </Section>
    )
  }

  const goat = computeGoatBreakdown(legend)
  const fav = isFavorite(legend.id)

  const share = async () => {
    const result = await shareText({
      title: legend.name,
      text: legend.bio,
      url: window.location.href,
    })
    if (result === 'copied') {
      // eslint-disable-next-line no-alert
      window.alert('Profile link copied to clipboard')
    }
  }

  const exportStats = (format) => {
    const rows = legendToExportRows(legend)
    if (format === 'csv') downloadCsv(`${legend.id}-stats.csv`, rows)
    else downloadJson(`${legend.id}-stats.json`, { legend, exportedAt: new Date().toISOString() })
  }

  return (
    <div className="pb-16 print:bg-white">
      <Seo
        title={legend.name}
        description={legend.bio}
        path={`/legends/${legend.id}`}
        type="profile"
      />
      <section className="border-b border-[var(--border-subtle)] bg-white/[0.02] py-12">
        <div className="mx-auto flex max-w-[var(--container)] flex-col gap-8 px-4 sm:px-6 lg:flex-row lg:items-center lg:px-8">
          <Avatar name={legend.name} src={legend.image} size="xl" className="shrink-0" />
          <div className="flex-1">
            <div className="flex flex-wrap gap-2">
              <Badge tone="gold">#{legend.hallOfFameRank} Hall of Fame</Badge>
              <Badge tone="brand">{legend.role}</Badge>
              <Badge tone="muted">{legend.era}</Badge>
            </div>
            <h1 className="mt-3 font-display text-3xl font-bold text-[var(--text-primary)] md:text-5xl">
              {legend.name}
            </h1>
            <p className="mt-1 text-[var(--text-muted)]">
              {legend.fullName} · “{legend.nickName}” · {legend.country}
            </p>
            <p className="mt-4 max-w-3xl text-[var(--text-secondary)]">{legend.bio}</p>
            <div className="mt-6 flex flex-wrap gap-2">
              <Button
                variant={fav ? 'danger' : 'secondary'}
                onClick={() => toggleFavorite(legend.id)}
              >
                <Heart className={fav ? 'h-4 w-4 fill-current' : 'h-4 w-4'} />
                {fav ? 'Favorited' : 'Favorite'}
              </Button>
              <Button
                variant="secondary"
                disabled={inDreamTeam(legend.id)}
                onClick={() => addToDreamTeam(legend.id)}
              >
                <Users className="h-4 w-4" />
                {inDreamTeam(legend.id) ? 'In Dream Team' : 'Add to XI'}
              </Button>
              <Button as={Link} to={`/compare?a=${legend.id}`} variant="primary">
                Compare
              </Button>
              <Button variant="ghost" onClick={share}>
                <Share2 className="h-4 w-4" /> Share
              </Button>
              <Button variant="ghost" onClick={() => exportStats('csv')} className="print:hidden">
                <Download className="h-4 w-4" /> CSV
              </Button>
              <Button variant="ghost" onClick={() => exportStats('json')} className="print:hidden">
                <Download className="h-4 w-4" /> JSON
              </Button>
              <Button variant="ghost" onClick={printPage} className="print:hidden">
                <Printer className="h-4 w-4" /> Print
              </Button>
            </div>
          </div>
          <Card hover={false} className="w-full max-w-xs p-5 text-center lg:w-auto">
            <div className="flex items-center justify-center gap-2 text-amber-300">
              <Star className="h-5 w-5 fill-current" />
              <span className="font-display text-4xl font-bold">{goat.score}</span>
            </div>
            <p className="mt-1 text-xs uppercase tracking-wider text-[var(--text-muted)]">
              GOAT Score
            </p>
            <p className="mt-3 text-xs text-[var(--text-secondary)]">
              Model {goat.modelScore} · Curated {goat.curated ?? '—'}
            </p>
          </Card>
        </div>
      </section>

      <Section eyebrow="Career" title="Format statistics">
        <div className="grid gap-4 md:grid-cols-3">
          {['test', 'odi', 't20'].map((fmt) => {
            const s = legend.stats?.[fmt] || {}
            return (
              <Card key={fmt} hover={false} className="p-5">
                <h3 className="font-display text-lg font-semibold uppercase text-orange-400">
                  {fmt}
                </h3>
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <StatPill label="Matches" value={formatNumber(s.matches)} />
                  <StatPill label="Runs" value={formatNumber(s.runs)} />
                  <StatPill label="Average" value={formatAverage(s.average)} />
                  <StatPill label="Hundreds" value={formatNumber(s.hundreds)} />
                  <StatPill label="Wickets" value={formatNumber(s.wickets)} />
                  <StatPill label="Highest" value={formatNumber(s.highest)} />
                </div>
              </Card>
            )
          })}
        </div>
      </Section>

      <Section eyebrow="Profile" title="Skill radar & journey" className="bg-white/[0.02]">
        <div className="grid gap-6 lg:grid-cols-2">
          <Card hover={false} className="p-5">
            <h3 className="mb-2 font-display text-lg font-semibold text-[var(--text-primary)]">
              Career radar
            </h3>
            <CareerRadar player={legend} />
          </Card>
          <Card hover={false} className="p-5">
            <h3 className="mb-4 font-display text-lg font-semibold text-[var(--text-primary)]">
              Career timeline
            </h3>
            <ol className="relative space-y-6 border-l border-[var(--border-subtle)] pl-6">
              {(legend.milestones || []).map((m) => (
                <li key={`${m.year}-${m.title}`} className="relative">
                  <span className="absolute -left-[1.9rem] top-1 h-3 w-3 rounded-full bg-orange-500 ring-4 ring-orange-500/20" />
                  <p className="text-xs font-semibold uppercase tracking-wider text-orange-400">
                    {m.year}
                  </p>
                  <p className="font-medium text-[var(--text-primary)]">{m.title}</p>
                  <p className="text-sm text-[var(--text-secondary)]">{m.detail}</p>
                </li>
              ))}
            </ol>
          </Card>
        </div>
      </Section>

      <Section eyebrow="Legacy" title="Awards & greatest innings">
        <div className="grid gap-6 md:grid-cols-2">
          <Card hover={false} className="p-5">
            <h3 className="font-display text-lg font-semibold text-[var(--text-primary)]">Awards</h3>
            <ul className="mt-4 space-y-2">
              {(legend.awards || []).map((a) => (
                <li
                  key={a}
                  className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-glass)] px-4 py-3 text-sm text-[var(--text-secondary)]"
                >
                  {a}
                </li>
              ))}
            </ul>
          </Card>
          <Card hover={false} className="p-5">
            <h3 className="font-display text-lg font-semibold text-[var(--text-primary)]">
              Greatest innings
            </h3>
            <ul className="mt-4 space-y-3">
              {(legend.greatestInnings || []).map((g) => (
                <li
                  key={g.title}
                  className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-glass)] px-4 py-3"
                >
                  <p className="font-medium text-[var(--text-primary)]">{g.title}</p>
                  <p className="text-xs text-[var(--text-muted)]">
                    {g.year} · {g.format} · {g.venue}
                  </p>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </Section>
    </div>
  )
}
