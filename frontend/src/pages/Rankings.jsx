import { ICC_RANKINGS } from '../data/legends'
import Section from '../components/ui/Section'
import Badge from '../components/ui/Badge'
import Seo from '../components/ui/Seo'

const FORMATS = [
  ['test', 'Test'],
  ['odi', 'ODI'],
  ['t20', 'T20'],
]

function RankingColumn({ title, rows }) {
  return (
    <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-glass)] p-4">
      <p className="mb-4 text-center text-xs font-bold uppercase tracking-[0.2em] text-orange-400">{title}</p>
      <ol className="space-y-2.5">
        {rows.map(([name, rating], i) => (
          <li key={name} className="flex items-center gap-3">
            <span
              className={
                i === 0
                  ? 'flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-amber-500/20 text-xs font-bold text-amber-300'
                  : 'flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[var(--bg-glass)] text-xs font-semibold text-[var(--text-muted)]'
              }
            >
              {i + 1}
            </span>
            <span className="min-w-0 flex-1 truncate text-sm font-medium text-[var(--text-primary)]">{name}</span>
            <span className="font-mono text-xs text-[var(--text-muted)]">{rating}</span>
          </li>
        ))}
      </ol>
    </div>
  )
}

function RankingGroup({ title, tone, data }) {
  return (
    <div>
      <div className="mb-4 flex items-center gap-3">
        <h2 className="font-display text-2xl font-semibold text-[var(--text-primary)]">{title}</h2>
        <Badge tone={tone}>Top 5</Badge>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {FORMATS.map(([key, label]) => (
          <RankingColumn key={key} title={`${label} · ${title}`} rows={data[key]} />
        ))}
      </div>
    </div>
  )
}

export default function Rankings() {
  return (
    <>
      <Seo path="/rankings" title="ICC Rankings" />
      <Section
        eyebrow="Form & Rating"
        title="ICC rankings"
        description="Curated top-5 lists across formats for batting, bowling, and all-round excellence."
      >
        <p className="-mt-4 mb-10 text-xs text-[var(--text-muted)]">
          {ICC_RANKINGS.asOf} — rating points are representative values for showcase.
        </p>
        <div className="space-y-12">
          <RankingGroup title="Batting" tone="gold" data={ICC_RANKINGS.batting} />
          <RankingGroup title="Bowling" tone="sky" data={ICC_RANKINGS.bowling} />
          <RankingGroup title="All-rounders" tone="emerald" data={ICC_RANKINGS.allRounder} />
        </div>
      </Section>
    </>
  )
}
