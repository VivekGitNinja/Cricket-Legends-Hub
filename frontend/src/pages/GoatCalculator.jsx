import { useMemo, useState } from 'react'
import { LEGENDS, getLegendById } from '../data/legends'
import { computeGoatBreakdown } from '../utils/goat'
import { formatAverage } from '../utils/format'
import Section from '../components/ui/Section'
import Select from '../components/ui/Select'
import Card from '../components/ui/Card'
import Avatar from '../components/ui/Avatar'
import Badge from '../components/ui/Badge'

const LABELS = {
  testRuns: 'Test runs volume',
  testAvg: 'Test average',
  testHundreds: 'Test hundreds',
  odiRuns: 'ODI runs volume',
  odiAvg: 'ODI average',
  odiHundreds: 'ODI hundreds',
  wickets: 'Career wickets',
  longevity: 'Longevity',
  peak: 'Peak rating',
  impact: 'Awards & impact',
}

export default function GoatCalculator() {
  const [id, setId] = useState(LEGENDS[0].id)
  const player = getLegendById(id) || LEGENDS[0]
  const breakdown = useMemo(() => computeGoatBreakdown(player), [player])

  return (
    <Section
      eyebrow="Model"
      title="GOAT Calculator"
      description="Transparent weighted scoring across formats, peak, longevity, and impact. Curated scores blend with the model for final ranking."
    >
      <div className="mb-6 max-w-md">
        <label htmlFor="goat-player" className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]">
          Select legend
        </label>
        <Select id="goat-player" value={id} onChange={(e) => setId(e.target.value)}>
          {LEGENDS.map((l) => (
            <option key={l.id} value={l.id}>
              {l.name}
            </option>
          ))}
        </Select>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card hover={false} className="p-6 lg:col-span-1">
          <div className="flex items-center gap-3">
            <Avatar name={player.name} src={player.image} size="lg" />
            <div>
              <h2 className="font-display text-xl font-semibold text-[var(--text-primary)]">
                {player.name}
              </h2>
              <p className="text-sm text-[var(--text-muted)]">
                {player.country} · {player.role}
              </p>
            </div>
          </div>
          <div className="mt-6 text-center">
            <p className="text-xs uppercase tracking-wider text-[var(--text-muted)]">Final GOAT</p>
            <p className="font-display text-5xl font-bold text-orange-400">{breakdown.score}</p>
            <div className="mt-3 flex justify-center gap-2">
              <Badge tone="muted">Model {breakdown.modelScore}</Badge>
              <Badge tone="gold">Curated {breakdown.curated ?? '—'}</Badge>
            </div>
          </div>
        </Card>

        <Card hover={false} className="p-6 lg:col-span-2">
          <h3 className="font-display text-lg font-semibold text-[var(--text-primary)]">
            Weighted breakdown
          </h3>
          <ul className="mt-5 space-y-4">
            {Object.entries(breakdown.weights).map(([key, weight]) => {
              const raw = breakdown.parts[key] || 0
              const contrib = breakdown.weighted[key] || 0
              return (
                <li key={key}>
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span className="text-[var(--text-secondary)]">
                      {LABELS[key] || key}{' '}
                      <span className="text-[var(--text-muted)]">
                        (w={formatAverage(weight * 100, 0)}%)
                      </span>
                    </span>
                    <span className="font-semibold text-[var(--text-primary)]">
                      {formatAverage(raw, 0)} → +{formatAverage(contrib)}
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-white/5">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-sky-500 to-orange-400"
                      style={{ width: `${Math.min(100, raw)}%` }}
                    />
                  </div>
                </li>
              )
            })}
          </ul>
        </Card>
      </div>
    </Section>
  )
}
