import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'
import { BookOpen, Command, Heart, Menu, Moon, Search, Sun, X } from 'lucide-react'
import { NAV_LINKS } from '../../config/site'
import { useApp } from '../../context/AppContext'
import { useAuth } from '../../context/AuthContext'
import { useTheme } from '../../context/ThemeContext'
import { cn } from '../../utils/cn'
import { initials } from '../../utils/format'

// Slim, reference-style primary links — keep the essentials up top.
const primaryLinks = NAV_LINKS.filter((l) =>
  ['/', '/live', '/matches', '/legends', '/players', '/squads'].includes(l.to)
)

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const { setCommandOpen, favorites, readingMode, setReadingMode } = useApp()
  const { user, logout } = useAuth()
  const { resolved, cycleTheme } = useTheme()

  return (
    <header className="sticky top-0 z-[var(--z-header)] border-b border-[var(--border-subtle)] bg-[#020507]/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-[var(--container)] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <Link to="/" className="group flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#2F74B4] to-[#0D4669] text-xs font-black text-white shadow-[var(--shadow-glow)] transition group-hover:brightness-110">
            CL
          </span>
          <span className="flex flex-col leading-none">
            <span className="font-display text-base font-bold tracking-tight text-[var(--text-primary)] transition-colors group-hover:text-[#7EC8F2]">
              Cricket Legends
            </span>
            <span className="mt-0.5 text-[9px] font-semibold uppercase tracking-[0.22em] text-[var(--text-muted)]">
              Hub
            </span>
          </span>
        </Link>

        {/* LIVE pill */}
        <Link
          to="/live"
          className="hidden items-center gap-1.5 rounded-full border border-[#539AC1]/40 bg-[#235D94]/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-[#7EC8F2] transition hover:bg-[#235D94]/25 md:inline-flex"
        >
          <span className="live-dot h-1.5 w-1.5 rounded-full bg-[#539AC1]" />
          Live
        </Link>

        {/* Primary nav — reference style: plain links, sliding underline */}
        <nav className="hidden items-center gap-0.5 lg:flex" aria-label="Primary">
          {primaryLinks.map((link) => (
            <NavLink key={link.to} to={link.to} end={link.to === '/'} className="relative">
              {({ isActive }) => (
                <span
                  className={cn(
                    'relative block px-3 py-2 text-sm font-medium transition-colors',
                    isActive ? 'text-[#7EC8F2]' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                  )}
                >
                  {link.label}
                  {isActive && (
                    <motion.span
                      layoutId="nav-underline"
                      className="absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full bg-gradient-to-r from-[#539AC1] to-[#7EC8F2]"
                      transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                    />
                  )}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-1 sm:gap-1.5">
          <button
            type="button"
            onClick={() => setCommandOpen(true)}
            aria-label="Open search"
            className="rounded-xl p-2 text-[var(--text-secondary)] transition hover:bg-[var(--bg-glass)] hover:text-[#7EC8F2]"
          >
            <Search className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => setCommandOpen(true)}
            className="hidden items-center gap-2 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-glass)] px-2.5 py-1.5 text-xs text-[var(--text-muted)] transition hover:border-[var(--border-strong)] md:flex"
          >
            <Command className="h-3.5 w-3.5" />
            <span>Search</span>
            <kbd className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-[10px]">⌘K</kbd>
          </button>
          <Link
            to="/favorites"
            className="relative rounded-xl p-2 text-[var(--text-secondary)] transition hover:bg-[var(--bg-glass)] hover:text-[#7EC8F2]"
            aria-label={`Favorites (${favorites.length})`}
          >
            <Heart className="h-4 w-4" />
            {favorites.length > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#2F74B4] px-1 text-[10px] font-bold text-white">
                {favorites.length}
              </span>
            )}
          </Link>
          <button
            type="button"
            aria-label={readingMode ? 'Exit reading mode' : 'Enter reading mode'}
            aria-pressed={readingMode}
            onClick={() => setReadingMode((v) => !v)}
            className="hidden rounded-xl p-2 text-[var(--text-secondary)] transition hover:bg-[var(--bg-glass)] hover:text-[#7EC8F2] sm:block"
          >
            <BookOpen className={cn('h-4 w-4', readingMode && 'text-[#7EC8F2]')} />
          </button>
          {user ? (
            <div className="relative">
              <button
                type="button"
                aria-haspopup="menu"
                aria-expanded={menuOpen}
                aria-label={`Account menu for ${user.name}`}
                onClick={() => setMenuOpen((v) => !v)}
                className="flex items-center gap-2 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-glass)] px-1.5 py-1 transition hover:border-[var(--border-strong)]"
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-[#2F74B4] to-[#0D4669] text-xs font-bold text-white">
                  {initials(user.name)}
                </span>
                <span className="hidden max-w-[7rem] truncate text-xs font-medium text-[var(--text-secondary)] sm:block">
                  {user.name}
                </span>
              </button>
              {menuOpen && (
                <div className="absolute right-0 top-full z-[var(--z-modal)] mt-2 w-60 overflow-hidden rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)] shadow-[var(--shadow-lg)]">
                  <div className="border-b border-[var(--border-subtle)] px-4 py-3">
                    <p className="truncate text-sm font-semibold text-[var(--text-primary)]">{user.name}</p>
                    <p className="truncate text-xs text-[var(--text-muted)]">{user.email}</p>
                    {user.role === 'admin' && (
                      <span className="mt-1.5 inline-block rounded-full bg-[#539AC1]/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[#7EC8F2]">
                        Admin
                      </span>
                    )}
                  </div>
                  <div className="p-1.5">
                    <Link
                      to="/favorites"
                      onClick={() => setMenuOpen(false)}
                      className="block rounded-lg px-3 py-2 text-sm text-[var(--text-secondary)] transition hover:bg-[var(--bg-glass)] hover:text-[var(--text-primary)]"
                    >
                      My favorites
                    </Link>
                    <button
                      type="button"
                      onClick={() => {
                        setMenuOpen(false)
                        logout()
                      }}
                      className="block w-full rounded-lg px-3 py-2 text-left text-sm text-rose-300 transition hover:bg-rose-500/10"
                    >
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="hidden items-center gap-1.5 rounded-full border border-[var(--border-strong)] bg-[var(--bg-glass)] px-4 py-1.5 text-sm font-semibold text-[var(--text-primary)] transition hover:border-[#539AC1]/60 hover:text-[#7EC8F2] sm:inline-flex"
            >
              Login
              <span className="text-[#539AC1]">→</span>
            </Link>
          )}
          <button
            type="button"
            aria-label="Toggle theme"
            onClick={cycleTheme}
            className="rounded-xl p-2 text-[var(--text-secondary)] transition hover:bg-[var(--bg-glass)] hover:text-[#7EC8F2]"
          >
            {resolved === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
          <button
            type="button"
            className="rounded-xl p-2 text-[var(--text-secondary)] transition hover:bg-[var(--bg-glass)] hover:text-[#7EC8F2] lg:hidden"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <nav
          className="border-t border-[var(--border-subtle)] bg-[#0A1420]/95 px-4 py-4 backdrop-blur-xl lg:hidden"
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
                        ? 'bg-[#235D94]/20 text-[#7EC8F2]'
                        : 'text-[var(--text-secondary)] hover:bg-[var(--bg-glass)]'
                    )
                  }
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
            <li className="mt-2 border-t border-[var(--border-subtle)] pt-2">
              {user ? (
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false)
                    logout()
                  }}
                  className="block w-full rounded-xl px-4 py-3 text-left text-sm font-medium text-rose-300"
                >
                  Sign out ({user.name})
                </button>
              ) : (
                <NavLink
                  to="/login"
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    cn(
                      'block rounded-xl px-4 py-3 text-sm font-medium',
                      isActive ? 'bg-[#235D94]/20 text-[#7EC8F2]' : 'text-[var(--text-secondary)]'
                    )
                  }
                >
                  Login / Register
                </NavLink>
              )}
            </li>
          </ul>
        </nav>
      )}
    </header>
  )
}
