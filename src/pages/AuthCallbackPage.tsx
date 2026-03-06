import { useEffect, useState, useRef } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { supabase } from '@/lib/supabase/client'

// Handles the redirect after a magic link or OAuth click.
// Supabase puts the token in the URL hash; the client library picks it up automatically.
export function AuthCallbackPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [error, setError] = useState<string | null>(null)
  const processedRef = useRef(false)
  const abortControllerRef = useRef<AbortController | null>(null)

  useEffect(() => {
    // Prevent duplicate processing (React Strict Mode double-mount)
    if (processedRef.current) return
    processedRef.current = true

    if (!supabase) {
      navigate('/app', { replace: true })
      return
    }

    // Create abort controller for cleanup
    abortControllerRef.current = new AbortController()
    const { signal } = abortControllerRef.current

    // Handle the OAuth callback
    const handleAuthCallback = async () => {
      try {
        // Check if aborted
        if (signal.aborted) return

        // Get the code from query params (for OAuth)
        const code = searchParams.get('code')
        
        if (code && supabase) {
          // Exchange the code for a session
          const { error } = await supabase.auth.exchangeCodeForSession(code)
          if (error) throw error
        }

        // Check if aborted
        if (signal.aborted) return

        // Check if we have a session
        const { data: { session } } = await supabase!.auth.getSession()
        
        if (session) {
          navigate('/app', { replace: true })
        } else {
          // Wait for auth state change
          let timeoutId: ReturnType<typeof setTimeout> | null = null
          
          const { data: { subscription } } = supabase!.auth.onAuthStateChange((event) => {
            if (signal.aborted) {
              subscription.unsubscribe()
              return
            }
            
            if (event === 'SIGNED_IN') {
              subscription.unsubscribe()
              if (timeoutId) clearTimeout(timeoutId)
              navigate('/app', { replace: true })
            }
          })

          // Timeout fallback
          timeoutId = setTimeout(() => {
            if (signal.aborted) return
            
            subscription.unsubscribe()
            supabase!.auth.getSession().then(({ data }) => {
              if (signal.aborted) return
              
              if (data.session) {
                navigate('/app', { replace: true })
              } else {
                setError('Sign in timed out. Please try again.')
              }
            })
          }, 10000)

          // Cleanup function for this branch
          return () => {
            subscription.unsubscribe()
            if (timeoutId) clearTimeout(timeoutId)
          }
        }
      } catch (err) {
        if (signal.aborted) return
        
        console.error('Auth callback error:', err)
        
        // Don't show AbortError to user (it's usually from cleanup/navigation)
        if (err instanceof Error && err.name === 'AbortError') {
          return
        }
        
        setError(err instanceof Error ? err.message : 'Sign in failed')
      }
    }

    // handleAuthCallback returns a cleanup fn in the subscription-listening branch.
    // Use a ref so the effect cleanup captures the container, not the value —
    // avoiding a race where the component unmounts before the Promise resolves.
    const innerCleanupRef = { current: null as (() => void) | null }
    handleAuthCallback().then((fn) => { if (fn) innerCleanupRef.current = fn })

    // Cleanup
    return () => {
      abortControllerRef.current?.abort()
      innerCleanupRef.current?.()
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

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
