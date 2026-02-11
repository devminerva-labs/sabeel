import { useCallback, useSyncExternalStore } from 'react'

type Theme = 'light' | 'dark' | 'system'

const STORAGE_KEY = 'sabeel-theme'

function getTheme(): Theme {
  return (localStorage.getItem(STORAGE_KEY) as Theme) ?? 'system'
}

function applyTheme(theme: Theme) {
  const root = document.documentElement
  if (theme === 'system') {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    root.classList.toggle('dark', prefersDark)
  } else {
    root.classList.toggle('dark', theme === 'dark')
  }
}

// Initialize on load
applyTheme(getTheme())

const listeners = new Set<() => void>()

function subscribe(callback: () => void) {
  listeners.add(callback)

  // Also listen for system preference changes
  const mq = window.matchMedia('(prefers-color-scheme: dark)')
  const handler = () => {
    if (getTheme() === 'system') {
      applyTheme('system')
      callback()
    }
  }
  mq.addEventListener('change', handler)

  return () => {
    listeners.delete(callback)
    mq.removeEventListener('change', handler)
  }
}

export function useTheme() {
  const theme = useSyncExternalStore(subscribe, getTheme, () => 'system' as Theme)

  const setTheme = useCallback((newTheme: Theme) => {
    localStorage.setItem(STORAGE_KEY, newTheme)
    applyTheme(newTheme)
    listeners.forEach((l) => l())
  }, [])

  const isDark =
    theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)

  return { theme, setTheme, isDark } as const
}
