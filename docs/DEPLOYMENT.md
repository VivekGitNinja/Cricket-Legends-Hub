# Deployment Guide

## Local development

1. Start MongoDB (optional for frontend-only)
2. `cd backend && npm run dev`
3. `cd frontend && npm run dev`

## GitHub Pages

`.github/workflows/deploy.yml`:

- Builds `frontend` with `VITE_BASE=/Cricket-Legends-Hub/`
- Publishes `frontend/dist` to `gh-pages`

Enable Pages from the `gh-pages` branch in repo settings.

## Vercel

- Framework: Vite
- Root directory: `frontend`
- Build command: `npm run build`
- Output: `dist`
- Rewrites: `/(.*) → /index.html`

## Netlify

```toml
[build]
  base = "frontend"
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

## Cloudflare Pages

- Build dir: `frontend`
- Build command: `npm run build`
- Output: `dist`
- SPA fallback enabled

## Environment

Frontend:

```
VITE_API_URL=https://your-api.example.com/api
VITE_BASE=/
```

Backend:

```
PORT=5000
MONGODB_URI=...
JWT_SECRET=...
FRONTEND_URL=https://your-frontend.example.com
NODE_ENV=production
```
