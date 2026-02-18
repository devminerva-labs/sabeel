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

/** Detect if running as installed PWA (standalone mode) */
function isStandalone(): boolean {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (navigator as unknown as { standalone?: boolean }).standalone === true
  )
}

export async function signInWithGoogle() {
  if (!supabase) return { data: null, error: new Error('Supabase not configured') }

  if (isStandalone()) {
    // In standalone PWA mode, OAuth opens in a system browser tab.
    // We skip the automatic redirect so Supabase returns the URL,
    // then open it ourselves. When the user comes back to the PWA,
    // the auth listener in useAuth picks up the session.
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: REDIRECT_URL,
        skipBrowserRedirect: true,
      },
    })
    if (error) return { data, error }
    if (data.url) {
      window.open(data.url, '_blank')
    }
    return { data, error: null }
  }

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
