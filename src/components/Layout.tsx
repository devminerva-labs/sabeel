import { useEffect, useState } from 'react'
import { Outlet, NavLink } from 'react-router-dom'
import { OfflineIndicator } from '@/components/OfflineIndicator'
import { useTheme } from '@/hooks/useTheme'
import { useAuth } from '@/hooks/useAuth'
import { useRamadanContext } from '@/hooks/useRamadanContext'
import { getLaylahPhase } from '@/lib/ramadan-dates'
import { getPrayerTimes } from '@/lib/prayer-times'

const navItems = [
  { to: '/app', label: 'Home', icon: '🏠' },
  { to: '/app/quran', label: 'Quran', icon: '📖' },
  { to: '/app/prayer', label: 'Prayer', icon: '🕌' },
  { to: '/app/adhkar', label: 'Adhkar', icon: '📿' },
  { to: '/app/prophets', label: 'Stories', icon: '✦' },
  { to: '/app/halaqah', label: 'Halaqah', icon: '◎' },
] as const

export function Layout() {
  const { isDark, setTheme } = useTheme()
  const { user } = useAuth()
  const { dayNumber } = useRamadanContext()

  // Manage laylah-mode class here so stars persist across all /app/* pages.
  // Reschedules a re-check just after Maghrib so the theme activates without a reload.
  const [laylahTick, setLaylahTick] = useState(0)
  useEffect(() => {
    if (!dayNumber) {
      document.documentElement.classList.remove('laylah-mode')
      return
    }
    let timer: ReturnType<typeof setTimeout> | null = null
    try {
      const maghrib = getPrayerTimes(new Date()).maghrib
      const now = new Date()
      const phase = getLaylahPhase(dayNumber, now, maghrib)
      document.documentElement.classList.toggle('laylah-mode', phase === 'active')
      if (phase !== 'active' && maghrib > now) {
        const ms = maghrib.getTime() - now.getTime()
        timer = setTimeout(() => setLaylahTick((t) => t + 1), ms + 500)
      }
    } catch {
      const phase = getLaylahPhase(dayNumber)
      document.documentElement.classList.toggle('laylah-mode', phase === 'active')
    }
    return () => {
      document.documentElement.classList.remove('laylah-mode')
      if (timer) clearTimeout(timer)
    }
  }, [dayNumber, laylahTick])

  function toggleTheme() {
    setTheme(isDark ? 'light' : 'dark')
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <OfflineIndicator />

      {/* Sticky header */}
      <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="max-w-lg mx-auto flex items-center justify-between px-4 h-11">
          <span className="text-sm font-semibold text-primary">Sabeel</span>
          <div className="flex items-center gap-1">
            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              className="p-1.5 rounded-md hover:bg-muted transition-colors"
            >
              {isDark ? (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-yellow-400">
                  <circle cx="12" cy="12" r="5" />
                  <line x1="12" y1="1" x2="12" y2="3" />
                  <line x1="12" y1="21" x2="12" y2="23" />
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                  <line x1="1" y1="12" x2="3" y2="12" />
                  <line x1="21" y1="12" x2="23" y2="12" />
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
              )}
            </button>

            {/* Account button */}
            <NavLink
              to="/app/settings"
              aria-label="Account & Settings"
              className={({ isActive }) =>
                `p-1.5 rounded-md hover:bg-muted transition-colors ${isActive ? 'text-primary' : 'text-muted-foreground'}`
              }
            >
              {user ? (
                <div className="h-5 w-5 rounded-full bg-primary/20 flex items-center justify-center text-[10px] font-bold text-primary">
                  {user.email?.[0]?.toUpperCase() ?? '?'}
                </div>
              ) : (
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="8" r="4" />
                  <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
                </svg>
              )}
            </NavLink>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 px-4 py-6 pb-20 max-w-lg mx-auto w-full">
        <Outlet />
      </main>

      {/* Bottom navigation */}
      <nav className="fixed bottom-0 inset-x-0 bg-background border-t border-border safe-area-pb">
        <div className="max-w-lg mx-auto flex">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/app'}
              className={({ isActive }) =>
                `flex-1 flex flex-col items-center py-2 text-xs transition-colors ${
                  isActive ? 'text-primary font-semibold' : 'text-muted-foreground'
                }`
              }
            >
              <span className="text-lg mb-0.5">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  )
}
