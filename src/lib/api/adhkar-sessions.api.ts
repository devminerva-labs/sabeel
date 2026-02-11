import { supabase } from '@/lib/supabase/client'
import type { AdhkarCategory, AdhkarCounts } from '@/types'

export async function upsertAdhkarSession(
  userId: string,
  sessionDate: string,
  category: AdhkarCategory,
  counts: AdhkarCounts,
  completed: boolean,
) {
  if (!supabase) return { data: null, error: null }

  return supabase
    .from('adhkar_sessions')
    .upsert(
      {
        user_id: userId,
        session_date: sessionDate,
        category,
        counts,
        completed,
        completed_at: completed ? new Date().toISOString() : null,
      },
      { onConflict: 'user_id,session_date,category' },
    )
}
