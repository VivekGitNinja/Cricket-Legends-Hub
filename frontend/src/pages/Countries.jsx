import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { LEGENDS } from '../data/legends'
import { formatNumber } from '../utils/format'
import Section from '../components/ui/Section'
import Card from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import Avatar from '../components/ui/Avatar'

export default function Countries() {
  const countries = useMemo(() => {
    const map = new Map()
    for (const l of LEGENDS) {
      const key = l.country
      if (!map.has(key)) {
        map.set(key, {
          name: key,
          code: l.countryCode || key.slice(0, 2).toUpperCase(),
          legends: [],
          testRuns: 0,
          odiRuns: 0,
          wickets: 0,
          avgGoat: 0,
        })
      }
      const c = map.get(key)
      c.legends.push(l)
      c.testRuns += l.stats?.test?.runs || 0
      c.odiRuns += l.stats?.odi?.runs || 0
      c.wickets += (l.stats?.test?.wickets || 0) + (l.stats?.odi?.wickets || 0)
    }
    return [...map.values()]
      .map((c) => ({
        ...c,
        avgGoat: Number(
          (c.legends.reduce((s, l) => s + (l.goatScore || 0), 0) / c.legends.length).toFixed(1)
        ),
        count: c.legends.length,
      }))
      .sort((a, b) => b.avgGoat - a.avgGoat || b.count - a.count)
  }, [])

  const maxGoat = Math.max(...countries.map((c) => c.avgGoat), 1)

  return (
    <Section
      eyebrow="Nations"
      title="Country statistics"
      description="Aggregate excellence by nation — legends count, run volume, wickets, and average GOAT score."
    >
      <div className="grid gap-5 lg:grid-cols-2">
        {countries.map((c) => (
          <Card key={c.name} className="p-6">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500/15 font-display text-sm font-bold text-orange-300">
                    {c.code}
                  </span>
                  <div>
                    <h3 className="font-display text-xl font-semibold text-[var(--text-primary)]">
                      {c.name}
                    </h3>
                    <p className="text-sm text-[var(--text-muted)]">
                      {c.count} legend{c.count === 1 ? '' : 's'}
                    </p>
                  </div>
                </div>
              </div>
              <Badge tone="gold">GOAT {c.avgGoat}</Badge>
            </div>

            <div
              className="mt-4 h-2 overflow-hidden rounded-full bg-white/5"
              role="img"
              aria-label={`Average GOAT score ${c.avgGoat}`}
            >
              <div
                className="h-full rounded-full bg-gradient-to-r from-orange-500 to-amber-400"
                style={{ width: `${(c.avgGoat / maxGoat) * 100}%` }}
              />
            </div>

            <div className="mt-4 grid grid-cols-3 gap-2 text-center">
              <div className="rounded-xl bg-[var(--bg-glass)] p-3">
                <div className="text-sm font-bold text-[var(--text-primary)]">
                  {formatNumber(c.testRuns)}
                </div>
                <div className="text-[10px] uppercase tracking-wide text-[var(--text-muted)]">
                  Test runs
                </div>
              </div>
              <div className="rounded-xl bg-[var(--bg-glass)] p-3">
                <div className="text-sm font-bold text-[var(--text-primary)]">
                  {formatNumber(c.odiRuns)}
                </div>
                <div className="text-[10px] uppercase tracking-wide text-[var(--text-muted)]">
                  ODI runs
                </div>
              </div>
              <div className="rounded-xl bg-[var(--bg-glass)] p-3">
                <div className="text-sm font-bold text-[var(--text-primary)]">
                  {formatNumber(c.wickets)}
                </div>
                <div className="text-[10px] uppercase tracking-wide text-[var(--text-muted)]">
                  Wickets
                </div>
              </div>
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              {c.legends
                .sort((a, b) => (b.goatScore || 0) - (a.goatScore || 0))
                .map((l) => (
                  <Link
                    key={l.id}
                    to={`/legends/${l.id}`}
                    className="flex items-center gap-2 rounded-full border border-[var(--border-subtle)] bg-[var(--bg-glass)] py-1 pl-1 pr-3 transition hover:border-orange-500/40"
                  >
                    <Avatar name={l.name} src={l.image} size="sm" className="!h-7 !w-7" />
                    <span className="text-xs font-medium text-[var(--text-secondary)]">{l.name}</span>
                  </Link>
                ))}
            </div>
          </Card>
        ))}
      </div>
    </Section>
  )
}
