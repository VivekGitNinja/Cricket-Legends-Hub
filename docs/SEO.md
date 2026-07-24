# SEO Report

## Implemented

- Unique title + meta description
- Keywords + author
- Canonical URL
- Open Graph tags
- Twitter Card tags
- JSON-LD `WebSite` + `SearchAction`
- `robots.txt`
- `sitemap.xml`
- Semantic HTML landmarks (`header`, `main`, `footer`, `nav`, `section`)
- Meaningful heading hierarchy on pages
- Crawlable static routes listed in sitemap

## Notes

- SPA routes rely on host SPA fallback for deep links
- Player pages are client-rendered; for full SSR/SSG, migrate to Next/Astro later
- OG image provided as SVG (`public/og-image.svg`)
