import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { useTheme } from '../context/ThemeContext'

/**
 * Global product shortcuts:
 * g h → home, g l → legends, g c → compare, t → theme, / → command palette
 */
export function useKeyboardShortcuts() {
  const navigate = useNavigate()
  const { setCommandOpen } = useApp()
  const { cycleTheme } = useTheme()
  const pending = useRef(null)

  useEffect(() => {
    const onKey = (e) => {
      const tag = (e.target?.tagName || '').toLowerCase()
      if (tag === 'input' || tag === 'textarea' || e.target?.isContentEditable) return
      if (e.metaKey || e.ctrlKey || e.altKey) return

      if (e.key === '/') {
        e.preventDefault()
        setCommandOpen(true)
        return
      }

      if (e.key.toLowerCase() === 't' && !pending.current) {
        cycleTheme()
        return
      }

      if (e.key.toLowerCase() === 'g') {
        pending.current = 'g'
        window.setTimeout(() => {
          pending.current = null
        }, 800)
        return
      }

      if (pending.current === 'g') {
        const map = {
          h: '/',
          l: '/legends',
          c: '/compare',
          f: '/hall-of-fame',
          d: '/dream-team',
          q: '/quiz',
          o: '/goat',
          n: '/countries',
        }
        const path = map[e.key.toLowerCase()]
        if (path) {
          e.preventDefault()
          navigate(path)
        }
        pending.current = null
      }
    }

    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [navigate, setCommandOpen, cycleTheme])
}
