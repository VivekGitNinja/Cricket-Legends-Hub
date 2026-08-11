// Cricket Legends Hub service worker.
//
// Update-safe by design:
//  - Navigations are network-first, so every visit fetches the latest build
//    (no stale index.html -> no dead hashed-chunk requests after a deploy).
//  - The cache name is versioned; bump CACHE to invalidate everything.
//  - Precache paths are relative to this file so they stay inside the SW scope
//    (works on the /Cricket-Legends-Hub/ GitHub Pages sub-path).
const CACHE = 'clh-v2'
const ASSETS = ['./', './index.html', './manifest.webmanifest', './favicon.svg']

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(ASSETS)).catch(() => {}))
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
  )
  self.clients.claim()
})

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return
  const req = event.request

  // Navigations: network-first so users always get the latest deploy.
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req)
        .then((res) => {
          if (res.ok) {
            const copy = res.clone()
            caches.open(CACHE).then((cache) => cache.put(req, copy))
          }
          return res
        })
        .catch(() =>
          caches
            .match(req)
            .then((cached) => cached || caches.match('./index.html'))
        )
    )
    return
  }

  // Hashed assets and other GETs: stale-while-revalidate (safe — URLs change
  // with each build, and the index.html that references them is always fresh).
  event.respondWith(
    caches.match(req).then((cached) => {
      const fetched = fetch(req)
        .then((res) => {
          if (res.ok) {
            const copy = res.clone()
            caches.open(CACHE).then((cache) => cache.put(req, copy))
          }
          return res
        })
        .catch(() => cached)
      return cached || fetched
    })
  )
})
