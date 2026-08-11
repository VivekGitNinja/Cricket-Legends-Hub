import { useEffect, useState } from 'react'
import { storage } from '../../utils/storage'
import { cn } from '../../utils/cn'
import { initials } from '../../utils/format'

const PHOTO_CACHE_KEY = 'clh-photo-cache'

/**
 * Avatar with a real photo. If `src` is missing, the photo is resolved
 * client-side from Wikipedia (free, no key) and cached in localStorage,
 * so each player's photo is fetched at most once per browser.
 */
export default function PlayerAvatar({ name, src, size = 'md', className }) {
  const [photo, setPhoto] = useState(() => src || storage.get(PHOTO_CACHE_KEY, {})[name] || null)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    if (src) {
      setPhoto(src)
      return
    }
    const cached = storage.get(PHOTO_CACHE_KEY, {})[name]
    if (cached) {
      setPhoto(cached)
      return
    }
    let cancelled = false
    const ctrl = new AbortController()
    const t = setTimeout(() => ctrl.abort(), 8000)
    fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(name.replace(/\s+/g, '_'))}?redirect=true`, {
      signal: ctrl.signal,
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => {
        if (cancelled) return
        const url = json?.thumbnail?.source?.split('?')[0]
        if (!url) return
        setPhoto(url)
        const cache = storage.get(PHOTO_CACHE_KEY, {})
        cache[name] = url
        storage.set(PHOTO_CACHE_KEY, cache)
      })
      .catch(() => {})
      .finally(() => clearTimeout(t))
    return () => {
      cancelled = true
      clearTimeout(t)
    }
  }, [name, src])

  const sizes = {
    sm: 'h-10 w-10 text-sm',
    md: 'h-14 w-14 text-base',
    lg: 'h-20 w-20 text-xl',
    xl: 'h-28 w-28 text-2xl',
  }

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-full bg-gradient-to-br from-[#2F74B4] to-[#0D4669] ring-2 ring-white/10',
        sizes[size],
        className
      )}
    >
      {photo && !failed ? (
        <img
          src={photo}
          alt={name || 'Player'}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover"
          onError={() => setFailed(true)}
        />
      ) : (
        <span className="flex h-full w-full items-center justify-center font-bold text-white">
          {initials(name)}
        </span>
      )}
    </div>
  )
}
