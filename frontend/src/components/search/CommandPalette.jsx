import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BookOpen, Heart, Search, Trophy, Users, Zap } from 'lucide-react'
import { NAV_LINKS } from '../../config/site'
import { useApp } from '../../context/AppContext'
import { api } from '../../lib/api'
import { searchLegends } from '../../data/legends'
import PlayerAvatar from '../ui/PlayerAvatar'
import { cn } from '../../utils/cn'

const QUICK = [
  { label: 'Hall of Fame', to: '/hall-of-fame', icon: Trophy },
  { label: 'Compare Legends', to: '/compare', icon: Users },
  { label: 'GOAT Calculator', to: '/goat', icon: Trophy },
  { label: 'Countries', to: '/countries', icon: Users },
  { label: 'Dream Team', to: '/dream-team', icon: Zap },
  { label: 'Favorites', to: '/favorites', icon: Heart },
  { label: 'Quiz', to: '/quiz', icon: BookOpen },
]

export default function CommandPalette() {
  const { commandOpen, setCommandOpen } = useApp()
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(0)
  const [apiPlayers, setApiPlayers] = useState([])
  const [searching, setSearching] = useState(false)
  const navigate = useNavigate()
  const debounceRef = useRef(null)

  // Live search across the full backend catalog (340+ players, any country/era)
  useEffect(() => {
    if (!commandOpen) {
      setApiPlayers([])
      return undefined
    }
    const q = query.trim()
    if (!q) {
      setApiPlayers([])
      setSearching(false)
      return undefined
    }
    setSearching(true)
    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      api
        .searchPlayers(q)
        .then((players) => setApiPlayers(Array.isArray(players) ? players.slice(0, 8) : []))
        .catch(() => setApiPlayers([]))
        .finally(() => setSearching(false))
    }, 250)
    return () => clearTimeout(debounceRef.current)
  }, [query, commandOpen])

  const results = useMemo(() => {
    const legends = searchLegends(query).slice(0, 6).map((l) => ({
      type: 'legend',
      id: l.id,
      label: l.name,
      meta: `${l.country} · ${l.role}`,
      to: `/legends/${l.id}`,
    }))
    const catalog = apiPlayers.map((p) => ({
      type: 'player',
      id: p._id,
      label: p.name,
      meta: `${p.country} · ${p.role}${p.isLegend ? ' · Legend' : ''}`,
      to: `/players/${p._id}`,
      photo: p.imageUrl,
    }))
    const pages = NAV_LINKS.filter((l) =>
      l.label.toLowerCase().includes(query.toLowerCase())
    ).map((l) => ({
      type: 'page',
      id: l.to,
      label: l.label,
      meta: 'Page',
      to: l.to,
    }))
    const quick = !query
      ? QUICK.map((q) => ({ type: 'quick', id: q.to, label: q.label, meta: 'Quick action', to: q.to, icon: q.icon }))
      : []
    return [...quick, ...pages, ...catalog, ...legends]
  }, [query, apiPlayers])

  useEffect(() => {
    if (!commandOpen) {
      setQuery('')
      setActive(0)
    }
  }, [commandOpen])

  const go = useCallback(
    (to) => {
      navigate(to)
      setCommandOpen(false)
    },
    [navigate, setCommandOpen]
  )

  useEffect(() => {
    setActive(0)
  }, [query])

  useEffect(() => {
    if (!commandOpen) return undefined
    const onKey = (e) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setActive((i) => Math.min(i + 1, Math.max(results.length - 1, 0)))
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault()
        setActive((i) => Math.max(i - 1, 0))
      }
      if (e.key === 'Enter' && results[active]) {
        e.preventDefault()
        go(results[active].to)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [commandOpen, results, active, go])

  if (!commandOpen) return null

  return (
    <div className="fixed inset-0 z-[var(--z-command)] flex items-start justify-center px-4 pt-[12vh]">
      <button
        type="button"
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        aria-label="Close command palette"
        onClick={() => setCommandOpen(false)}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
        className="relative w-full max-w-xl overflow-hidden rounded-2xl border border-[var(--border-strong)] bg-[var(--bg-elevated)] shadow-[var(--shadow-lg)]"
      >
        <div className="flex items-center gap-3 border-b border-[var(--border-subtle)] px-4">
          <Search className="h-4 w-4 text-[var(--text-muted)]" aria-hidden="true" />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search any player, legend, page, action… (340+ players)"
            className="w-full bg-transparent py-4 text-sm text-[var(--text-primary)] outline-none placeholder:text-[var(--text-muted)]"
            aria-label="Search"
          />
          <kbd className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-[10px] text-[var(--text-muted)]">
            ESC
          </kbd>
        </div>
        <ul className="max-h-80 overflow-y-auto p-2" role="listbox">
          {results.length === 0 && (
            <li className="px-3 py-8 text-center text-sm text-[var(--text-muted)]">
              {searching ? 'Searching players…' : 'No results'}
            </li>
          )}
          {results.map((item, index) => {
            const Icon = item.icon
            return (
              <li key={`${item.type}-${item.id}`}>
                <button
                  type="button"
                  role="option"
                  aria-selected={index === active}
                  onMouseEnter={() => setActive(index)}
                  onClick={() => go(item.to)}
                  className={cn(
                    'flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left transition',
                    index === active
                      ? 'bg-orange-500/15 text-orange-300'
                      : 'text-[var(--text-secondary)] hover:bg-[var(--bg-glass)]'
                  )}
                >
                  <span className="flex min-w-0 items-center gap-3">
                    {item.type === 'player' ? (
                      <PlayerAvatar name={item.label} src={item.photo} size="sm" className="shrink-0 ring-1 ring-white/10" />
                    ) : Icon ? (
                      <Icon className="h-4 w-4 shrink-0" />
                    ) : (
                      <Search className="h-4 w-4 shrink-0 opacity-50" />
                    )}
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-medium text-[var(--text-primary)]">
                        {item.label}
                      </span>
                      <span className="truncate text-xs text-[var(--text-muted)]">{item.meta}</span>
                    </span>
                  </span>
                  <span className="ml-2 shrink-0 text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
                    {item.type === 'player' ? 'Player' : item.type}
                  </span>
                </button>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}
