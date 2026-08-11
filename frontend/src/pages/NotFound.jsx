import { Link } from 'react-router-dom'
import Button from '../components/ui/Button'
import Section from '../components/ui/Section'

export default function NotFound() {
  return (
    <Section>
      <div className="mx-auto max-w-lg py-20 text-center">
        <div className="relative mx-auto mb-8 h-14 w-14" aria-hidden="true">
          <div className="absolute bottom-0 left-1/2 h-1.5 w-12 -translate-x-1/2 rounded-full bg-orange-500/30 blur-[2px]" />
          <div className="animate-ball-bounce absolute inset-0">
            <svg viewBox="0 0 48 48" className="h-full w-full drop-shadow-[0_6px_12px_rgba(249,115,22,0.35)]">
              <defs>
                <radialGradient id="ball-grad" cx="35%" cy="30%" r="75%">
                  <stop offset="0%" stopColor="#f87171" />
                  <stop offset="60%" stopColor="#dc2626" />
                  <stop offset="100%" stopColor="#991b1b" />
                </radialGradient>
              </defs>
              <circle cx="24" cy="24" r="20" fill="url(#ball-grad)" />
              <path d="M10 14 Q24 28 38 14" stroke="#fecaca" strokeWidth="2" fill="none" />
              <path d="M10 34 Q24 20 38 34" stroke="#fecaca" strokeWidth="2" fill="none" />
              <path d="M24 4 L24 44" stroke="#fecaca" strokeWidth="2" />
            </svg>
          </div>
        </div>
        <p className="font-display text-7xl font-bold text-orange-400">404</p>
        <h1 className="mt-4 font-display text-3xl font-semibold text-[var(--text-primary)]">
          Page not found
        </h1>
        <p className="mt-3 text-[var(--text-secondary)]">
          That delivery was wide outside off stump. Let’s get back on strike.
        </p>
        <Button as={Link} to="/" className="mt-8">
          Back home
        </Button>
      </div>
    </Section>
  )
}
