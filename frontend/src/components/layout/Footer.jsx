import { Link } from 'react-router-dom'
import { Github, Mail } from 'lucide-react'
import { NAV_LINKS, SITE } from '../../config/site'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="mt-auto border-t border-[var(--border-subtle)] bg-[var(--bg-elevated)]/60">
      <div className="mx-auto max-w-[var(--container)] px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-rose-600 text-sm font-black text-white">
                CL
              </span>
              <span className="font-display text-lg font-bold text-[var(--text-primary)]">
                {SITE.name}
              </span>
            </div>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-[var(--text-secondary)]">
              {SITE.description}
            </p>
            <div className="mt-5 flex gap-3">
              <a
                href={SITE.github}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl border border-[var(--border-subtle)] p-2.5 text-[var(--text-secondary)] transition hover:border-orange-500/40 hover:text-orange-400"
                aria-label="GitHub repository"
              >
                <Github className="h-4 w-4" />
              </a>
              <a
                href={`mailto:${SITE.author.email}`}
                className="rounded-xl border border-[var(--border-subtle)] p-2.5 text-[var(--text-secondary)] transition hover:border-orange-500/40 hover:text-orange-400"
                aria-label="Email author"
              >
                <Mail className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--text-muted)]">
              Explore
            </h3>
            <ul className="mt-4 space-y-2">
              {NAV_LINKS.slice(0, 6).map((l) => (
                <li key={l.to}>
                  <Link
                    to={l.to}
                    className="text-sm text-[var(--text-secondary)] transition hover:text-orange-400"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--text-muted)]">
              Project
            </h3>
            <ul className="mt-4 space-y-2 text-sm text-[var(--text-secondary)]">
              <li>
                <Link to="/about" className="hover:text-orange-400">
                  About
                </Link>
              </li>
              <li>
                <Link to="/records" className="hover:text-orange-400">
                  Records
                </Link>
              </li>
              <li>
                <Link to="/timeline" className="hover:text-orange-400">
                  Cricket Timeline
                </Link>
              </li>
              <li>
                <a href={SITE.github} target="_blank" rel="noopener noreferrer" className="hover:text-orange-400">
                  Source Code
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-[var(--border-subtle)] pt-6 text-xs text-[var(--text-muted)] sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {SITE.name}. Built by {SITE.author.name}.
          </p>
          <p>Crafted for fans, recruiters, and the love of cricket.</p>
        </div>
      </div>
    </footer>
  )
}
