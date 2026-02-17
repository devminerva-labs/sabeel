import { supabase } from '@/lib/supabase/client'

export interface UserStat {
  user_id: string
  display_name: string | null
  email: string | null
  signed_up_at: string
  last_sign_in_at: string | null
  juz_completed: number
  juz_in_progress: number
}

export async function getUserStats(): Promise<{ data: UserStat[] | null; error: string | null }> {
  if (!supabase) return { data: null, error: 'Supabase not configured' }

  const { data, error } = await supabase.rpc('get_user_stats')
  if (error) return { data: null, error: error.message }
  return { data: data as UserStat[], error: null }
}
