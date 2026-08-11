const safeParse = (raw, fallback) => {
  try {
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

export const storage = {
  get(key, fallback = null) {
    if (typeof window === 'undefined') return fallback
    return safeParse(window.localStorage.getItem(key), fallback)
  },
  set(key, value) {
    if (typeof window === 'undefined') return
    window.localStorage.setItem(key, JSON.stringify(value))
  },
  remove(key) {
    if (typeof window === 'undefined') return
    window.localStorage.removeItem(key)
  },
}

export const STORAGE_KEYS = {
  theme: 'clh-theme',
  token: 'clh-token',
  user: 'clh-user',
  favorites: 'clh-favorites',
  bookmarks: 'clh-bookmarks',
  dreamTeam: 'clh-dream-team',
  quizBest: 'clh-quiz-best',
  recentSearch: 'clh-recent-search',
  readingMode: 'clh-reading-mode',
}
