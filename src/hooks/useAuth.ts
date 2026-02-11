import { useState, useEffect } from 'react'
import type { User, Session } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase/client'
import { signInWithEmail, signUpWithEmail, signInWithMagicLink, signOut as apiSignOut, ensureProfile } from '@/lib/api/auth.api'
import { syncLocalProgress } from '@/lib/api/quran-progress.api'

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
        // Sync any local progress accumulated before creating an account
        syncLocalProgress(user.id).catch(console.error)
      }
    })

    return () => subscription.unsubscribe()
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

  async function signOut() {
    await apiSignOut()
    setState({ user: null, session: null, isLoading: false })
  }

  return { ...state, signIn, signUp, sendMagicLink, signOut }
}
