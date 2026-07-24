import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { Command, Heart, Menu, Moon, Search, Sun, X } from 'lucide-react'
import { NAV_LINKS } from '../../config/site'
import { useApp } from '../../context/AppContext'
import { useTheme } from '../../context/ThemeContext'
import { cn } from '../../utils/cn'
import Button from '../ui/Button'

const primaryLinks = NAV_LINKS.filter((l) =>
  ['/', '/legends', '/compare', '/hall-of-fame', '/dream-team', '/quiz'].includes(l.to)
)

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const { setCommandOpen, favorites } = useApp()
  const { resolved, cycleTheme } = useTheme()

  return (
    <header className="sticky top-0 z-[var(--z-header)] border-b border-[var(--border-subtle)] bg-[var(--bg-panel)] backdrop-blur-xl">
      <div className="mx-auto flex h-[var(--header-h)] max-w-[var(--container)] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link to="/" className="group flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-rose-600 text-sm font-black text-white shadow-[var(--shadow-glow)]">
            CL
          </span>
          <span className="font-display text-lg font-bold tracking-tight text-[var(--text-primary)] group-hover:text-orange-400 transition-colors">
            Cricket Legends
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
          {primaryLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              className={({ isActive }) =>
                cn(
                  'rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-orange-500/15 text-orange-400'
                    : 'text-[var(--text-secondary)] hover:bg-[var(--bg-glass)] hover:text-[var(--text-primary)]'
                )
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-1.5 sm:gap-2">
          <Button
            size="icon"
            variant="ghost"
            aria-label="Open search"
            onClick={() => setCommandOpen(true)}
            className="hidden sm:inline-flex"
          >
            <Search className="h-4 w-4" />
          </Button>
          <button
            type="button"
            onClick={() => setCommandOpen(true)}
            className="hidden items-center gap-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-glass)] px-3 py-1.5 text-xs text-[var(--text-muted)] transition hover:border-[var(--border-strong)] md:flex"
          >
            <Command className="h-3.5 w-3.5" />
            <span>Search</span>
            <kbd className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-[10px]">⌘K</kbd>
          </button>
          <Link
            to="/favorites"
            className="relative rounded-xl p-2.5 text-[var(--text-secondary)] transition hover:bg-[var(--bg-glass)] hover:text-orange-400"
            aria-label={`Favorites (${favorites.length})`}
          >
            <Heart className="h-4 w-4" />
            {favorites.length > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-orange-500 px-1 text-[10px] font-bold text-white">
                {favorites.length}
              </span>
            )}
          </Link>
          <Button size="icon" variant="ghost" aria-label="Toggle theme" onClick={cycleTheme}>
            {resolved === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="lg:hidden"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {open && (
        <nav
          className="border-t border-[var(--border-subtle)] bg-[var(--bg-elevated)] px-4 py-4 lg:hidden"
          aria-label="Mobile"
        >
          <ul className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  end={link.to === '/'}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    cn(
                      'block rounded-xl px-4 py-3 text-sm font-medium',
                      isActive
                        ? 'bg-orange-500/15 text-orange-400'
                        : 'text-[var(--text-secondary)] hover:bg-[var(--bg-glass)]'
                    )
                  }
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  )
}
