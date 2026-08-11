import { LEGENDS, getLegendById } from '../data/legends'
import { useApp } from '../context/AppContext'
import Section from '../components/ui/Section'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Avatar from '../components/ui/Avatar'
import Badge from '../components/ui/Badge'
import EmptyState from '../components/ui/EmptyState'
import Select from '../components/ui/Select'
import { useState } from 'react'

export default function DreamTeam() {
  const { dreamTeam, addToDreamTeam, removeFromDreamTeam, clearDreamTeam, inDreamTeam } = useApp()
  const [pick, setPick] = useState('')
  const selected = dreamTeam.map((id) => getLegendById(id)).filter(Boolean)

  const roles = selected.reduce((acc, p) => {
    acc[p.role] = (acc[p.role] || 0) + 1
    return acc
  }, {})

  return (
    <Section
      eyebrow="Build Your XI"
      title="Dream Team Builder"
      description="Pick up to 11 legends. Your squad is saved locally and synced to your account when you're signed in."
    >
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="flex-1">
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]" htmlFor="pick-legend">
            Add legend
          </label>
          <Select
            id="pick-legend"
            value={pick}
            onChange={(e) => setPick(e.target.value)}
          >
            <option value="">Select a legend…</option>
            {LEGENDS.map((l) => (
              <option key={l.id} value={l.id} disabled={inDreamTeam(l.id) || dreamTeam.length >= 11}>
                {l.name} ({l.role})
              </option>
            ))}
          </Select>
        </div>
        <Button
          onClick={() => {
            if (pick) {
              addToDreamTeam(pick)
              setPick('')
            }
          }}
          disabled={!pick || dreamTeam.length >= 11}
        >
          Add to XI
        </Button>
        <Button variant="danger" onClick={clearDreamTeam} disabled={!dreamTeam.length}>
          Clear
        </Button>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        <Badge tone="brand">{selected.length}/11 selected</Badge>
        {Object.entries(roles).map(([role, count]) => (
          <Badge key={role} tone="muted">
            {role}: {count}
          </Badge>
        ))}
      </div>

      {selected.length === 0 ? (
        <EmptyState
          title="Your XI is empty"
          description="Add legends from the dropdown or from any player profile."
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {selected.map((p, i) => (
            <Card key={p.id} className="p-4">
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-500/15 text-sm font-bold text-orange-400">
                  {i + 1}
                </span>
                <Avatar name={p.name} src={p.image} size="sm" />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-[var(--text-primary)]">{p.name}</p>
                  <p className="text-xs text-[var(--text-muted)]">
                    {p.role} · {p.country}
                  </p>
                </div>
                <Button size="sm" variant="ghost" onClick={() => removeFromDreamTeam(p.id)}>
                  Remove
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </Section>
  )
}
