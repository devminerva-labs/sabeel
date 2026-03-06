import { supabase } from '@/lib/supabase/client'
import type { RamadanYear } from '@/types'

export interface Halaqah {
  id: string
  name: string
  invite_code: string
  created_by: string
  ramadan_year: number
  created_at: string
}

export interface HalaqahMember {
  id: string
  halaqah_id: string
  user_id: string
  nickname: string
  joined_at: string
}

export interface LeaderboardEntry {
  nickname: string
  juzCompleted: number
  juzInProgress: number
  isMe: boolean
}

export async function createHalaqah(
  userId: string,
  name: string,
  nickname: string,
  ramadanYear: RamadanYear,
): Promise<{ halaqah: Halaqah | null; error: string | null }> {
  if (!supabase) return { halaqah: null, error: 'Supabase not configured' }

  const { data: halaqah, error: hErr } = await supabase
    .from('halaqahs')
    .insert({ name, created_by: userId, ramadan_year: ramadanYear })
    .select()
    .single()

  if (hErr || !halaqah) return { halaqah: null, error: hErr?.message ?? 'Failed to create halaqah' }

  const { error: mErr } = await supabase
    .from('halaqah_members')
    .insert({ halaqah_id: halaqah.id, user_id: userId, nickname })

  if (mErr) return { halaqah: null, error: mErr.message }

  return { halaqah, error: null }
}

export async function joinHalaqah(
  userId: string,
  inviteCode: string,
  nickname: string,
): Promise<{ halaqah: Halaqah | null; error: string | null }> {
  if (!supabase) return { halaqah: null, error: 'Supabase not configured' }

  // Look up halaqah by invite code
  const { data: halaqah, error: hErr } = await supabase
    .from('halaqahs')
    .select('*')
    .eq('invite_code', inviteCode.trim())
    .single()

  if (hErr || !halaqah) return { halaqah: null, error: 'Invite code not found' }

  // Insert directly — let the DB unique constraint handle duplicates
  const { error: mErr } = await supabase
    .from('halaqah_members')
    .insert({ halaqah_id: halaqah.id, user_id: userId, nickname })

  if (mErr) {
    if (mErr.message.includes('halaqah_id') && mErr.message.includes('user_id')) {
      return { halaqah, error: 'You are already in this Halaqah' }
    }
    if (mErr.message.includes('nickname')) {
      return { halaqah: null, error: 'That nickname is already taken in this Halaqah' }
    }
    return { halaqah: null, error: mErr.message }
  }

  return { halaqah, error: null }
}

export async function leaveHalaqah(halaqahId: string, userId: string): Promise<string | null> {
  if (!supabase) return 'Supabase not configured'
  const { error } = await supabase
    .from('halaqah_members')
    .delete()
    .eq('halaqah_id', halaqahId)
    .eq('user_id', userId)
  return error?.message ?? null
}

export interface HalaqahMembership {
  halaqah: Halaqah
  nickname: string
}

export async function getMyHalaqahs(
  userId: string,
  ramadanYear: RamadanYear,
): Promise<{ memberships: HalaqahMembership[]; error?: string }> {
  if (!supabase) return { memberships: [], error: 'Supabase not configured' }

  try {
    const { data, error } = await supabase
      .from('halaqah_members')
      .select('nickname, halaqahs!inner(*)')
      .eq('user_id', userId)
      .eq('halaqahs.ramadan_year', ramadanYear)

    if (error) {
      console.error('Error fetching halaqahs:', error)
      return { memberships: [], error: error.message }
    }

    if (!data || data.length === 0) return { memberships: [] }

    // Supabase types !inner joins as arrays but returns an object at runtime;
    // handle both to satisfy the type checker and be future-proof.
    const memberships = data
      .filter((row) => row?.halaqahs != null && row?.nickname)
      .map((row) => ({
        halaqah: (Array.isArray(row.halaqahs) ? row.halaqahs[0] : row.halaqahs) as Halaqah,
        nickname: row.nickname as string,
      }))
      .filter((m): m is HalaqahMembership => m.halaqah != null)
    return { memberships }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    console.error('Exception fetching halaqahs:', err)
    return { memberships: [], error: message }
  }
}

export async function getLeaderboard(
  halaqahId: string,
  ramadanYear: RamadanYear,
  myUserId: string,
): Promise<LeaderboardEntry[]> {
  if (!supabase) return []

  // Try the fast RPC first (single query, SECURITY DEFINER — no RLS issues)
  const { data: rpcData, error: rpcError } = await supabase.rpc(
    'get_halaqah_leaderboard',
    {
      p_halaqah_id: halaqahId,
      p_ramadan_year: ramadanYear,
      p_my_user_id: myUserId,
    },
  )

  // Handle JSONB return type
  if (!rpcError && rpcData) {
    // Parse JSONB result
    const parsed = typeof rpcData === 'string' ? JSON.parse(rpcData) : rpcData
    const entries = Array.isArray(parsed) ? parsed : []
    return entries.map((r: {
      nickname: string
      juz_completed: number
      juz_in_progress: number
      is_me: boolean
    }) => ({
      nickname: r.nickname,
      juzCompleted: r.juz_completed,
      juzInProgress: r.juz_in_progress,
      isMe: r.is_me,
    }))
  }

  // Fallback: client-side join (for when RPC hasn't been deployed yet)
  console.log('RPC failed, using fallback:', rpcError)
  
  const { data: members, error: membersError } = await supabase
    .from('halaqah_members')
    .select('user_id, nickname')
    .eq('halaqah_id', halaqahId)

  if (membersError) {
    console.error('Error fetching members:', membersError)
  }

  if (!members || members.length === 0) return []

  const memberIds = members.map((m) => m.user_id)

  const { data: progress, error: progressError } = await supabase
    .from('quran_progress')
    .select('user_id, status')
    .eq('ramadan_year', ramadanYear)
    .in('user_id', memberIds)

  if (progressError) {
    console.error('Error fetching progress:', progressError)
  }

  const progressList = progress ?? []

  return members
    .map((m) => {
      const myProgress = progressList.filter((p) => p.user_id === m.user_id)
      return {
        nickname: m.nickname,
        juzCompleted: myProgress.filter((p) => p.status === 'completed').length,
        juzInProgress: myProgress.filter((p) => p.status === 'in_progress').length,
        isMe: m.user_id === myUserId,
      }
    })
    .sort((a, b) => b.juzCompleted - a.juzCompleted || b.juzInProgress - a.juzInProgress)
}
