import { RECORDS } from '../data/legends'
import Section from '../components/ui/Section'
import Card from '../components/ui/Card'
import Badge from '../components/ui/Badge'

function RecordGroup({ title, items, tone }) {
  return (
    <div>
      <h3 className="mb-4 font-display text-xl font-semibold text-[var(--text-primary)]">{title}</h3>
      <div className="grid gap-3 sm:grid-cols-2">
        {items.map((r) => (
          <Card key={r.label} className="p-5">
            <Badge tone={tone}>{r.country}</Badge>
            <p className="mt-3 text-sm text-[var(--text-muted)]">{r.label}</p>
            <p className="mt-1 font-display text-2xl font-bold text-[var(--text-primary)]">{r.value}</p>
            <p className="mt-1 text-sm font-medium text-orange-400">{r.player}</p>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default function Records() {
  return (
    <Section
      eyebrow="Milestones"
      title="All-time records"
      description="Signature batting, bowling, and team landmarks that define cricket history."
    >
      <div className="space-y-12">
        <RecordGroup title="Batting records" items={RECORDS.batting} tone="gold" />
        <RecordGroup title="Bowling records" items={RECORDS.bowling} tone="sky" />
        <RecordGroup title="Team records" items={RECORDS.team} tone="emerald" />
      </div>
    </Section>
  )
}
