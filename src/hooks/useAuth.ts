import { useState, useEffect } from 'react'
import type { User, Session } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase/client'
import { signInWithEmail, signUpWithEmail, signInWithMagicLink, signInWithGoogle as apiSignInWithGoogle, signOut as apiSignOut, ensureProfile } from '@/lib/api/auth.api'
import { syncLocalProgress } from '@/lib/api/quran-progress.api'
import { pullPrayerLogs } from '@/lib/api/prayer-log.api'
import { pullAdhkarSessions } from '@/lib/api/adhkar-sessions.api'

interface AuthState {
  user: User | null
  session: Session | null
  isLoading: boolean
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({ user: null, session: null, isLoading: true })

  useEffect(() => {
    if (!supabase) {
      setState({ user: null, session: null, isLoading: false })
      return
    }

    // Load existing session
    supabase.auth.getSession().then(({ data }) => {
      setState({ user: data.session?.user ?? null, session: data.session, isLoading: false })
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const user = session?.user ?? null
      setState({ user, session, isLoading: false })

      if (user) {
        await ensureProfile(user.id, user.email ?? '')
        // Push any local progress accumulated before creating an account
        syncLocalProgress(user.id).catch(console.error)
        // Pull today's prayers + adhkar so dashboard counts reflect server state
        const today = new Date().toLocaleDateString('sv-SE')
        pullPrayerLogs(user.id, today).catch(console.error)
        pullAdhkarSessions(user.id, today).catch(console.error)
      }
    })

    // Re-check session when PWA regains focus.
    // iOS suspends JS timers in the background, so the Supabase auto-refresh
    // timer can miss its window when the JWT expires while backgrounded.
    // We explicitly refresh the access token here to keep users logged in.
    const handleVisibility = async () => {
      if (document.visibilityState !== 'visible') return
      try {
        const { data: { session } } = await supabase!.auth.getSession()
        if (!session) return

        const nowSec = Math.floor(Date.now() / 1000)
        if ((session.expires_at ?? 0) < nowSec + 60) {
          // Token has expired or is expiring within 60s — force a network refresh.
          // onAuthStateChange will receive TOKEN_REFRESHED (stays logged in) or
          // SIGNED_OUT (refresh token itself expired — nothing we can do).
          await supabase!.auth.refreshSession()
        } else {
          setState((prev) => ({ ...prev, user: session.user, session, isLoading: false }))
        }
      } catch {
        // Silently ignore — onAuthStateChange handles any resulting state change
      }
    }
    document.addEventListener('visibilitychange', handleVisibility)

    return () => {
      subscription.unsubscribe()
      document.removeEventListener('visibilitychange', handleVisibility)
    }
  }, [])

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
    setState({ user: null, session: null, isLoading: false })
  }

  return { ...state, signIn, signUp, sendMagicLink, signInWithGoogle, signOut }
}
