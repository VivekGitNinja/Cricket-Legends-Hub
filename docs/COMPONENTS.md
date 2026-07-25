# Component Documentation

## Layout

| Component | Path | Role |
|-----------|------|------|
| `MainLayout` | `components/layout/MainLayout.jsx` | App shell: nav, outlet, footer, effects, palette |
| `Navbar` | `components/layout/Navbar.jsx` | Primary nav, theme, reading mode, favorites, ⌘K |
| `Footer` | `components/layout/Footer.jsx` | Site links + author |

## Design system (`components/ui`)

| Component | Props highlights |
|-----------|------------------|
| `Button` | `variant`, `size`, `as` (polymorphic) |
| `Card` | `hover` glass surface |
| `Badge` | `tone`: brand/gold/sky/emerald/violet/muted |
| `Avatar` | `name`, `src`, `size` with initials fallback |
| `Input` / `Select` | Accessible form controls |
| `Section` | `eyebrow`, `title`, `description`, `action` |
| `EmptyState` | Zero-data UX |
| `Skeleton` | Loading placeholders |
| `StatPill` | Compact metric |
| `Seo` | Client document title/meta updater |

## Feature components

| Component | Role |
|-----------|------|
| `LegendCard` | Collection card + favorite toggle |
| `LegendFilters` | Search / country / role / sort |
| `CommandPalette` | Global search + navigation |
| `StatsBars` | Head-to-head bar chart |
| `CareerRadar` | Skill radar for a legend |
| `AuroraBackground` | Ambient mesh/aurora |
| `ScrollProgress` | Reading progress bar |
| `BackToTop` | Floating scroll control |

## Pages

See `src/pages/*` — each route is a lazy-loaded screen composing the above primitives.
