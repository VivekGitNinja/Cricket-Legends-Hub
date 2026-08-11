# Changelog

## 2.9.0 — 2026-08-11

### Real live cricket — real scores, real dates, real-time push

- **Real match data from Cricbuzz** (free, no API key): live scores, completed results and upcoming fixtures now come from the actual source — real teams, real venues (Old Trafford, Sabina Park…), real series (The Hundred, CPL, Afghanistan tour of Ireland…) and **real start dates/times** instead of seeded placeholder fixtures
- **Zero-delay updates via Server-Sent Events** — the backend polls Cricbuzz every 12s and broadcasts score changes the moment they're seen; the Live page subscribes over SSE so scores advance on screen with no reload and no client polling delay (verified live: SUL 113/6 → 117/6 while the page sat open). The 20s interval remains only as a fallback if SSE is unavailable
- **Real full scorecards** — match detail pages now render genuine innings: real batters with real dismissals ("c Sonny Baker b Noor Ahmad"), real bowling figures, extras, fall of wickets and partnerships, scraped from Cricbuzz's server-rendered scorecard pages
- **New `/api/live/stream` SSE endpoint** + `/api/live/now` snapshot endpoint; `/api/matches`, `/live`, `/upcoming` and `/:id` all serve real data first with the seeded database as an automatic offline fallback
- **Live page rebuilt around real data** — "real-time" badge, live feed of real status lines, team names shown before they bat; Matches page tabs (Live now / Upcoming / Completed) and Home "Live Today" all show the real fixtures with live countdowns
- Resilient scraper (`backend/services/cricbuzz.js`): direct fetch with jina-reader proxy fallback, short-TTL cache, last-good-snapshot serving when the source is unreachable; matches normalized to the existing frontend shape so nothing downstream changed
- Verified: backend 19/19 tests, frontend build clean + 33/33 tests + 0 lint errors, console clean, scorecard + countdowns + SSE push all confirmed in the preview

## 2.8.0 — 2026-08-11

### Paradigm navy/blue redesign — inspired by the Dribbble tech-consulting shot

- **Full re-theme from crimson/gold to the Paradigm navy/blue system** (Dribbble 26100872): near-black `#020507` base, navy panels `#033051`/`#0A1420`, royal-blue brand `#235D94`, sky accent `#539AC1`, steel-blue text `#A5C7E0`/`#D9EAF6`
- **Hero rebuilt in the reference's language**: uppercase eyebrow badge → giant two-line headline with a blue gradient line → subtitle → pill CTAs (solid "Explore Legends →" + outlined "Watch Live →") → trust chips → count-up stat row; navy glow orbs, dotted-grid backdrop, sky particles, and the 3D ball scene re-tinted blue
- **"We are Cricket" mission band** — the reference's giant background typography treatment with the platform mission and checkmark value props
- **Platform Features grid** — one card (Live Match Ticker) glows with a gradient border and blue shadow, mirroring the highlighted card in the reference's Industries carousel
- **How It Works** — numbered circle steps (01–04) with check icons, echoing the reference's phone checklist
- **Live Today / GOAT podium / CTA band** — LIVE cards and the #1 podium card use the gradient-border glow; "HALL OF FAME #1" crown replaces "MOST POPULAR"; CTA band reworded "Don't be shy, just dive in"
- Global sweep replaced every crimson/gold hex across 11 components/pages with the blue system; buttons, badges, avatars, navbar (LIVE pill, active pill, logo chip), and footer all re-tinted
- **Header rebuilt in the reference's style** — slim 64px bar with plain text links (Home · Live · Legends · Players · Matches · Squads) and a sliding sky underline on the active link, outlined "Login →" pill CTA, sky pulsing LIVE badge, two-line wordmark with "HUB" tag, near-black blur surface
- Light theme re-tuned to a blue-tinted `#eef5fa` surface
- Verified: build clean, 33/33 tests, 0 lint errors, both themes render, secondary pages themed

## 2.7.0 — 2026-08-11

### The Complete Player Archive — every country, every era

- **Player catalog grown from 148 → 340 real players across 20 nations**: added full squads for Zimbabwe, Ireland, Scotland, Netherlands, UAE, Nepal, USA, Canada, Namibia and Oman (Associate cricket), plus ~90 retired legends of the past from every era — Bradman-era greats (Garry Sobers, Hanif Mohammad, Fred Trueman), the 70s–80s West Indies pace quartet (Holding, Garner, Roberts, Marshall), Asian icons (Gavaskar, Miandad, Wasim Akram, Kapil Dev), the 2000s generation (Ponting, Dravid, Kumble, Steyn, Malinga) and women's legends (Charlotte Edwards, Belinda Clark, Jhulan Goswami, Sarah Taylor)
- **Global player search** — new `/players` page: live name search across all 340 players (any country, any era), country + role filters, Legends-only toggle, photo grid
- **Command palette (⌘K) upgraded** — debounced live search against the backend catalog with photo avatars, so any player anywhere is one keystroke away; previously it only searched ~20 local legends
- **New player profile page** (`/players/:id`) — large photo, Legend crown, nickname, country/role, career runs & wickets, full Test/ODI/T20I stat cards, achievements, bio, represented teams
- **Squads page rebuilt** — all 20 nations ordered by team, in-squad search box, every player card links to their profile
- **Real profile photos** — server-side Wikipedia enrichment (disk-cached, throttled, retry-safe) now resolves **203/340** photos at seed time; the rest resolve live in the browser and cache in localStorage, so every player gets a real profile picture
- **Backend search upgraded** — `GET /api/players/search` matches name, full name, nickname, country, teams, role and batting/bowling style, sorted by legend + rating, limit raised to 30
- **Live scorecards stay realistic** — match XIs prefer active (non-legend) players so past legends appear in profiles, not in today's playing XI
- New Team docs for the 10 Associate nations with captains; 108 legends flagged in the DB

## 2.6.0 — 2026-08-11

### Crimson & gold redesign — inspired by mycrickethub.in

- **Complete re-theme to a crimson/gold brand** (`#940001` + `#f0c040`): Tailwind color scales remapped in the config (orange → crimson, amber → gold) so every page restyles automatically; CSS tokens updated to the reference palette with GitHub-dark surfaces (`#0d1117`/`#161b22`/`#1c2230`)
- **Display font switched to Plus Jakarta Sans** (Inter body retained), loaded via Google Fonts
- **Home page rebuilt to mirror the reference's section flow**: hero with trust chips + stats row → 8-card Platform Features grid → 4-step How It Works → Live Today match cards (LIVE NOW/UPCOMING/COMPLETED badges, score strip, Join CTA) → GOAT podium (top-3 with gradient-border "MOST POPULAR" #1 card) → featured legends → From the Records → CTA band
- **Navbar** — new pulsating LIVE badge linking to `/matches`, crimson active pill, red gradient logo chip, "Login / Sign Up" mobile entry
- **Footer** — reference-style columns (Platform / Resources / Project) with LIVE Matches link and contact block
- **Crimson gradient text** hero treatment, pulsing live-dot animation, gold availability checkmarks
- Production build verified: crimson/gold theme across every page, 33/33 tests, lint 0 errors

### Fixes

- Fixed Navbar NavLink render-prop that was being passed as a child function (whitespace on the tag line broke `typeof children === "function"`), leaving nav links empty
- Dev-server root cause: Vite ran with cwd `/` under launchd, so Tailwind silently fell back to its default config and generated **zero utilities** — launcher now `process.chdir`s into `frontend/` before starting

## 2.5.0 — 2026-08-10

### 3D home page redesign

- **3D hero scene** — pure-CSS cricket ball with spinning seams, specular highlights, dashed orbit rings, ambient glow, floating motion and ground shadow (no images/canvas)
- **Mouse parallax** — the ball and background orbs track the cursor with spring physics; layered depth (ball, orbs, grid, particles)
- **Floating stat chips** — glass chips around the ball (top legend, world cup finals, formats) with staggered float animation
- **TiltCard component** — 3D tilt-on-hover with cursor-tracked glare for product suite and featured legend cards (spring physics, reduced-motion safe)
- **Particle field** — 14 drifting glowing motes in the hero backdrop
- Refined hero typography with gradient glow drop-shadow; two-column layout on desktop

## 2.4.0 — 2026-08-10

### Accounts & sync

- Login / Register pages with demo accounts (admin@cricketlegends.com / admin123)
- Auth context: JWT session persisted to localStorage, user menu with sign-out in navbar (desktop + mobile)
- Favorites now sync to the backend (`PUT /api/auth/favorites`) and merge on sign-in — same favorites on every device

### Frontend ↔ backend connectivity

- Matches page loads live API data with curated offline fallback + loading skeletons + source badge ("Live API data" / "Offline archive")
- Home ticker refreshes with live match results when the API is reachable
- Backend `favoriteLegends` field + endpoint, covered by 3 new tests (19 total)

### Engineering quality

- **Global error boundary** with friendly fallback (caught a real bug during development)
- **Vitest test suite** (33 tests): GOAT model, formatting utils, dataset integrity, LegendCard component
- **ESLint 9 flat config** wired — 0 errors; fixed a stale-closure dependency bug in the command palette and dead code in the quiz
- **CI workflow** (`.github/workflows/ci.yml`): frontend lint/test/build + backend tests against a Mongo service container
- 2 new women's legends (Smriti Mandhana, Meg Lanning) with matching SVG avatars + 3 women's-cricket quiz questions
- `.gitignore` now excludes `.freebuff/` local tooling state

## 2.3.0 — 2026-08-10

### God-level UI/UX pass

- **Live ticker** — seamless marquee of historic results and headlines under the navbar (pauses on hover, edge-faded)
- **Legend spotlight** — featured #1 legend card on the home hero: glowing avatar, GOAT badge, career stat chips, gradient border
- **Premium surfaces** — card shine sweep on hover across the whole app, button shine on primary/gold CTAs, gradient-border cards
- **Navbar** — sliding animated active pill (spring physics via framer-motion layout animations)
- **Legend detail** — radial glow + orange ring behind the avatar, gradient-border GOAT score card
- **404 page** — animated bouncing cricket ball

## 2.2.0 — 2026-08-10

### New pages & data

- **World Cup History page** — every men's ODI World Cup (1975–2023) and T20 World Cup (2007–2024): winners, runners-up, finals, venues, and player of the tournament
- **ICC Rankings page** — curated top-5 batting, bowling, and all-rounder rankings across Test/ODI/T20
- 6 new legends (20 total) including women's icons Mithali Raj, Ellyse Perry, Smriti Mandhana, plus Ben Stokes, Kane Williamson, Babar Azam, Rashid Khan, Shakib Al Hasan — with local SVG avatars
- Expanded records dataset and quiz questions

### Backend

- Split `server.js` → `app.js` (testable Express app) + `server.js` (bootstrap)
- Jest + Supertest suite (16 tests): auth flow, players CRUD/search/filters, 404 handling — `npm test`
- Enriched seed: 14 players (women's + international), 13 teams, 7 matches (2011 WC final, IND-PAK T20 WC 2024, Women's WC 2022)

### Fixes & polish

- Replaced hotlinked Wikipedia images (blocked by browsers) with local SVG avatars for all legends — fully offline-capable
- Fixed malformed `backend/.env.example` (`[TEMPLATE]` header broke dotenv parsing)
- Opted into React Router v7 future flags to silence upgrade warnings
- Rate limiter + request logging disabled in test env

## 2.1.1 — 2026-08-10

### Fixes & polish

- Replaced hotlinked Wikipedia images (blocked by browsers) with local SVG avatars for all 14 legends — fully offline-capable
- Fixed malformed `backend/.env.example` (`[TEMPLATE]` header broke dotenv parsing)
- Opted into React Router v7 future flags to silence upgrade warnings
- Verified full stack: seeded MongoDB (players, teams, matches, users) and validated auth/search/profile API endpoints

## 2.1.0 — 2026-07-26

### Product depth

- GOAT Calculator page with weighted breakdown bars
- Country statistics page with aggregates
- Profile export (CSV/JSON), share, and print styles
- Reading mode toggle in navbar
- Global keyboard shortcuts (`/`, `t`, `g` chords)
- API client with offline fallback (`lib/api.js`)
- SEO head manager component
- Component documentation + Prettier config
- Two additional legends (Ponting, Kapil Dev)

## 2.0.0 — 2026-07-24

### Complete product redesign

- Modular frontend architecture (`components`, `pages`, `hooks`, `utils`, `data`, `context`)
- Design system with CSS tokens + reusable UI primitives
- Premium home, legends, compare, hall of fame, records, matches, dream team, quiz, timeline
- Command palette (⌘K), theme cycle, favorites, local persistence
- GOAT calculator with transparent scoring
- Charts (bar + radar), motion system, aurora background
- SEO: meta, OG/Twitter, JSON-LD, sitemap, robots, manifest
- PWA service worker + installable manifest
- Accessibility: skip link, focus states, reduced motion
- Code splitting via lazy routes + manual chunks
- Backend seed data + auth fixes retained from v1 hotfix line

## 1.0.x — 2026-03 → 2026-07

- Initial MERN scaffold
- Auth, players, teams, matches API
- Basic React + Tailwind UI
