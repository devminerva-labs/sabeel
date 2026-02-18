import { supabase } from '@/lib/supabase/client'

const REDIRECT_URL = `${window.location.origin}/auth/callback`

export async function signInWithEmail(email: string, password: string) {
  if (!supabase) return { data: null, error: new Error('Supabase not configured') }
  return supabase.auth.signInWithPassword({ email, password })
}

export async function signUpWithEmail(email: string, password: string) {
  if (!supabase) return { data: null, error: new Error('Supabase not configured') }
  return supabase.auth.signUp({
    email,
    password,
    options: { emailRedirectTo: REDIRECT_URL },
  })
}

export async function signInWithMagicLink(email: string) {
  if (!supabase) return { data: null, error: new Error('Supabase not configured') }
  return supabase.auth.signInWithOtp({ email, options: { emailRedirectTo: REDIRECT_URL } })
}

export async function signInWithGoogle() {
  if (!supabase) return { data: null, error: new Error('Supabase not configured') }

  // Always use window.location.href redirect (Supabase default).
  // The previous window.open() approach caused "The operation was aborted" on iOS PWA:
  //   - window.open opens Safari in a separate process with its own localStorage
  //   - The PKCE verifier is stored in the PWA's localStorage
  //   - The auth callback opens a fresh PWA instance with no PKCE verifier → exchange fails
  // iOS PWA User-Agent includes "Safari/604.1" so Google does not block it as embedded.
  return supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: REDIRECT_URL },
  })
}

export async function signOut() {
  if (!supabase) return { error: null }
  return supabase.auth.signOut()
}

export async function getSession() {
  if (!supabase) return { data: { session: null }, error: null }
  return supabase.auth.getSession()
}

export async function ensureProfile(userId: string, email: string) {
  if (!supabase) return
  // Insert profile if it doesn't exist yet (new sign-ups)
  await supabase.from('profiles').upsert(
    { id: userId, display_name: email.split('@')[0] },
    { onConflict: 'id', ignoreDuplicates: true },
  )
}
