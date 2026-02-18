import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { supabase } from '@/lib/supabase/client'

// Handles the redirect after a magic link or OAuth click.
// Supabase puts the token in the URL hash; the client library picks it up automatically.
export function AuthCallbackPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!supabase) {
      navigate('/app', { replace: true })
      return
    }

    // Handle the OAuth callback
    const handleAuthCallback = async () => {
      try {
        // Get the code from query params (for OAuth)
        const code = searchParams.get('code')
        
        if (code && supabase) {
          // Exchange the code for a session
          const { error } = await supabase.auth.exchangeCodeForSession(code)
          if (error) throw error
        }

        // Check if we have a session
        const { data: { session } } = await supabase!.auth.getSession()
        
        if (session) {
          navigate('/app', { replace: true })
        } else {
          // Wait for auth state change
          const { data: { subscription } } = supabase!.auth.onAuthStateChange((event) => {
            if (event === 'SIGNED_IN') {
              subscription.unsubscribe()
              navigate('/app', { replace: true })
            }
          })

          // Timeout fallback
          setTimeout(() => {
            subscription.unsubscribe()
            supabase!.auth.getSession().then(({ data }) => {
              if (data.session) {
                navigate('/app', { replace: true })
              } else {
                setError('Sign in timed out. Please try again.')
              }
            })
          }, 10000)

          return () => subscription.unsubscribe()
        }
      } catch (err) {
        console.error('Auth callback error:', err)
        setError(err instanceof Error ? err.message : 'Sign in failed')
      }
    }

    handleAuthCallback()
  }, [navigate, searchParams])

  if (error) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <p className="text-red-500 text-sm mb-4">{error}</p>
        <button 
          onClick={() => navigate('/login')} 
          className="text-primary hover:underline text-sm"
        >
          Back to login
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center space-y-2">
        <p className="text-muted-foreground text-sm">Signing you in…</p>
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
      </div>
    </div>
  )
}
