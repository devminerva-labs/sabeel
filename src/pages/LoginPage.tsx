import { useState, FormEvent } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'

type Tab = 'signin' | 'signup' | 'magic'

export function LoginPage() {
  const [tab, setTab] = useState<Tab>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [info, setInfo] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { signIn, signUp, sendMagicLink } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const next = searchParams.get('next') ?? '/app/halaqah'

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setInfo(null)
    setIsSubmitting(true)

    try {
      if (tab === 'signin') {
        const err = await signIn(email, password)
        if (err) { setError(err.message); return }
        navigate(next, { replace: true })
      } else if (tab === 'signup') {
        const err = await signUp(email, password)
        if (err) { setError(err.message); return }
        setInfo('Account created. Check your email to confirm, then sign in.')
        setTab('signin')
      } else {
        const err = await sendMagicLink(email)
        if (err) { setError(err.message); return }
        setInfo('Magic link sent — check your inbox.')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center space-y-1">
          <h1 className="text-2xl font-bold">Sign in to Sabeel</h1>
          <p className="text-sm text-muted-foreground">
            Required to join or create a Halaqah.
          </p>
        </div>

        {/* Tab selector */}
        <div className="flex rounded-lg border border-border overflow-hidden text-sm font-medium">
          {(['signin', 'signup', 'magic'] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => { setTab(t); setError(null); setInfo(null) }}
              className={`flex-1 py-2 transition-colors ${
                tab === t
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {t === 'signin' ? 'Sign in' : t === 'signup' ? 'Sign up' : 'Magic link'}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label htmlFor="email" className="text-sm font-medium">Email</label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          {tab !== 'magic' && (
            <div className="space-y-1">
              <label htmlFor="password" className="text-sm font-medium">Password</label>
              <input
                id="password"
                type="password"
                autoComplete={tab === 'signup' ? 'new-password' : 'current-password'}
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          )}

          {error && <p className="text-sm text-red-500">{error}</p>}
          {info && <p className="text-sm text-green-600 dark:text-green-400">{info}</p>}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-primary text-primary-foreground rounded-lg py-2.5 text-sm font-medium hover:opacity-90 disabled:opacity-50 transition-opacity"
          >
            {isSubmitting
              ? 'Please wait...'
              : tab === 'signin'
                ? 'Sign in'
                : tab === 'signup'
                  ? 'Create account'
                  : 'Send magic link'}
          </button>
        </form>

        <div className="text-center">
          <Link to="/app" className="text-sm text-muted-foreground hover:text-foreground underline">
            Continue without an account
          </Link>
        </div>
      </div>
    </div>
  )
}
