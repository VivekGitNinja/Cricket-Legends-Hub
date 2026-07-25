import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, GitCompare, Sparkles, Trophy, Users } from 'lucide-react'
import { LEGENDS, MATCHES } from '../data/legends'
import { rankLegends } from '../utils/goat'
import { useCountUp } from '../hooks/useCountUp'
import { fadeUp, stagger } from '../animations/variants'
import Section from '../components/ui/Section'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'
import Card from '../components/ui/Card'
import LegendCard from '../components/legends/LegendCard'
import Seo from '../components/ui/Seo'
import StatPill from '../components/ui/StatPill'

function HeroStat({ label, value }) {
  const n = useCountUp(value, 1400, true)
  return <StatPill label={label} value={n} />
}

export default function Home() {
  const top = rankLegends(LEGENDS).slice(0, 6)
  const featuredMatches = MATCHES.slice(0, 3)

  return (
    <>
      <Seo path="/" />
      <section className="relative overflow-hidden pb-16 pt-16 md:pb-24 md:pt-24">
        <div className="mx-auto max-w-[var(--container)] px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            animate="show"
            variants={stagger}
            className="mx-auto max-w-4xl text-center"
          >
            <motion.div variants={fadeUp}>
              <Badge tone="gold" className="mb-6">
                <Sparkles className="h-3.5 w-3.5" />
                The Ultimate Cricket Legends Experience
              </Badge>
            </motion.div>
            <motion.h1
              variants={fadeUp}
              className="font-display text-4xl font-bold leading-tight tracking-tight text-[var(--text-primary)] sm:text-5xl md:text-6xl lg:text-7xl"
            >
              Where cricket greatness
              <span className="block bg-gradient-to-r from-orange-400 via-amber-300 to-rose-400 bg-clip-text text-transparent">
                becomes immortal
              </span>
            </motion.h1>
            <motion.p
              variants={fadeUp}
              className="mx-auto mt-6 max-w-2xl text-base text-[var(--text-secondary)] md:text-lg"
            >
              Explore hall-of-fame rankings, head-to-head comparisons, career timelines,
              dream teams, and interactive stats — crafted like a premium product, built for fans.
            </motion.p>
            <motion.div variants={fadeUp} className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Button as={Link} to="/legends" size="lg">
                Explore Legends <ArrowRight className="h-4 w-4" />
              </Button>
              <Button as={Link} to="/compare" variant="secondary" size="lg">
                <GitCompare className="h-4 w-4" /> Compare Players
              </Button>
              <Button as={Link} to="/hall-of-fame" variant="ghost" size="lg">
                <Trophy className="h-4 w-4" /> Hall of Fame
              </Button>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="mx-auto mt-14 grid max-w-3xl grid-cols-2 gap-3 sm:grid-cols-4"
          >
            <HeroStat label="Legends" value={LEGENDS.length} />
            <HeroStat label="Matches" value={MATCHES.length} />
            <HeroStat label="Countries" value={8} />
            <HeroStat label="Features" value={20} />
          </motion.div>
        </div>
      </section>

      <Section
        eyebrow="Featured Icons"
        title="Legends of the game"
        description="A curated collection of the players who redefined cricket across eras and formats."
        action={
          <Button as={Link} to="/legends" variant="secondary">
            View all <ArrowRight className="h-4 w-4" />
          </Button>
        }
      >
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-80px' }}
          variants={stagger}
          className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
        >
          {top.map((legend, i) => (
            <LegendCard key={legend.id} legend={legend} index={i} />
          ))}
        </motion.div>
      </Section>

      <Section
        eyebrow="Product Suite"
        title="Built like a modern SaaS"
        description="Not a college demo — a full experience with search, comparison, rankings, and more."
        className="bg-white/[0.02]"
      >
        <div className="grid gap-5 md:grid-cols-3">
          {[
            {
              icon: Users,
              title: 'Head-to-Head Compare',
              text: 'Side-by-side career metrics, charts, and GOAT scoring.',
              to: '/compare',
            },
            {
              icon: Trophy,
              title: 'Hall of Fame',
              text: 'Ranked legends with transparent excellence scoring.',
              to: '/hall-of-fame',
            },
            {
              icon: GitCompare,
              title: 'Dream Team Builder',
              text: 'Pick your XI, save locally, and share your lineup.',
              to: '/dream-team',
            },
          ].map((f) => (
            <Card key={f.title} className="p-6">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-orange-500/15 text-orange-400">
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="font-display text-xl font-semibold text-[var(--text-primary)]">{f.title}</h3>
              <p className="mt-2 text-sm text-[var(--text-secondary)]">{f.text}</p>
              <Link to={f.to} className="mt-4 inline-flex text-sm font-semibold text-orange-400">
                Open →
              </Link>
            </Card>
          ))}
        </div>
      </Section>

      <Section
        id="matches"
        eyebrow="Historic Battles"
        title="Epic encounters"
        description="Moments that defined eras — from Eden Gardens to Lord’s."
        action={
          <Button as={Link} to="/matches" variant="secondary">
            Match archive
          </Button>
        }
      >
        <div className="grid gap-4 md:grid-cols-3">
          {featuredMatches.map((m) => (
            <Card key={m.id} className="p-5">
              <Badge tone="sky">{m.format}</Badge>
              <h3 className="mt-3 font-display text-lg font-semibold text-[var(--text-primary)]">
                {m.teamA} vs {m.teamB}
              </h3>
              <p className="mt-2 text-sm text-[var(--text-secondary)]">{m.highlight}</p>
              <p className="mt-4 text-xs text-[var(--text-muted)]">
                {m.venue} · {m.year}
              </p>
              <p className="mt-2 text-sm font-medium text-orange-400">{m.result}</p>
            </Card>
          ))}
        </div>
      </Section>
    </>
  )
}
