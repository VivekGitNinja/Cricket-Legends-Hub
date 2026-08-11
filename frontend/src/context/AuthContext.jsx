import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { api } from '../lib/api'
import { storage, STORAGE_KEYS } from '../utils/storage'

const AuthContext = createContext(null)

/**
 * Session + favorites persistence against the backend API.
 * Token and user are mirrored to localStorage so the session survives reloads.
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => storage.get(STORAGE_KEYS.user, null))
  const [token, setToken] = useState(() => storage.get(STORAGE_KEYS.token, null))
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    storage.set(STORAGE_KEYS.token, token)
  }, [token])

  useEffect(() => {
    storage.set(STORAGE_KEYS.user, user)
  }, [user])

  const login = useCallback(async (email, password) => {
    setLoading(true)
    setError(null)
    try {
      const res = await api.login(email, password)
      setToken(res.token)
      setUser(res.user)
      return { ok: true, user: res.user }
    } catch (e) {
      setError(e.message || 'Login failed')
      return { ok: false, error: e.message || 'Login failed' }
    } finally {
      setLoading(false)
    }
  }, [])

  const register = useCallback(async (name, email, password) => {
    setLoading(true)
    setError(null)
    try {
      const res = await api.register(name, email, password)
      setToken(res.token)
      setUser(res.user)
      return { ok: true, user: res.user }
    } catch (e) {
      setError(e.message || 'Registration failed')
      return { ok: false, error: e.message || 'Registration failed' }
    } finally {
      setLoading(false)
    }
  }, [])

  const logout = useCallback(() => {
    setToken(null)
    setUser(null)
  }, [])

  const saveFavorites = useCallback(
    async (ids) => {
      if (!token) return
      try {
        await api.updateFavorites(token, ids)
      } catch {
        /* offline-tolerant — local favorites remain the source of truth */
      }
    },
    [token]
  )

  const value = useMemo(
    () => ({ user, token, loading, error, login, register, logout, saveFavorites }),
    [user, token, loading, error, login, register, logout, saveFavorites]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
