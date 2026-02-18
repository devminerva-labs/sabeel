import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string | undefined
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

// Session persistence setting - session persists in localStorage across refreshes/restarts
const PERSIST_SESSION = true

// Supabase is optional for v1.0 — the app works fully offline without it.
// When env vars are missing, we export null and the sync layer skips server calls.
export const supabase =
  SUPABASE_URL && SUPABASE_ANON_KEY
    ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
        auth: {
          persistSession: PERSIST_SESSION,
          autoRefreshToken: PERSIST_SESSION,
          detectSessionInUrl: true,
        },
      })
    : null
