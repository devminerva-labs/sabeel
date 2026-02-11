import { useTheme } from '@/hooks/useTheme'

export function SettingsPage() {
  const { theme, setTheme, isDark } = useTheme()

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
