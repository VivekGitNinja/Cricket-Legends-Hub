import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { storage, STORAGE_KEYS } from '../utils/storage'

const ThemeContext = createContext(null)

function getSystemTheme() {
  if (typeof window === 'undefined') return 'dark'
  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => storage.get(STORAGE_KEYS.theme, 'system'))
  const [resolved, setResolved] = useState(() =>
    theme === 'system' ? getSystemTheme() : theme
  )

  useEffect(() => {
    const next = theme === 'system' ? getSystemTheme() : theme
    setResolved(next)
    document.documentElement.setAttribute('data-theme', next)
    document.documentElement.classList.toggle('dark', next === 'dark')
    storage.set(STORAGE_KEYS.theme, theme)
  }, [theme])

  useEffect(() => {
    if (theme !== 'system') return undefined
    const mq = window.matchMedia('(prefers-color-scheme: light)')
    const handler = () => setResolved(getSystemTheme())
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [theme])

  const value = useMemo(
    () => ({
      theme,
      resolved,
      setTheme,
      cycleTheme: () =>
        setTheme((t) => (t === 'dark' ? 'light' : t === 'light' ? 'system' : 'dark')),
    }),
    [theme, resolved]
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider')
  return ctx
}
