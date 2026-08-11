import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { LEGENDS } from '../data/legends'
import { api } from '../lib/api'
import { storage, STORAGE_KEYS } from '../utils/storage'
import { useAuth } from './AuthContext'

const AppContext = createContext(null)

export function AppProvider({ children }) {
  const { user, token, saveFavorites } = useAuth()
  const [favorites, setFavorites] = useState(() => storage.get(STORAGE_KEYS.favorites, []))
  const [bookmarks, setBookmarks] = useState(() => storage.get(STORAGE_KEYS.bookmarks, []))
  const [dreamTeam, setDreamTeam] = useState(() => storage.get(STORAGE_KEYS.dreamTeam, []))
  const [commandOpen, setCommandOpen] = useState(false)
  const [readingMode, setReadingMode] = useState(() => storage.get(STORAGE_KEYS.readingMode, false))
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => storage.set(STORAGE_KEYS.favorites, favorites), [favorites])
  useEffect(() => storage.set(STORAGE_KEYS.bookmarks, bookmarks), [bookmarks])
  useEffect(() => storage.set(STORAGE_KEYS.dreamTeam, dreamTeam), [dreamTeam])
  useEffect(() => storage.set(STORAGE_KEYS.readingMode, readingMode), [readingMode])

  // When a signed-in user loads, merge their server-side favorites into local state.
  useEffect(() => {
    if (user?.favoriteLegends?.length) {
      setFavorites((prev) => Array.from(new Set([...prev, ...user.favoriteLegends])))
    }
  }, [user])

  // Keep server favorites in sync while signed in (offline-tolerant).
  useEffect(() => {
    if (user) {
      saveFavorites(favorites)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [favorites, user])

  // On sign-in, pull the user's server-side dream team if the local one is empty.
  useEffect(() => {
    let cancelled = false
    if (user && token) {
      api
        .profile(token)
        .then((res) => {
          if (cancelled) return
          const ids = res?.user?.dreamTeamLegends || []
          if (ids.length) setDreamTeam((prev) => (prev.length ? prev : ids))
        })
        .catch(() => {})
    }
    return () => {
      cancelled = true
    }
  }, [user, token])

  // Persist dream team changes to the server while signed in (debounced).
  useEffect(() => {
    if (!user || !token) return
    const t = setTimeout(() => {
      api.saveDreamTeam(token, dreamTeam).catch(() => {})
    }, 800)
    return () => clearTimeout(t)
  }, [dreamTeam, user, token])

  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement
      const max = el.scrollHeight - el.clientHeight
      setScrollProgress(max > 0 ? (el.scrollTop / max) * 100 : 0)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const onKey = (e) => {
      const meta = e.metaKey || e.ctrlKey
      if (meta && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setCommandOpen((v) => !v)
      }
      if (e.key === 'Escape') setCommandOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const toggleFavorite = useCallback((id) => {
    setFavorites((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  }, [])

  const toggleBookmark = useCallback((id) => {
    setBookmarks((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  }, [])

  const addToDreamTeam = useCallback((id) => {
    setDreamTeam((prev) => {
      if (prev.includes(id) || prev.length >= 11) return prev
      return [...prev, id]
    })
  }, [])

  const removeFromDreamTeam = useCallback((id) => {
    setDreamTeam((prev) => prev.filter((x) => x !== id))
  }, [])

  const clearDreamTeam = useCallback(() => setDreamTeam([]), [])

  const favoriteLegends = useMemo(
    () => LEGENDS.filter((l) => favorites.includes(l.id)),
    [favorites]
  )

  const value = useMemo(
    () => ({
      favorites,
      bookmarks,
      dreamTeam,
      favoriteLegends,
      commandOpen,
      setCommandOpen,
      readingMode,
      setReadingMode,
      scrollProgress,
      toggleFavorite,
      toggleBookmark,
      addToDreamTeam,
      removeFromDreamTeam,
      clearDreamTeam,
      isFavorite: (id) => favorites.includes(id),
      isBookmarked: (id) => bookmarks.includes(id),
      inDreamTeam: (id) => dreamTeam.includes(id),
    }),
    [
      favorites,
      bookmarks,
      dreamTeam,
      favoriteLegends,
      commandOpen,
      readingMode,
      scrollProgress,
      toggleFavorite,
      toggleBookmark,
      addToDreamTeam,
      removeFromDreamTeam,
      clearDreamTeam,
    ]
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
