import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { UserPlus } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import Section from '../components/ui/Section'
import Seo from '../components/ui/Seo'

export default function Register() {
  const { register, loading } = useAuth()
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [formError, setFormError] = useState('')

  const onSubmit = async (e) => {
    e.preventDefault()
    setFormError('')
    if (!name || !email || !password) {
      setFormError('Name, email and password are required')
      return
    }
    if (password.length < 6) {
      setFormError('Password must be at least 6 characters')
      return
    }
    const res = await register(name, email, password)
    if (res.ok) {
      navigate('/favorites', { replace: true })
    } else {
      setFormError(res.error || 'Registration failed')
    }
  }

  const inputClass =
    'w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-glass)] px-4 py-3 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-orange-400/60 focus:outline-none focus:ring-2 focus:ring-orange-400/30 transition'

  return (
    <>
      <Seo title="Register" description="Create an account on Cricket Legends Hub." path="/register" />
      <Section>
        <div className="mx-auto max-w-md">
          <Card hover={false} shine={false} className="gradient-border p-6 sm:p-8">
            <div className="mb-6 text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 shadow-[var(--shadow-gold)]">
                <UserPlus className="h-5 w-5 text-slate-950" />
              </div>
              <h1 className="font-display text-2xl font-bold text-[var(--text-primary)]">Join the hub</h1>
              <p className="mt-1 text-sm text-[var(--text-secondary)]">
                Create a free account to sync favorites across devices.
              </p>
            </div>

            <form onSubmit={onSubmit} className="space-y-4" noValidate>
              <div>
                <label htmlFor="name" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                  Name
                </label>
                <input
                  id="name"
                  type="text"
                  autoComplete="name"
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={inputClass}
                />
              </div>
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
                  autoComplete="new-password"
                  placeholder="At least 6 characters"
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
                {loading ? 'Creating account…' : 'Create account'}
              </Button>
            </form>

            <p className="mt-5 text-center text-sm text-[var(--text-secondary)]">
              Already have an account?{' '}
              <Link to="/login" className="font-semibold text-orange-400 hover:text-orange-300">
                Sign in
              </Link>
            </p>
          </Card>
        </div>
      </Section>
    </>
  )
}
