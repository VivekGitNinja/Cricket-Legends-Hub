import { SITE } from '../config/site'
import Section from '../components/ui/Section'
import Card from '../components/ui/Card'
import Badge from '../components/ui/Badge'

export default function About() {
  return (
    <Section
      eyebrow="About"
      title={SITE.name}
      description={SITE.tagline}
    >
      <div className="grid gap-6 md:grid-cols-2">
        <Card hover={false} className="p-6">
          <h3 className="font-display text-xl font-semibold text-[var(--text-primary)]">Mission</h3>
          <p className="mt-3 text-sm leading-relaxed text-[var(--text-secondary)]">
            {SITE.description} This project is designed as a portfolio-grade product experience —
            not a throwaway college demo.
          </p>
        </Card>
        <Card hover={false} className="p-6">
          <h3 className="font-display text-xl font-semibold text-[var(--text-primary)]">Built with</h3>
          <div className="mt-4 flex flex-wrap gap-2">
            {['React', 'Vite', 'Tailwind CSS', 'Framer Motion', 'Recharts', 'Express', 'MongoDB'].map(
              (t) => (
                <Badge key={t} tone="muted">
                  {t}
                </Badge>
              )
            )}
          </div>
        </Card>
        <Card hover={false} className="p-6 md:col-span-2">
          <h3 className="font-display text-xl font-semibold text-[var(--text-primary)]">Author</h3>
          <p className="mt-3 text-sm text-[var(--text-secondary)]">
            {SITE.author.name} ·{' '}
            <a
              href={SITE.author.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-orange-400 hover:underline"
            >
              GitHub
            </a>{' '}
            · {SITE.author.email}
          </p>
          <p className="mt-4 text-sm text-[var(--text-muted)]">
            Keyboard tip: press <kbd className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-xs">⌘K</kbd> for
            the command palette, and cycle theme from the header.
          </p>
        </Card>
      </div>
    </Section>
  )
}
