import { MATCHES } from '../data/legends'
import Section from '../components/ui/Section'
import Card from '../components/ui/Card'
import Badge from '../components/ui/Badge'

export default function Matches() {
  return (
    <Section
      eyebrow="Archive"
      title="Greatest matches"
      description="A living archive of cricket’s most unforgettable contests."
    >
      <div className="grid gap-4 md:grid-cols-2">
        {MATCHES.map((m) => (
          <Card key={m.id} className="p-6">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="font-display text-xl font-semibold text-[var(--text-primary)]">
                  {m.teamA} vs {m.teamB}
                </h3>
                <p className="mt-1 text-sm text-[var(--text-muted)]">{m.title}</p>
              </div>
              <Badge tone="sky">{m.format}</Badge>
            </div>
            <div className="mt-4 flex items-center justify-between text-sm text-[var(--text-secondary)]">
              <span>{m.scoreA}</span>
              <span className="text-[var(--text-muted)]">vs</span>
              <span>{m.scoreB}</span>
            </div>
            <p className="mt-4 text-sm text-[var(--text-secondary)]">{m.highlight}</p>
            <div className="mt-5 flex items-center justify-between border-t border-[var(--border-subtle)] pt-4 text-xs text-[var(--text-muted)]">
              <span>{m.venue}</span>
              <span className="font-semibold capitalize text-emerald-400">{m.status}</span>
            </div>
            <p className="mt-2 text-sm font-medium text-orange-400">{m.result}</p>
          </Card>
        ))}
      </div>
    </Section>
  )
}
