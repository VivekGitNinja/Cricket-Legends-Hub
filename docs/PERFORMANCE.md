# Performance Report

## Build strategy

- Vite production build with `es2020` target
- Route-level `React.lazy` + `Suspense`
- Manual chunks: `react`, `motion`, `charts`
- CSS code splitting enabled
- Tree-shaking via ES modules

## Runtime

- Offline-first curated data (no blocking API on first paint)
- Lazy images via `loading="lazy"` + `decoding="async"`
- GPU-friendly aurora (blur + transform, no layout thrash)
- `prefers-reduced-motion` disables non-essential animation
- Local storage for favorites / dream team (no network)

## Production bundle (approx, gzip)

| Chunk | ~gzip |
|-------|------|
| react | 54 kB |
| motion | 38 kB |
| charts | 107 kB (loaded with compare/detail) |
| app core | ~16 kB |
| page chunks | 0.4–3 kB each |

## Recommendations for Lighthouse 100

1. Host self-served font subsets (woff2) instead of Google Fonts if needed
2. Generate AVIF/WebP player portraits when assets are owned
3. Preload critical CSS only
4. Enable Brotli/gzip at CDN edge
