import { Link } from 'react-router-dom'
import Button from '../components/ui/Button'
import Section from '../components/ui/Section'

export default function NotFound() {
  return (
    <Section>
      <div className="mx-auto max-w-lg py-20 text-center">
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
