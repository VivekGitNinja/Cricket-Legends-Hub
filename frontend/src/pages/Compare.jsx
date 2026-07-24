import { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { LEGENDS, getLegendById } from '../data/legends'
import { comparePlayers } from '../utils/goat'
import { formatAverage, formatNumber } from '../utils/format'
import Section from '../components/ui/Section'
import Select from '../components/ui/Select'
import Card from '../components/ui/Card'
import Avatar from '../components/ui/Avatar'
import Badge from '../components/ui/Badge'
import StatsBars from '../components/charts/StatsBars'

export default function Compare() {
  const [params, setParams] = useSearchParams()
  const aId = params.get('a') || LEGENDS[0].id
  const bId = params.get('b') || LEGENDS[1].id
  const playerA = getLegendById(aId) || LEGENDS[0]
  const playerB = getLegendById(bId) || LEGENDS[1]

  const comparison = useMemo(() => comparePlayers(playerA, playerB), [playerA, playerB])

  const setPlayer = (key, value) => {
    const next = new URLSearchParams(params)
    next.set(key, value)
    setParams(next, { replace: true })
  }

  return (
    <Section
      eyebrow="Head-to-Head"
      title="Compare legends"
      description="Transparent GOAT scoring with career metrics and interactive charts."
    >
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]" htmlFor="player-a">
            Player A
          </label>
          <Select id="player-a" value={playerA.id} onChange={(e) => setPlayer('a', e.target.value)}>
            {LEGENDS.map((l) => (
              <option key={l.id} value={l.id}>
                {l.name}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]" htmlFor="player-b">
            Player B
          </label>
          <Select id="player-b" value={playerB.id} onChange={(e) => setPlayer('b', e.target.value)}>
            {LEGENDS.map((l) => (
              <option key={l.id} value={l.id}>
                {l.name}
              </option>
            ))}
          </Select>
        </div>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {[playerA, playerB].map((p, i) => {
          const score = i === 0 ? comparison.left.score : comparison.right.score
          const winner =
            (i === 0 && comparison.winner === 'a') || (i === 1 && comparison.winner === 'b')
          return (
            <Card key={p.id} hover={false} className="p-5">
              <div className="flex items-center gap-3">
                <Avatar name={p.name} src={p.image} />
                <div>
                  <h3 className="font-display text-xl font-semibold text-[var(--text-primary)]">
                    {p.name}
                  </h3>
                  <p className="text-sm text-[var(--text-muted)]">
                    {p.country} · {p.role}
                  </p>
                </div>
                {winner && <Badge tone="gold" className="ml-auto">Winner</Badge>}
              </div>
              <p className="mt-4 font-display text-3xl font-bold text-orange-400">{score}</p>
              <p className="text-xs uppercase tracking-wider text-[var(--text-muted)]">GOAT Score</p>
            </Card>
          )
        })}
      </div>

      <Card hover={false} className="mt-8 overflow-x-auto p-5">
        <h3 className="mb-4 font-display text-lg font-semibold text-[var(--text-primary)]">
          Metric breakdown
        </h3>
        <table className="w-full min-w-[520px] text-left text-sm">
          <thead>
            <tr className="border-b border-[var(--border-subtle)] text-[var(--text-muted)]">
              <th className="py-3 font-medium">Metric</th>
              <th className="py-3 font-medium">{playerA.name}</th>
              <th className="py-3 font-medium">{playerB.name}</th>
            </tr>
          </thead>
          <tbody>
            {comparison.metrics.map((m) => {
              const aWin = m.a > m.b
              const bWin = m.b > m.a
              const fmt = (v) =>
                String(m.key).includes('Avg') || m.key === 'goat'
                  ? formatAverage(v)
                  : formatNumber(v)
              return (
                <tr key={m.key} className="border-b border-[var(--border-subtle)]/60">
                  <td className="py-3 text-[var(--text-secondary)]">{m.label}</td>
                  <td className={`py-3 font-semibold ${aWin ? 'text-orange-400' : 'text-[var(--text-primary)]'}`}>
                    {fmt(m.a)}
                  </td>
                  <td className={`py-3 font-semibold ${bWin ? 'text-sky-400' : 'text-[var(--text-primary)]'}`}>
                    {fmt(m.b)}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </Card>

      <Card hover={false} className="mt-8 p-5">
        <h3 className="mb-4 font-display text-lg font-semibold text-[var(--text-primary)]">
          Visual comparison
        </h3>
        <StatsBars playerA={playerA} playerB={playerB} />
      </Card>
    </Section>
  )
}
