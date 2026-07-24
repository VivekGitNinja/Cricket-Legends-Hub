# Production Readiness Report

## Ready

- Modular frontend architecture
- Design system + tokens
- Core product features complete (no placeholder TODOs in app routes)
- Production build succeeds
- SEO/PWA/accessibility baseline
- Backend auth hardening + seed script
- Deployment configs for GH Pages / Vercel / Netlify

## Before public launch

1. Replace Wikipedia hotlinked images with licensed local assets
2. Set strong `JWT_SECRET` in production
3. Use managed MongoDB (Atlas) with network rules
4. Point `FRONTEND_URL` / CORS to real domain
5. Add monitoring (Sentry) and analytics if desired
6. Run Lighthouse CI in GitHub Actions

## Technical debt (low)

- ESLint/Prettier configs not fully wired as packages
- Backend not yet fully consumed by every frontend page (by design: offline-first)
- Quiz difficulty weights are flat
- No SSR for player deep links yet
