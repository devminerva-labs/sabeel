import { supabase } from '@/lib/supabase/client'
import { db } from '@/lib/db'
import type { JuzId, RamadanYear, ProgressStatus } from '@/types'

export async function upsertJuzProgress(
  userId: string,
  juzId: JuzId,
  ramadanYear: RamadanYear,
  status: ProgressStatus,
) {
  if (!supabase) return { data: null, error: null }

  return supabase.rpc('upsert_juz_progress', {
    p_user_id: userId,
    p_juz_id: juzId,
    p_ramadan_year: ramadanYear,
    p_status: status,
  })
}

export async function fetchAllProgress(userId: string, ramadanYear: RamadanYear) {
  if (!supabase) return { data: null, error: null }

  return supabase
    .from('quran_progress')
    .select('*')
    .eq('user_id', userId)
    .eq('ramadan_year', ramadanYear)
}

// Syncs all unsynced local Dexie progress records to Supabase.
// Called on login (catch-up) and after each juz status change when logged in.
export async function syncLocalProgress(userId: string): Promise<void> {
  if (!supabase) return

  const unsynced = await db.quranProgress.filter((r) => !r.syncedAt).toArray()
  if (unsynced.length === 0) return

  const rows = unsynced.map((r) => ({
    user_id: userId,
    juz_id: r.juzId,
    ramadan_year: r.ramadanYear,
    status: r.status,
    completed_at: r.completedAt ?? null,
    updated_at: r.updatedAt,
  }))

  const { error } = await supabase
    .from('quran_progress')
    .upsert(rows, { onConflict: 'user_id,juz_id,ramadan_year' })

  if (error) {
    console.error('[sync] quran_progress upsert failed:', error.message)
    return
  }

  const now = new Date().toISOString()
  await db.quranProgress.bulkPut(
    unsynced.map((r) => ({ ...r, syncedAt: now })),
  )
}
