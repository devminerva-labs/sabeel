import { supabase } from '@/lib/supabase/client'
import { db } from '@/lib/db'
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

export async function pullAdhkarSessions(userId: string, date: string): Promise<void> {
  if (!supabase) return

  const { data, error } = await supabase
    .from('adhkar_sessions')
    .select('*')
    .eq('user_id', userId)
    .eq('session_date', date)

  if (error || !data || data.length === 0) return

  for (const row of data) {
    const existing = await db.adhkarSessions
      .where('[sessionDate+category]')
      .equals([row.session_date, row.category])
      .first()

    if (existing) {
      // Server wins if it has a completion the local doesn't have
      if (row.completed && !existing.completed) {
        await db.adhkarSessions.update(existing.id!, {
          completed: true,
          counts: row.counts as AdhkarCounts,
          completedAt: row.completed_at ?? undefined,
          syncedAt: new Date().toISOString(),
        })
      }
    } else {
      await db.adhkarSessions.add({
        sessionDate: row.session_date,
        category: row.category as AdhkarCategory,
        completed: row.completed,
        counts: row.counts as AdhkarCounts,
        completedAt: row.completed_at ?? undefined,
        syncedAt: new Date().toISOString(),
      })
    }
  }
}
