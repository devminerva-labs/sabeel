import { useSyncExternalStore } from 'react'
import type { User, Session } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase/client'
import {
  signInWithEmail,
  signUpWithEmail,
  signInWithMagicLink,
  signInWithGoogle as apiSignInWithGoogle,
  signOut as apiSignOut,
  ensureProfile,
} from '@/lib/api/auth.api'
import { syncLocalProgress } from '@/lib/api/quran-progress.api'
import { pullPrayerLogs } from '@/lib/api/prayer-log.api'
import { pullAdhkarSessions } from '@/lib/api/adhkar-sessions.api'

interface AuthState {
  user: User | null
  session: Session | null
  isLoading: boolean
}

// ─── Module-level singleton ───────────────────────────────────────────────────
// useAuth() is called in many components. If each call registered its own
// onAuthStateChange subscription and visibilitychange listener, returning to
// the foreground on iOS PWA would trigger N parallel refreshSession() calls
// with the same (single-use) refresh token — the first succeeds, the rest get
// invalid_grant, Supabase emits SIGNED_OUT, and the user is logged out.
//
// Solution: same module-singleton pattern used by useTheme. ONE subscription,
// ONE visibilitychange listener for the entire app lifetime.
// ─────────────────────────────────────────────────────────────────────────────

let authState: AuthState = { user: null, session: null, isLoading: true }
const listeners = new Set<() => void>()

function setAuthState(next: AuthState) {
  authState = next
  listeners.forEach((l) => l())
}

function subscribe(callback: () => void) {
  listeners.add(callback)
  return () => { listeners.delete(callback) }
}

function getSnapshot(): AuthState {
  return authState
}

// Initialize subscriptions once at module load time (not per-component-mount)
;(function initAuth() {
  if (!supabase) {
    setAuthState({ user: null, session: null, isLoading: false })
    return
  }

  // ONE onAuthStateChange subscription for the entire app
  supabase.auth.onAuthStateChange((event, session) => {
    const user = session?.user ?? null
    setAuthState({ user, session, isLoading: false })

    // Run side-effects only on real sign-in events, not on hourly TOKEN_REFRESHED
    if (user && (event === 'SIGNED_IN' || event === 'INITIAL_SESSION')) {
      ensureProfile(user.id, user.email ?? '').catch(console.error)
      syncLocalProgress(user.id).catch(console.error)
      if (event === 'SIGNED_IN') {
        const today = new Date().toLocaleDateString('sv-SE')
        pullPrayerLogs(user.id, today).catch(console.error)
        pullAdhkarSessions(user.id, today).catch(console.error)
      }
    }
  })

  // Fallback: populate state immediately from storage if onAuthStateChange
  // hasn't fired yet (Supabase v2 fires INITIAL_SESSION synchronously, but
  // guard against edge cases just in case)
  supabase.auth.getSession().then(({ data }) => {
    if (authState.isLoading) {
      setAuthState({ user: data.session?.user ?? null, session: data.session, isLoading: false })
    }
  })

  // ONE visibilitychange listener for the entire app.
  // iOS PWA suspends JS timers in the background, so Supabase's internal
  // auto-refresh timer can miss its window. We explicitly refresh on foreground.
  // refreshInProgress prevents re-entrant calls if the user rapidly switches tabs.
  let refreshInProgress = false
  document.addEventListener('visibilitychange', async () => {
    if (document.visibilityState !== 'visible') return
    if (refreshInProgress) return
    refreshInProgress = true
    try {
      const { data: { session } } = await supabase!.auth.getSession()
      if (!session) return

      const nowSec = Math.floor(Date.now() / 1000)
      if ((session.expires_at ?? 0) < nowSec + 60) {
        // Token expired or expiring within 60 s — force a network refresh.
        // onAuthStateChange will receive TOKEN_REFRESHED (stays logged in) or
        // SIGNED_OUT (refresh token expired — nothing we can do).
        await supabase!.auth.refreshSession()
      } else {
        setAuthState({ user: session.user, session, isLoading: false })
      }
    } catch {
      // Silently ignore — onAuthStateChange handles any resulting state change
    } finally {
      refreshInProgress = false
    }
  })
})()

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useAuth() {
  const state = useSyncExternalStore(
    subscribe,
    getSnapshot,
    // Server snapshot (SSR fallback — not used in this PWA but required by the API)
    () => ({ user: null, session: null, isLoading: true } as AuthState),
  )

  async function signIn(email: string, password: string) {
    const { error } = await signInWithEmail(email, password)
    return error
  }

  async function signUp(email: string, password: string) {
    const { error } = await signUpWithEmail(email, password)
    return error
  }

  async function sendMagicLink(email: string) {
    const { error } = await signInWithMagicLink(email)
    return error
  }

  async function signInWithGoogle() {
    const { error } = await apiSignInWithGoogle()
    return error
  }

  async function signOut() {
    await apiSignOut()
    // onAuthStateChange(SIGNED_OUT) updates state — no manual setState needed
  }

  return { ...state, signIn, signUp, sendMagicLink, signInWithGoogle, signOut }
}
