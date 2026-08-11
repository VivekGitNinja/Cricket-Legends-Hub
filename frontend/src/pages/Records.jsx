import { useEffect, useMemo, useState } from 'react'
import { RECORDS } from '../data/legends'
import { api } from '../lib/api'
import Section from '../components/ui/Section'
import Card from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import Skeleton from '../components/ui/Skeleton'

const FALLBACK = {
  batting: RECORDS.batting,
  bowling: RECORDS.bowling,
  team: RECORDS.team,
  women: RECORDS.women,
}

const TONES = { batting: 'gold', bowling: 'sky', team: 'emerald', women: 'rose', fielding: 'sky', partnership: 'gold' }

function RecordGroup({ title, items, tone }) {
  return (
    <div>
      <h3 className="mb-4 font-display text-xl font-semibold text-[var(--text-primary)]">{title}</h3>
      <div className="grid gap-3 sm:grid-cols-2">
        {items.map((r) => (
          <Card key={`${r.label}-${r.value}`} className="p-5">
            <Badge tone={tone}>{r.country || '—'}</Badge>
            <p className="mt-3 text-sm text-[var(--text-muted)]">{r.label}</p>
            <p className="mt-1 font-display text-2xl font-bold text-[var(--text-primary)]">{r.value}</p>
            <p className="mt-1 text-sm font-medium text-orange-400">{r.holder || r.player}</p>
            {(r.note || r.format) && (
              <p className="mt-1 text-xs text-[var(--text-muted)]">
                {[r.format, r.note].filter(Boolean).join(' · ')}
              </p>
            )}
          </Card>
        ))}
      </div>
    </div>
  )
}

export default function Records() {
  const [records, setRecords] = useState(null)
  const [source, setSource] = useState('local')

  useEffect(() => {
    let mounted = true
    api
      .getRecords()
      .then((items) => {
        if (!mounted || !items.length) return
        const grouped = items.reduce((acc, r) => {
          acc[r.category] = acc[r.category] || []
          acc[r.category].push(r)
          return acc
        }, {})
        setRecords(grouped)
        setSource('api')
      })
      .catch(() => {})
      .finally(() => mounted && setRecords((prev) => prev || FALLBACK))
    return () => {
      mounted = false
    }
  }, [])

  const groups = useMemo(() => {
    const data = records || FALLBACK
    const order = ['batting', 'bowling', 'team', 'women', 'fielding', 'partnership']
    return order
      .filter((k) => data[k]?.length)
      .map((k) => ({ key: k, items: data[k] }))
  }, [records])

  return (
    <Section
      eyebrow="Milestones"
      title="All-time records"
      description="Signature batting, bowling, and team landmarks that define cricket history."
      action={<Badge tone={source === 'api' ? 'emerald' : 'muted'}>{source === 'api' ? '● Live API data' : 'Offline archive'}</Badge>}
    >
      {!records ? (
        <div className="grid gap-3 sm:grid-cols-2">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
      ) : (
        <div className="space-y-12">
          {groups.map(({ key, items }) => (
            <RecordGroup
              key={key}
              title={`${key[0].toUpperCase()}${key.slice(1)} records`}
              items={items}
              tone={TONES[key]}
            />
          ))}
        </div>
      )}
    </Section>
  )
}
