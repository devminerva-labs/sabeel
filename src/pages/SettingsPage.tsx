import { Link, useNavigate } from 'react-router-dom'
import { useTheme } from '@/hooks/useTheme'
import { useAuth } from '@/hooks/useAuth'

export function SettingsPage() {
  const { theme, setTheme, isDark } = useTheme()
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  async function handleSignOut() {
    await signOut()
    navigate('/login')
  }

  function handleRefresh() {
    window.location.reload()
  }

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Account</h1>

      {/* Account info */}
      {user ? (
        <div className="space-y-3">
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Signed in as</h2>
          <div className="rounded-xl border border-border bg-background p-4 space-y-3">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-base">
                {user.email?.[0]?.toUpperCase() ?? '?'}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{user.email}</p>
                <p className="text-xs text-muted-foreground">
                  {user.app_metadata?.provider === 'google' ? 'Google account' : 'Email account'}
                </p>
              </div>
            </div>

            <div className="flex gap-2 pt-1">
              <button
                onClick={handleRefresh}
                className="flex-1 rounded-lg border border-border px-3 py-2 text-sm font-medium text-foreground hover:bg-muted/50 transition-colors flex items-center justify-center gap-1.5"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="23 4 23 10 17 10" />
                  <polyline points="1 20 1 14 7 14" />
                  <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
                </svg>
                Refresh
              </button>
              <button
                onClick={handleSignOut}
                className="flex-1 rounded-lg border border-red-200 dark:border-red-900/40 px-3 py-2 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-xl border border-border bg-background p-4 space-y-3">
          <p className="text-sm text-muted-foreground">You're not signed in. Sign in to sync your progress across devices.</p>
          <Link
            to="/login"
            className="block w-full rounded-lg bg-primary text-primary-foreground px-3 py-2 text-sm font-medium text-center hover:opacity-90 transition-opacity"
          >
            Sign in
          </Link>
        </div>
      )}

      {/* Appearance */}
      <div className="space-y-3">
        <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Appearance</h2>
        <div className="flex gap-2">
          {(['light', 'dark', 'system'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTheme(t)}
              className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium capitalize transition-colors ${
                theme === t
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
        <p className="text-xs text-muted-foreground">
          Currently: {isDark ? 'Dark' : 'Light'} mode
        </p>
      </div>

      {/* Admin link — only visible to admin */}
      {user?.id && ['41dc3097-39b0-482f-a087-62c9a6bdbc5d', 'c0910e56-47e9-4474-bff6-5cdb747c555f'].includes(user.id) && (
        <div className="space-y-2">
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Admin</h2>
          <Link
            to="/app/admin"
            className="block rounded-lg border border-border px-4 py-3 text-sm font-medium text-foreground hover:bg-muted/50 transition-colors"
          >
            User Dashboard
            <span className="block text-xs text-muted-foreground mt-0.5">View all signed-in users and their progress</span>
          </Link>
        </div>
      )}

      {/* About */}
      <div className="space-y-2">
        <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">About</h2>
        <p className="text-sm text-muted-foreground">
          Sabeel v1.0 — Your Ramadan spiritual productivity companion.
        </p>
      </div>
    </div>
  )
}
