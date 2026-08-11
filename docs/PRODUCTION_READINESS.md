# Production Readiness Report

## Ready

- Modular frontend architecture
- Design system + tokens
- Core product features complete (no placeholder TODOs in app routes)
- Production build succeeds
- Backend test suite (Jest + Supertest, 19 tests: auth, favorites, players, 404s)
- Frontend test suite (Vitest + Testing Library, 33 tests: GOAT model, formats, dataset, components)
- ESLint wired (0 errors) + global error boundary
- CI workflow (lint → test → build on push/PR, backend tests against Mongo service)
- Accounts: login/register, JWT sessions, cross-device favorites sync
- Matches page + home ticker consume the live API with curated offline fallback
- World Cup history + ICC rankings content pages
- SEO/PWA/accessibility baseline
- Backend auth hardening + seed script
- Deployment configs for GH Pages / Vercel / Netlify

## Before public launch

1. Set strong `JWT_SECRET` in production
2. Use managed MongoDB (Atlas) with network rules
3. Point `FRONTEND_URL` / CORS to real domain
4. Add monitoring (Sentry) and analytics if desired
5. Run Lighthouse CI in GitHub Actions

## Resolved

- ~~Replace Wikipedia hotlinked images with licensed local assets~~ — done: all 14 legends now use local SVG avatars (`frontend/public/legends/`), which also makes the app fully offline-capable and fixes browser image blocking (ORB).

## Technical debt (low)

- Legends page still uses the curated catalog by design (API players lack GOAT scores/tags/milestones — the curated dataset is the better experience)
- Quiz difficulty weights are flat
- No SSR for player deep links yet
- Backend tests need a local Mongo (CI provides one via service container)
