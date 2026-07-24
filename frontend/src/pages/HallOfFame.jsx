import { Link } from 'react-router-dom'
import { LEGENDS } from '../data/legends'
import { rankLegends } from '../utils/goat'
import Section from '../components/ui/Section'
import Card from '../components/ui/Card'
import Avatar from '../components/ui/Avatar'
import Badge from '../components/ui/Badge'

export default function HallOfFame() {
  const ranked = rankLegends(LEGENDS)

  return (
    <Section
      eyebrow="Immortals"
      title="Hall of Fame"
      description="Ranked by a transparent GOAT model blending career volume, peak, longevity, and curated excellence."
    >
      <div className="space-y-3">
        {ranked.map((legend, index) => (
          <Card key={legend.id} className="p-4 sm:p-5">
            <Link to={`/legends/${legend.id}`} className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="flex items-center gap-4">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500/20 to-amber-400/20 font-display text-lg font-bold text-amber-300">
                  {index + 1}
                </span>
                <Avatar name={legend.name} src={legend.image} />
                <div>
                  <h3 className="font-display text-lg font-semibold text-[var(--text-primary)]">
                    {legend.name}
                  </h3>
                  <p className="text-sm text-[var(--text-muted)]">
                    {legend.country} · {legend.role} · {legend.era}
                  </p>
                </div>
              </div>
              <div className="flex flex-1 flex-wrap items-center gap-2 sm:justify-end">
                {(legend.tags || []).slice(0, 2).map((t) => (
                  <Badge key={t} tone={t === 'GOAT' ? 'gold' : 'muted'}>
                    {t}
                  </Badge>
                ))}
                <span className="rounded-xl bg-orange-500/15 px-3 py-1.5 text-sm font-bold text-orange-300">
                  {legend._goat}
                </span>
              </div>
            </Link>
          </Card>
        ))}
      </div>
    </Section>
  )
}
