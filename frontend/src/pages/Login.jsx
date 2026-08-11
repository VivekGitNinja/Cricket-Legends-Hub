import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { LogIn } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import Section from '../components/ui/Section'
import Seo from '../components/ui/Seo'

export default function Login() {
  const { login, loading } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from || '/favorites'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [formError, setFormError] = useState('')

  const onSubmit = async (e) => {
    e.preventDefault()
    setFormError('')
    if (!email || !password) {
      setFormError('Email and password are required')
      return
    }
    const res = await login(email, password)
    if (res.ok) {
      navigate(from, { replace: true })
    } else {
      setFormError(res.error || 'Login failed')
    }
  }

  const inputClass =
    'w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-glass)] px-4 py-3 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-orange-400/60 focus:outline-none focus:ring-2 focus:ring-orange-400/30 transition'

  return (
    <>
      <Seo title="Login" description="Sign in to Cricket Legends Hub to sync your favorites." path="/login" />
      <Section>
        <div className="mx-auto max-w-md">
          <Card hover={false} shine={false} className="gradient-border p-6 sm:p-8">
            <div className="mb-6 text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-rose-600 shadow-[var(--shadow-glow)]">
                <LogIn className="h-5 w-5 text-white" />
              </div>
              <h1 className="font-display text-2xl font-bold text-[var(--text-primary)]">Welcome back</h1>
              <p className="mt-1 text-sm text-[var(--text-secondary)]">
                Sign in to sync your favorites and dream team.
              </p>
            </div>

            <form onSubmit={onSubmit} className="space-y-4" noValidate>
              <div>
                <label htmlFor="email" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label htmlFor="password" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={inputClass}
                />
              </div>

              {formError && (
                <p className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-300">
                  {formError}
                </p>
              )}

              <Button type="submit" size="lg" className="w-full" disabled={loading}>
                {loading ? 'Signing in…' : 'Sign in'}
              </Button>
            </form>

            <div className="mt-5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-glass)] p-3 text-xs text-[var(--text-muted)]">
              <p className="font-semibold text-[var(--text-secondary)]">Demo accounts</p>
              <p className="mt-1 font-mono">admin@cricketlegends.com / admin123</p>
              <p className="font-mono">demo@cricketlegends.com / demo123</p>
            </div>

            <p className="mt-5 text-center text-sm text-[var(--text-secondary)]">
              New here?{' '}
              <Link to="/register" className="font-semibold text-orange-400 hover:text-orange-300">
                Create an account
              </Link>
            </p>
          </Card>
        </div>
      </Section>
    </>
  )
}
