import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { LEGENDS } from '../data/legends'
import { stagger } from '../animations/variants'
import LegendCard from '../components/legends/LegendCard'
import LegendFilters from '../components/legends/LegendFilters'
import EmptyState from '../components/ui/EmptyState'
import Section from '../components/ui/Section'

export default function Legends() {
  const [filters, setFilters] = useState({
    q: '',
    country: '',
    role: '',
    sort: 'goat',
  })

  const list = useMemo(() => {
    let items = [...LEGENDS]
    const q = filters.q.trim().toLowerCase()
    if (q) {
      items = items.filter((l) =>
        [l.name, l.fullName, l.nickName, l.country, l.role, ...(l.tags || [])]
          .join(' ')
          .toLowerCase()
          .includes(q)
      )
    }
    if (filters.country) items = items.filter((l) => l.country === filters.country)
    if (filters.role) items = items.filter((l) => l.role === filters.role)

    items.sort((a, b) => {
      switch (filters.sort) {
        case 'name':
          return a.name.localeCompare(b.name)
        case 'rank':
          return a.hallOfFameRank - b.hallOfFameRank
        case 'testRuns':
          return (b.stats?.test?.runs || 0) - (a.stats?.test?.runs || 0)
        case 'odiRuns':
          return (b.stats?.odi?.runs || 0) - (a.stats?.odi?.runs || 0)
        case 'goat':
        default:
          return (b.goatScore || 0) - (a.goatScore || 0)
      }
    })
    return items
  }, [filters])

  return (
    <Section
      eyebrow="Collection"
      title="All Legends"
      description={`Browse ${LEGENDS.length} curated icons with filters, sorting, and favorites.`}
    >
      <LegendFilters filters={filters} onChange={setFilters} />
      <p className="mt-4 text-sm text-[var(--text-muted)]">
        Showing <strong className="text-[var(--text-primary)]">{list.length}</strong> legends
      </p>
      {list.length === 0 ? (
        <div className="mt-8">
          <EmptyState
            title="No legends match"
            description="Try clearing filters or searching a different name."
            actionLabel="Reset filters"
            onAction={() => setFilters({ q: '', country: '', role: '', sort: 'goat' })}
          />
        </div>
      ) : (
        <motion.div
          initial="hidden"
          animate="show"
          variants={stagger}
          className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
        >
          {list.map((legend, i) => (
            <LegendCard key={legend.id} legend={legend} index={i} />
          ))}
        </motion.div>
      )}
    </Section>
  )
}
