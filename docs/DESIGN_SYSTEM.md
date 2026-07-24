# Design System

## Foundations

### Color tokens

Defined in `frontend/src/styles/tokens.css`:

- Brand orange scale (`--brand-*`)
- Accent sky / gold / emerald / violet
- Semantic surfaces: `--bg-base`, `--bg-elevated`, `--bg-glass`
- Text: primary / secondary / muted

Light theme overrides via `[data-theme="light"]`.

### Typography

- **Display:** Space Grotesk
- **Body:** Inter
- **Mono:** JetBrains Mono (optional UI chrome)

### Spacing & radius

4px base scale via CSS vars (`--space-*`) and Tailwind utilities.  
Radius scale: sm → 2xl + full.

### Elevation

Glass panels + soft shadows + brand glow for primary CTAs.

## Components

| Component | Purpose |
|-----------|---------|
| `Button` | Primary / secondary / ghost / gold / danger |
| `Card` | Glass surface with hover lift |
| `Badge` | Status / tags |
| `Avatar` | Image with initials fallback |
| `Input` / `Select` | Form controls |
| `Section` | Page section with eyebrow/title |
| `EmptyState` | Empty / zero results |
| `Skeleton` | Loading placeholders |
| `StatPill` | Compact metric |

## Motion

- Framer Motion page transitions
- Staggered card reveals
- Aurora background (GPU-friendly blur orbs)
- Respects `prefers-reduced-motion`

## Accessibility

- Skip link
- Semantic landmarks
- Focus-visible rings
- Keyboard command palette
- ARIA labels on icon buttons
- Color contrast tuned for dark UI
