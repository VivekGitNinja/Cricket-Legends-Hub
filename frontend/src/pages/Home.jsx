import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import {
  ArrowRight,
  BarChart3,
  Calculator,
  CheckCircle2,
  Crown,
  GitCompare,
  Globe2,
  HelpCircle,
  Newspaper,
  Play,
  Radio,
  Sparkles,
  Trophy,
  Users,
} from 'lucide-react'
import { LEGENDS, MATCHES, RECORDS } from '../data/legends'
import { api, normalizeApiMatch } from '../lib/api'
import { rankLegends } from '../utils/goat'
import { useCountUp } from '../hooks/useCountUp'
import { fadeUp, stagger } from '../animations/variants'
import Section from '../components/ui/Section'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'
import Card from '../components/ui/Card'
import LegendCard from '../components/legends/LegendCard'
import Seo from '../components/ui/Seo'
import Avatar from '../components/ui/Avatar'
import TiltCard from '../components/effects/TiltCard'
import CricketBall3D from '../components/effects/CricketBall3D'

const HEADLINE_TICKER = [
  '340 players · 20 countries · every era',
  'India — T20 World Champions 2024',
  'Compare head-to-head with transparent GOAT scoring',
  'Pick your dream XI and share it',
]

const buildTicker = (matches) => [
  ...matches.filter((m) => m.result).map((m) => `${m.teamA} beat ${m.teamB} — ${m.result}`),
  ...HEADLINE_TICKER,
]

// Deterministic floating particles for the hero backdrop.
const PARTICLES = Array.from({ length: 14 }).map((_, i) => ({
  left: `${(i * 7.3 + 4) % 100}%`,
  top: `${(i * 13.7 + 8) % 100}%`,
  size: 3 + (i % 4),
  delay: `${(i % 6) * 0.7}s`,
  duration: `${5 + (i % 5)}s`,
}))

function StatPill({ label, value }) {
  const n = useCountUp(value, 1400, true)
  return (
    <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-glass)] px-4 py-3 text-center backdrop-blur-xl">
      <div className="font-display text-xl font-bold text-[#7EC8F2] md:text-2xl">{n}</div>
      <div className="mt-0.5 text-[10px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">
        {label}
      </div>
    </div>
  )
}

function FloatingChip({ className, style, children }) {
  return (
    <div
      className={`animate-chip-float absolute rounded-2xl border border-[#539AC1]/25 bg-[#0A1420]/85 px-4 py-3 shadow-[var(--shadow-md)] backdrop-blur-xl ${className}`}
      style={style}
    >
      {children}
    </div>
  )
}

function FeatureCard({ icon: Icon, title, text, to, highlight = false }) {
  return (
    <TiltCard maxTilt={8} className="group h-full">
      <Card
        className={`flex h-full flex-col p-6 ${
          highlight
            ? 'gradient-border !bg-[#0D1B2A] shadow-[var(--shadow-glow)]'
            : ''
        }`}
      >
        <div
          className={`mb-4 flex h-11 w-11 items-center justify-center rounded-xl ${
            highlight
              ? 'bg-[#235D94]/30 text-[#7EC8F2] ring-1 ring-inset ring-[#539AC1]/50'
              : 'bg-[#235D94]/15 text-[#A5C7E0] ring-1 ring-inset ring-[#539AC1]/20'
          }`}
        >
          <Icon className="h-5 w-5" />
        </div>
        <h3 className="font-display text-lg font-semibold text-[var(--text-primary)]">{title}</h3>
        <p className="mt-2 flex-1 text-sm text-[var(--text-secondary)]">{text}</p>
        <Link
          to={to}
          className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-[#7EC8F2] transition group-hover:gap-2"
        >
          Open <ArrowRight className="h-4 w-4" />
        </Link>
      </Card>
    </TiltCard>
  )
}

function LiveMatchCard({ m, index }) {
  const isLive = index === 0
  const status = String(m.status || '').toLowerCase()
  const isUpcoming = status === 'scheduled' || status === 'upcoming' || status === 'pending'

  return (
    <Card
      className={`flex h-full flex-col p-5 ${isLive ? 'gradient-border !bg-[#0D1B2A] shadow-[var(--shadow-glow)]' : ''}`}
    >
      <div className="flex items-center justify-between gap-2">
        <Badge tone={isLive ? 'gold' : isUpcoming ? 'brand' : 'muted'}>
          {isLive && <span className="live-dot h-1.5 w-1.5 rounded-full bg-[#539AC1]" />}
          {isLive ? 'LIVE NOW' : isUpcoming ? 'UPCOMING' : 'COMPLETED'}
        </Badge>
        <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
          {m.format}
        </span>
      </div>

      <h3 className="mt-4 font-display text-lg font-semibold text-[var(--text-primary)]">
        {m.teamA} <span className="text-[var(--text-muted)]">vs</span> {m.teamB}
      </h3>
      <p className="mt-1 text-xs text-[var(--text-muted)]">{m.title}</p>

      <div className="mt-4 flex items-end justify-between gap-3 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-glass)] px-3 py-2.5">
        <div className="text-center">
          <p className="font-display text-sm font-bold text-[var(--text-primary)]">{m.scoreA || '—'}</p>
          <p className="mt-0.5 text-[10px] uppercase tracking-wider text-[var(--text-muted)]">{m.teamA}</p>
        </div>
        <div className="pb-2 text-xs font-bold text-[var(--text-muted)]">VS</div>
        <div className="text-center">
          <p className="font-display text-sm font-bold text-[var(--text-primary)]">{m.scoreB || '—'}</p>
          <p className="mt-0.5 text-[10px] uppercase tracking-wider text-[var(--text-muted)]">{m.teamB}</p>
        </div>
      </div>

      <p className="mt-3 text-xs text-[var(--text-secondary)]">{m.venue}</p>
      <p className="mt-1 text-sm font-medium text-[#7EC8F2]">{m.result}</p>

      <Button as={Link} to="/matches" variant={isLive ? 'primary' : 'secondary'} size="sm" className="mt-4 w-full">
        {isLive ? 'Join Live' : 'View Details'}
      </Button>
    </Card>
  )
}

const PLATFORM_FEATURES = [
  {
    icon: Radio,
    title: 'Live Match Ticker',
    text: 'Streaming results, scores, and headlines — powered by the live API with curated offline fallback.',
    to: '/matches',
    highlight: true,
  },
  {
    icon: Calculator,
    title: 'GOAT Calculator',
    text: 'A transparent, weighted excellence model that ranks legends across every era and format.',
    to: '/goat',
  },
  {
    icon: GitCompare,
    title: 'Head-to-Head Compare',
    text: 'Side-by-side career metrics, charts, and GOAT scoring for any two legends.',
    to: '/compare',
  },
  {
    icon: Trophy,
    title: 'Hall of Fame',
    text: 'Ranked legends with an auditable, explainable scoring system you can trust.',
    to: '/hall-of-fame',
  },
  {
    icon: Users,
    title: 'Dream Team Builder',
    text: 'Pick your XI, save locally, and share your lineup with the world.',
    to: '/dream-team',
  },
  {
    icon: HelpCircle,
    title: 'Interactive Quiz',
    text: 'Test your cricket knowledge with era-spanning trivia that gets harder as you go.',
    to: '/quiz',
  },
  {
    icon: Globe2,
    title: 'World Cup History',
    text: 'Every ODI and T20 World Cup — winners, finals, venues, and players of the tournament.',
    to: '/world-cups',
  },
  {
    icon: BarChart3,
    title: 'ICC Rankings',
    text: 'Top-5 batting, bowling, and all-rounder tables across Test, ODI, and T20.',
    to: '/rankings',
  },
]

const STEPS = [
  {
    step: '01',
    title: 'Explore the archive',
    text: 'Browse 340+ real players from 20 nations — from Bradman to Bumrah, every era.',
  },
  {
    step: '02',
    title: 'Compare & rank',
    text: 'Run head-to-heads and watch the GOAT calculator break down every score.',
  },
  {
    step: '03',
    title: 'Test your knowledge',
    text: 'Take the quiz, revisit World Cup history, and chase the records board.',
  },
  {
    step: '04',
    title: 'Build & share',
    text: 'Assemble your dream XI, save favorites, and share your rankings.',
  },
]

export default function Home() {
  const ranked = rankLegends(LEGENDS)
  const top = ranked.slice(0, 6)
  const podium = ranked.slice(0, 3)
  const spotlight = podium[0]
  const featuredMatches = MATCHES.slice(0, 3)
  const [tickerItems, setTickerItems] = useState(() => buildTicker(MATCHES))
  const [liveMatches, setLiveMatches] = useState(featuredMatches)
  const [source, setSource] = useState('local')
  const [newsItems, setNewsItems] = useState([])

  // Mouse parallax for the 3D hero scene.
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const ballX = useSpring(useTransform(mx, [-0.5, 0.5], [-22, 22]), { stiffness: 55, damping: 16 })
  const ballY = useSpring(useTransform(my, [-0.5, 0.5], [-14, 14]), { stiffness: 55, damping: 16 })
  const orb1X = useSpring(useTransform(mx, [-0.5, 0.5], [-36, 36]), { stiffness: 40, damping: 18 })
  const orb1Y = useSpring(useTransform(my, [-0.5, 0.5], [-24, 24]), { stiffness: 40, damping: 18 })
  const orb2X = useSpring(useTransform(mx, [-0.5, 0.5], [26, -26]), { stiffness: 40, damping: 18 })
  const orb2Y = useSpring(useTransform(my, [-0.5, 0.5], [16, -16]), { stiffness: 40, damping: 18 })

  const onMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    mx.set((e.clientX - rect.left) / rect.width - 0.5)
    my.set((e.clientY - rect.top) / rect.height - 0.5)
  }

  const onMouseLeave = () => {
    mx.set(0)
    my.set(0)
  }

  // Refresh the ticker and live cards with API results when the backend is reachable.
  useEffect(() => {
    let mounted = true
    api.getMatches().then(({ source: src, matches }) => {
      if (!mounted) return
      if (src === 'api') {
        const normalized = matches.map(normalizeApiMatch).filter(Boolean)
        if (normalized.length) {
          setLiveMatches(normalized)
          setSource('api')
          const items = buildTicker(normalized)
          if (items.length > HEADLINE_TICKER.length) setTickerItems(items)
        }
      }
    })
    api
      .getNews()
      .then((news) => mounted && setNewsItems(Array.isArray(news) ? news : []))
      .catch(() => {})
    return () => {
      mounted = false
    }
  }, [])

  const records = RECORDS.batting.slice(0, 3)

  return (
    <>
      <Seo path="/" />
      {/* Live ticker — Paradigm keeps a slim top strip */}
      <div className="marquee-mask overflow-hidden border-b border-[var(--border-subtle)] bg-[#033051]/40 py-2.5">
        <div className="flex w-max animate-marquee">
          {[...tickerItems, ...tickerItems].map((item, i) => (
            <span
              key={i}
              className="flex shrink-0 items-center gap-2.5 whitespace-nowrap pr-10 text-xs font-medium tracking-wide text-[var(--text-secondary)]"
            >
              <span className="live-dot h-1.5 w-1.5 shrink-0 rounded-full bg-[#539AC1]" />
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* ===== HERO ===== */}
      <section
        className="relative overflow-hidden pb-16 pt-16 md:pb-24 md:pt-24"
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
      >
        {/* backdrop layers — navy glow + dot grid like the reference */}
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(35,93,148,0.28),transparent_60%)]" />
          <motion.div
            style={{ x: orb1X, y: orb1Y }}
            className="absolute -left-32 top-10 h-96 w-96 rounded-full bg-[#235D94]/30 blur-[110px]"
          />
          <motion.div
            style={{ x: orb2X, y: orb2Y }}
            className="absolute -right-24 top-40 h-80 w-80 rounded-full bg-[#539AC1]/20 blur-[110px]"
          />
          <div className="absolute inset-0 opacity-[0.06] [background-image:radial-gradient(circle,rgba(165,199,224,0.7)_1px,transparent_1px)] [background-size:28px_28px] [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_75%)]" />
          {PARTICLES.map((p, i) => (
            <span
              key={i}
              className="animate-particle absolute rounded-full bg-[#7EC8F2]/50"
              style={{
                left: p.left,
                top: p.top,
                width: p.size,
                height: p.size,
                animationDelay: p.delay,
                animationDuration: p.duration,
              }}
            />
          ))}
        </div>

        <div className="relative mx-auto grid max-w-[var(--container)] gap-14 px-4 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-8 lg:px-8">
          {/* copy column */}
          <motion.div initial="hidden" animate="show" variants={stagger} className="text-center lg:text-left">
            <motion.div variants={fadeUp}>
              <Badge tone="brand" className="mb-6">
                <Sparkles className="h-3.5 w-3.5" />
                THE ULTIMATE CRICKET LEGENDS PLATFORM
              </Badge>
            </motion.div>
            <motion.h1
              variants={fadeUp}
              className="font-display text-4xl font-extrabold leading-[1.05] tracking-tight text-[var(--text-primary)] sm:text-5xl md:text-6xl lg:text-7xl"
            >
              Cricket greatness,
              <span className="text-brand-gradient block drop-shadow-[0_0_30px_rgba(83,154,193,0.35)]">
                engineered for fans
              </span>
            </motion.h1>
            <motion.p
              variants={fadeUp}
              className="mx-auto mt-6 max-w-2xl text-base text-[var(--text-secondary)] md:text-lg lg:mx-0"
            >
              Delivering the game's history, heroes, and live moments today — built with quality that
              empowers every fan's tomorrow. Hall-of-fame rankings, head-to-head comparisons, dream
              teams, and interactive stats in one place.
            </motion.p>
            <motion.div
              variants={fadeUp}
              className="mt-8 flex flex-wrap items-center justify-center gap-3 lg:justify-start"
            >
              <Button as={Link} to="/legends" size="lg">
                Explore Legends <ArrowRight className="h-4 w-4" />
              </Button>
              <Button as={Link} to="/matches" variant="secondary" size="lg">
                <Play className="h-4 w-4" /> Watch Live Matches
              </Button>
            </motion.div>

            {/* trust chips */}
            <motion.div
              variants={fadeUp}
              className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-[var(--text-muted)] lg:justify-start"
            >
              {['100% Free & Open Source', 'Live API data', 'Offline-first', 'No sign-up needed'].map((chip) => (
                <span key={chip} className="inline-flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-[#539AC1]" />
                  {chip}
                </span>
              ))}
            </motion.div>

            <motion.div
              variants={fadeUp}
              className="mt-10 grid max-w-xl grid-cols-2 gap-3 sm:grid-cols-4 lg:mx-0"
            >
              <StatPill label="Players" value={340} />
              <StatPill label="Countries" value={20} />
              <StatPill label="Matches" value={MATCHES.length} />
              <StatPill label="Features" value={20} />
            </motion.div>
          </motion.div>

          {/* 3D ball scene column */}
          <motion.div
            initial={{ opacity: 0, scale: 0.88 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.35, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="relative hidden lg:block"
          >
            <motion.div style={{ x: ballX, y: ballY }}>
              <CricketBall3D />
            </motion.div>
            <FloatingChip className="left-0 top-6" style={{ animationDelay: '0.6s' }}>
              <div className="flex items-center gap-2">
                <Avatar name={spotlight.name} src={spotlight.image} size="sm" />
                <div>
                  <p className="text-xs font-semibold text-[var(--text-primary)]">{spotlight.name}</p>
                  <p className="text-[10px] text-[var(--text-muted)]">GOAT {spotlight.goatScore} · Rank #1</p>
                </div>
              </div>
            </FloatingChip>
            <FloatingChip className="right-2 top-1/3" style={{ animationDelay: '1.4s' }}>
              <p className="font-display text-lg font-bold text-[#7EC8F2]">13+</p>
              <p className="text-[10px] uppercase tracking-wider text-[var(--text-muted)]">World Cup finals</p>
            </FloatingChip>
            <FloatingChip className="bottom-10 left-4" style={{ animationDelay: '2.2s' }}>
              <p className="font-display text-lg font-bold text-emerald-300">6</p>
              <p className="text-[10px] uppercase tracking-wider text-[var(--text-muted)]">Formats covered</p>
            </FloatingChip>
          </motion.div>
        </div>
      </section>

      {/* ===== MISSION BAND — giant background typography like "We are Paradigm" ===== */}
      <section className="relative overflow-hidden py-20 md:py-28">
        <div
          aria-hidden="true"
          className="pointer-events-none select-none whitespace-nowrap text-center font-display text-[16vw] font-extrabold leading-none tracking-tighter text-[#033051]/70"
        >
          We are Cricket
        </div>
        <div className="relative -mt-8 mx-auto max-w-3xl px-4 text-center sm:px-6 md:-mt-16">
          <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#539AC1]">Our mission</p>
          <h2 className="mt-3 font-display text-3xl font-bold text-[var(--text-primary)] md:text-4xl">
            Every legend. Every country. Every era.
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-[var(--text-secondary)] md:text-base">
            At Cricket Legends Hub, our mission is to transform how fans experience the game —
            from live scores to the stories of 340+ players across 20 nations. By combining
            live data with a deep archive of every era, we drive discovery, debate, and delight
            for cricket lovers everywhere.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-[var(--text-muted)]">
            <span className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-[#539AC1]" /> Real players, real photos</span>
            <span className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-[#539AC1]" /> Live match engine</span>
            <span className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-[#539AC1]" /> Transparent rankings</span>
          </div>
        </div>
      </section>

      {/* ===== PLATFORM FEATURES ===== */}
      <Section
        eyebrow="What we offer"
        title="Built for serious cricket fans"
        description="From neighborhood fans to full-blown analysts — every tool you need to explore, rank, and relive the game's greatest moments."
      >
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {PLATFORM_FEATURES.map((f) => (
            <FeatureCard key={f.title} {...f} />
          ))}
        </div>
      </Section>

      {/* ===== HOW IT WORKS ===== */}
      <Section
        eyebrow="How it works"
        title="From discovery to hall of fame in four steps"
        description="No technical skills needed. If you can watch cricket, you can use Cricket Legends Hub."
        className="bg-[#0A1420]/60"
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s) => (
            <Card key={s.step} className="relative h-full overflow-hidden p-6">
              <div className="flex items-center justify-between">
                <span className="flex h-10 w-10 items-center justify-center rounded-full border border-[#539AC1]/40 bg-[#235D94]/20 font-display text-sm font-bold text-[#7EC8F2]">
                  {s.step}
                </span>
                <CheckCircle2 className="h-5 w-5 text-[#539AC1]/50" />
              </div>
              <h3 className="mt-4 font-display text-lg font-semibold text-[var(--text-primary)]">
                {s.title}
              </h3>
              <p className="mt-2 text-sm text-[var(--text-secondary)]">{s.text}</p>
            </Card>
          ))}
        </div>
      </Section>

      {/* ===== LIVE TODAY ===== */}
      <Section
        id="matches"
        eyebrow="Live today"
        title={source === 'api' ? 'Live cricket matches' : 'Historic encounters'}
        description={
          source === 'api'
            ? "Streaming live from the API — drop into the action or check what's scheduled."
            : "Moments that defined eras — from Eden Gardens to Lord's."
        }
        action={
          <Button as={Link} to="/matches" variant="secondary">
            View all matches <ArrowRight className="h-4 w-4" />
          </Button>
        }
      >
        <div className="mb-4">
          <Badge tone={source === 'api' ? 'brand' : 'muted'}>
            <span className={`h-1.5 w-1.5 rounded-full ${source === 'api' ? 'live-dot bg-[#539AC1]' : 'bg-[var(--text-muted)]'}`} />
            {source === 'api' ? '● Live API data' : '● Offline archive'}
          </Badge>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {liveMatches.slice(0, 3).map((m, i) => (
            <LiveMatchCard key={m.id || i} m={m} index={i} />
          ))}
        </div>
      </Section>

      {/* ===== GOAT PODIUM ===== */}
      <Section
        eyebrow="Hall of Fame"
        title="The GOAT podium"
        description="Ranked by the transparent GOAT excellence model — auditable, explainable, and always debatable."
        className="bg-[#0A1420]/60"
      >
        <div className="grid gap-5 md:grid-cols-3">
          {podium.map((legend, i) => {
            const isTop = i === 0
            return (
              <TiltCard key={legend.id} maxTilt={7} className="group h-full">
                <Card
                  className={`relative flex h-full flex-col items-center p-7 text-center ${
                    isTop ? 'gradient-border shadow-[var(--shadow-glow)]' : ''
                  }`}
                >
                  {isTop && (
                    <Badge tone="gold" className="absolute right-4 top-4">
                      <Crown className="h-3 w-3" /> HALL OF FAME #1
                    </Badge>
                  )}
                  <div className="relative">
                    <div
                      className={`absolute -inset-5 rounded-full blur-2xl ${
                        isTop ? 'bg-[#235D94]/40' : 'bg-[#539AC1]/15'
                      }`}
                    />
                    <Avatar name={legend.name} src={legend.image} size="xl" className="relative" />
                  </div>
                  <div className="mt-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                    <span className="font-display text-sm text-[#539AC1]">#{i + 1}</span> of All Time
                  </div>
                  <h3 className="mt-2 font-display text-xl font-bold text-[var(--text-primary)]">
                    {legend.name}
                  </h3>
                  <p className="mt-1 text-xs text-[var(--text-muted)]">
                    {legend.country} · {legend.role}
                  </p>
                  <p className="mt-4 font-display text-4xl font-bold text-[#7EC8F2]">
                    {legend.goatScore}
                  </p>
                  <p className="text-[10px] uppercase tracking-wider text-[var(--text-muted)]">GOAT Score</p>
                  <Button as={Link} to={`/legends/${legend.id}`} variant={isTop ? 'primary' : 'secondary'} size="sm" className="mt-5 w-full">
                    View profile
                  </Button>
                </Card>
              </TiltCard>
            )
          })}
        </div>
      </Section>

      {/* ===== FEATURED LEGENDS ===== */}
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
            <TiltCard key={legend.id} maxTilt={7} className="group h-full">
              <LegendCard legend={legend} index={i} />
            </TiltCard>
          ))}
        </motion.div>
      </Section>

      {/* ===== FROM THE RECORDS ===== */}
      <Section
        eyebrow="From the records"
        title="Numbers that define greatness"
        description="Records are the language of cricket. These are the ones that still stand tallest."
        className="bg-[#0A1420]/60"
        action={
          <Button as={Link} to="/records" variant="secondary">
            All records <ArrowRight className="h-4 w-4" />
          </Button>
        }
      >
        <div className="grid gap-4 md:grid-cols-3">
          {records.map((r) => (
            <Card key={r.label} className="flex items-center gap-4 p-5">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#235D94]/20 text-[#A5C7E0]">
                <Trophy className="h-5 w-5" />
              </span>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                  {r.label}
                </p>
                <p className="mt-1 font-display text-2xl font-bold text-[#7EC8F2]">{r.value}</p>
                <p className="mt-0.5 text-xs text-[var(--text-secondary)]">
                  {r.player} · {r.country}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </Section>

      {/* ===== NEWSROOM ===== */}
      {newsItems.length > 0 && (
        <Section
          eyebrow="Newsroom"
          title="Latest headlines"
          description="Fresh stories from the Cricket Legends Hub news desk."
          action={
            <Button as={Link} to="/news" variant="secondary">
              All news <ArrowRight className="h-4 w-4" />
            </Button>
          }
        >
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {newsItems.slice(0, 4).map((n) => (
              <Link
                key={n._id}
                to="/news"
                className="group flex flex-col rounded-[var(--radius-2xl)] border border-[var(--border-subtle)] bg-[var(--bg-glass)] p-5 transition hover:border-[#539AC1]/50"
              >
                <div className="flex items-center gap-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#235D94]/20 text-[#A5C7E0]">
                    <Newspaper className="h-3.5 w-3.5" />
                  </span>
                  <Badge tone="muted">{n.category}</Badge>
                </div>
                <h3 className="mt-3 line-clamp-2 font-display text-base font-semibold leading-snug text-[var(--text-primary)] group-hover:text-[#7EC8F2] transition-colors">
                  {n.title}
                </h3>
                <p className="mt-2 line-clamp-2 flex-1 text-xs text-[var(--text-secondary)]">
                  {n.excerpt}
                </p>
                <p className="mt-4 text-[11px] text-[var(--text-muted)]">
                  {new Date(n.publishedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                </p>
              </Link>
            ))}
          </div>
        </Section>
      )}

      {/* ===== CTA BAND ===== */}
      <section className="px-4 pb-20 sm:px-6 lg:px-8">
        <div className="gradient-border mx-auto max-w-[var(--container)] overflow-hidden rounded-[var(--radius-2xl)] p-8 text-center md:p-14">
          <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#539AC1]">Don't be shy, just dive in</p>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-[var(--text-primary)] md:text-5xl">
            Ready to explore cricket <span className="text-brand-gradient">greatness</span>?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base text-[var(--text-secondary)] md:text-lg">
            Join fans exploring the legends, rankings, and moments that shaped the world's second
            favorite religion.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button as={Link} to="/legends" size="lg">
              Start Exploring <ArrowRight className="h-4 w-4" />
            </Button>
            <Button as={Link} to="/quiz" variant="gold" size="lg">
              Take the Quiz
            </Button>
          </div>
        </div>
      </section>
    </>
  )
}
