import { Trophy } from 'lucide-react'
import { WORLD_CUPS } from '../data/legends'
import Section from '../components/ui/Section'
import Card from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import Seo from '../components/ui/Seo'

function CupEdition({ cup }) {
  return (
    <Card className="p-5">
      <div className="flex items-center justify-between gap-2">
        <span className="font-display text-2xl font-bold text-orange-400">{cup.year}</span>
        <Badge tone="muted">{cup.host}</Badge>
      </div>
      <div className="mt-4 flex items-center gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-500/15 text-amber-400">
          <Trophy className="h-4 w-4" />
        </span>
        <div>
          <p className="text-sm font-semibold text-[var(--text-primary)]">{cup.winner}</p>
          <p className="text-xs text-[var(--text-muted)]">defeated {cup.runnerUp}</p>
        </div>
      </div>
      <p className="mt-3 text-sm font-medium text-emerald-400">{cup.finalResult}</p>
      <p className="mt-1 text-xs text-[var(--text-muted)]">{cup.venue}</p>
      {cup.playerOfTournament && (
        <p className="mt-3 text-xs text-[var(--text-secondary)]">
          Player of the tournament: <span className="font-semibold text-orange-400">{cup.playerOfTournament}</span>
        </p>
      )}
    </Card>
  )
}

export default function WorldCups() {
  return (
    <>
      <Seo path="/world-cups" title="World Cup History" />
      <Section
        eyebrow="Trophy Cabinet"
        title="World Cup history"
        description="Every edition of the men’s ODI and T20 World Cups — winners, runners-up, finals, and the players of the tournament."
      >
        <div className="space-y-12">
          <div>
            <div className="mb-5 flex items-center gap-3">
              <h2 className="font-display text-2xl font-semibold text-[var(--text-primary)]">ODI World Cup</h2>
              <Badge tone="gold">1975 – 2023</Badge>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {WORLD_CUPS.odi.map((cup) => (
                <CupEdition key={cup.year} cup={cup} />
              ))}
            </div>
          </div>

          <div>
            <div className="mb-5 flex items-center gap-3">
              <h2 className="font-display text-2xl font-semibold text-[var(--text-primary)]">T20 World Cup</h2>
              <Badge tone="sky">2007 – 2024</Badge>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {WORLD_CUPS.t20.map((cup) => (
                <CupEdition key={cup.year} cup={cup} />
              ))}
            </div>
          </div>
        </div>
      </Section>
    </>
  )
}
