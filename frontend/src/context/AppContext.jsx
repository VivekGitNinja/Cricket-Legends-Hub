import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { LEGENDS } from '../data/legends'
import { storage, STORAGE_KEYS } from '../utils/storage'

const AppContext = createContext(null)

export function AppProvider({ children }) {
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
