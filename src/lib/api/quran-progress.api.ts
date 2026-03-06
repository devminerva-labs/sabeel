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

// Pulls all progress from Supabase to local Dexie
// Used for cross-device sync
export async function pullServerProgress(userId: string, ramadanYear: RamadanYear): Promise<void> {
  if (!supabase) return

  const { data, error } = await supabase
    .from('quran_progress')
    .select('*')
    .eq('user_id', userId)
    .eq('ramadan_year', ramadanYear)

  if (error) {
    console.error('[sync] pull from server failed:', error.message)
    return
  }

  if (!data || data.length === 0) return

  const now = new Date().toISOString()
  
  // Convert server records to local format
  const localRecords = data.map((row) => ({
    juzId: row.juz_id as JuzId,
    ramadanYear: row.ramadan_year as RamadanYear,
    status: row.status as ProgressStatus,
    completedAt: row.completed_at,
    updatedAt: row.updated_at,
    syncedAt: now,
  }))

  if (localRecords.length === 0) return

  // Fetch all existing local records for this year in one query (ramadanYear is indexed).
  // The server query already filters by ramadanYear so all localRecords share the same year.
  const existingRecords = await db.quranProgress
    .where('ramadanYear')
    .equals(ramadanYear)
    .toArray()
  const existingMap = new Map(existingRecords.map((r) => [r.juzId, r]))

  // Only upsert records where the server version is newer than local.
  // Merge the existing local `id` so bulkPut updates in-place rather than inserting duplicates
  // (Dexie bulkPut uses the primary key; without id it would auto-generate a new row).
  const toUpsert = localRecords
    .filter((record) => {
      const existing = existingMap.get(record.juzId)
      return !existing || new Date(record.updatedAt) > new Date(existing.updatedAt)
    })
    .map((record) => {
      const existing = existingMap.get(record.juzId)
      return existing ? { ...record, id: existing.id } : record
    })

  if (toUpsert.length > 0) {
    await db.quranProgress.bulkPut(toUpsert)
  }
}
