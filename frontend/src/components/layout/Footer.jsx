import { Link } from 'react-router-dom'
import { Github, Mail, Radio } from 'lucide-react'
import { NAV_LINKS, SITE } from '../../config/site'

const PLATFORM_LINKS = NAV_LINKS.filter((l) =>
  ['/legends', '/compare', '/hall-of-fame', '/matches', '/goat', '/dream-team'].includes(l.to)
)

const RESOURCE_LINKS = NAV_LINKS.filter((l) =>
  ['/world-cups', '/rankings', '/records', '/quiz', '/timeline', '/countries'].includes(l.to)
)

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="mt-auto border-t border-[var(--border-subtle)] bg-[var(--bg-elevated)]/60">
      <div className="mx-auto max-w-[var(--container)] px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#2F74B4] to-[#0D4669] text-sm font-black text-white shadow-[var(--shadow-glow)]">
                CL
              </span>
              <span className="font-display text-lg font-bold text-[var(--text-primary)]">
                {SITE.name}
              </span>
            </div>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-[var(--text-secondary)]">
              {SITE.description}
            </p>
            <Link
              to="/matches"
              className="mt-5 inline-flex items-center gap-1.5 rounded-full border border-[#235D94]/40 bg-[#235D94]/15 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-[#7EC8F2] transition hover:bg-[#235D94]/25"
            >
              <Radio className="h-3 w-3" />
              Live Matches
            </Link>
            <div className="mt-5 flex gap-3">
              <a
                href={SITE.github}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl border border-[var(--border-subtle)] p-2.5 text-[var(--text-secondary)] transition hover:border-[#235D94]/40 hover:text-[#7EC8F2]"
                aria-label="GitHub repository"
              >
                <Github className="h-4 w-4" />
              </a>
              <a
                href={`mailto:${SITE.author.email}`}
                className="rounded-xl border border-[var(--border-subtle)] p-2.5 text-[var(--text-secondary)] transition hover:border-[#235D94]/40 hover:text-[#7EC8F2]"
                aria-label="Email author"
              >
                <Mail className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-[var(--text-muted)]">
              Platform
            </h3>
            <ul className="mt-4 space-y-2">
              {PLATFORM_LINKS.map((l) => (
                <li key={l.to}>
                  <Link
                    to={l.to}
                    className="text-sm text-[var(--text-secondary)] transition hover:text-[#7EC8F2]"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-[var(--text-muted)]">
              Resources
            </h3>
            <ul className="mt-4 space-y-2">
              {RESOURCE_LINKS.map((l) => (
                <li key={l.to}>
                  <Link
                    to={l.to}
                    className="text-sm text-[var(--text-secondary)] transition hover:text-[#7EC8F2]"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-[var(--text-muted)]">
              Project
            </h3>
            <ul className="mt-4 space-y-2 text-sm text-[var(--text-secondary)]">
              <li>
                <Link to="/about" className="transition hover:text-[#7EC8F2]">
                  About
                </Link>
              </li>
              <li>
                <a href={SITE.github} target="_blank" rel="noopener noreferrer" className="transition hover:text-[#7EC8F2]">
                  Source Code
                </a>
              </li>
              <li className="pt-1 text-xs text-[var(--text-muted)]">
                {SITE.author.email}
                <br />
                {SITE.author.github}
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-[var(--border-subtle)] pt-6 text-xs text-[var(--text-muted)] sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {SITE.name}. Built by {SITE.author.name}. All rights reserved.
          </p>
          <p>Crafted for fans, recruiters, and the love of cricket.</p>
        </div>
      </div>
    </footer>
  )
}
