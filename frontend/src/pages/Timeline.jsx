import { CRICKET_TIMELINE } from '../data/legends'
import Section from '../components/ui/Section'
import Card from '../components/ui/Card'

export default function Timeline() {
  return (
    <Section
      eyebrow="History"
      title="Cricket timeline"
      description="A century-spanning journey from the first Test to modern franchise cricket."
    >
      <ol className="relative space-y-6 border-l border-[var(--border-subtle)] pl-6 md:pl-8">
        {CRICKET_TIMELINE.map((item) => (
          <li key={item.year} className="relative">
            <span className="absolute -left-[1.9rem] top-4 h-3.5 w-3.5 rounded-full bg-gradient-to-br from-orange-400 to-rose-500 ring-4 ring-orange-500/15 md:-left-[2.15rem]" />
            <Card className="p-5">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-400">
                {item.year}
              </p>
              <h3 className="mt-1 font-display text-xl font-semibold text-[var(--text-primary)]">
                {item.title}
              </h3>
              <p className="mt-2 text-sm text-[var(--text-secondary)]">{item.detail}</p>
            </Card>
          </li>
        ))}
      </ol>
    </Section>
  )
}
