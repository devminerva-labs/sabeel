import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase/client'

// Handles the redirect after a magic link click.
// Supabase puts the token in the URL hash; the client library picks it up automatically.
export function AuthCallbackPage() {
  const navigate = useNavigate()

  useEffect(() => {
    if (!supabase) {
      navigate('/app', { replace: true })
      return
    }

    // onAuthStateChange fires once the hash is consumed
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN') {
        subscription.unsubscribe()
        navigate('/app', { replace: true })
      }
    })

    // Fallback: if already signed in, redirect immediately
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        subscription.unsubscribe()
        navigate('/app', { replace: true })
      }
    })

    return () => subscription.unsubscribe()
  }, [navigate])

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <p className="text-muted-foreground text-sm">Signing you in…</p>
    </div>
  )
}
