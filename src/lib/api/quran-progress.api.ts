import { supabase } from '@/lib/supabase/client'
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
