# Architecture Documentation

## System overview

Cricket Legends Hub is a dual-layer product:

1. **Frontend product shell** — offline-capable React SPA with curated legends data
2. **Backend API** — Express + MongoDB for auth and CRUD (players, teams, matches)

The frontend is intentionally **data-resilient**: all primary UX works without the API using `src/data/legends.js`.

## Frontend architecture

```
UI (pages)
  → layout shell (Navbar / Footer / Command palette)
  → feature components (legends, charts, compare)
  → design system (ui/*)
  → domain utils (goat, format, storage)
  → context (theme, favorites, dream team)
  → data layer (curated JSON-like modules)
```

### Principles

- **Modular folders** by responsibility (not by “type dumping”)
- **Lazy-loaded routes** for code splitting
- **Design tokens** via CSS variables (`styles/tokens.css`)
- **Solid boundaries**: pages compose; components don’t fetch globally
- **Local-first state** for favorites / dream team / quiz best score

### Routing

| Path | Page |
|------|------|
| `/` | Home |
| `/legends` | Collection + filters |
| `/legends/:id` | Profile |
| `/compare` | Head-to-head |
| `/hall-of-fame` | Rankings |
| `/records` | Records |
| `/matches` | Match archive |
| `/dream-team` | XI builder |
| `/quiz` | Knowledge quiz |
| `/timeline` | Cricket history |
| `/favorites` | Saved legends |
| `/about` | About |

## Backend architecture

```
HTTP → middleware (helmet, cors, rate-limit, morgan)
     → routes
     → controllers
     → models (Mongoose)
     → MongoDB
```

Auth uses JWT bearer tokens. Admin-only mutations for players/teams/matches.

## GOAT model

`utils/goat.js` computes a weighted multi-format excellence score:

- Test/ODI volume & averages
- Wickets
- Longevity
- Peak rating
- Awards / impact

Curated `goatScore` is blended with the model for transparent ranking UI.

## Security notes

- Password hashing via bcrypt pre-save hook
- Rate limiting on API
- Helmet headers
- CORS restricted to frontend origin
- Public register always creates `role: user`
