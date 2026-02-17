import { Link } from 'react-router-dom'
import { useTheme } from '@/hooks/useTheme'
import { useAuth } from '@/hooks/useAuth'

export function SettingsPage() {
  const { theme, setTheme, isDark } = useTheme()
  const { user } = useAuth()

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Settings</h1>

      {/* Theme */}
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
          All data is stored locally on your device.
        </p>
      </div>
    </div>
  )
}
