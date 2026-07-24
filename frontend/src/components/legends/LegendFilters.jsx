import Input from '../ui/Input'
import Select from '../ui/Select'
import { COUNTRIES, ROLES } from '../../data/legends'

export default function LegendFilters({ filters, onChange }) {
  const set = (key, value) => onChange({ ...filters, [key]: value })

  return (
    <div className="grid gap-3 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-glass)] p-4 sm:grid-cols-2 lg:grid-cols-5">
      <div className="sm:col-span-2 lg:col-span-2">
        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]" htmlFor="legend-search">
          Search
        </label>
        <Input
          id="legend-search"
          value={filters.q}
          onChange={(e) => set('q', e.target.value)}
          placeholder="Name, nickname, country…"
        />
      </div>
      <div>
        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]" htmlFor="filter-country">
          Country
        </label>
        <Select id="filter-country" value={filters.country} onChange={(e) => set('country', e.target.value)}>
          <option value="">All countries</option>
          {COUNTRIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </Select>
      </div>
      <div>
        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]" htmlFor="filter-role">
          Role
        </label>
        <Select id="filter-role" value={filters.role} onChange={(e) => set('role', e.target.value)}>
          <option value="">All roles</option>
          {ROLES.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </Select>
      </div>
      <div>
        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]" htmlFor="filter-sort">
          Sort by
        </label>
        <Select id="filter-sort" value={filters.sort} onChange={(e) => set('sort', e.target.value)}>
          <option value="goat">GOAT Score</option>
          <option value="rank">Hall of Fame Rank</option>
          <option value="name">Name A–Z</option>
          <option value="testRuns">Test Runs</option>
          <option value="odiRuns">ODI Runs</option>
        </Select>
      </div>
    </div>
  )
}
