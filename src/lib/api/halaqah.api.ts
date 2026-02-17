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

export async function getMyHalaqah(
  userId: string,
  ramadanYear: RamadanYear,
): Promise<{ halaqah: Halaqah | null; nickname: string | null }> {
  if (!supabase) return { halaqah: null, nickname: null }

  const { data } = await supabase
    .from('halaqah_members')
    .select('nickname, halaqahs!inner(*)')
    .eq('user_id', userId)
    .eq('halaqahs.ramadan_year', ramadanYear)
    .maybeSingle()

  if (!data) return { halaqah: null, nickname: null }

  const row = data as unknown as { halaqahs: Halaqah; nickname: string }
  return { halaqah: row.halaqahs, nickname: row.nickname }
}

export async function getLeaderboard(
  halaqahId: string,
  ramadanYear: RamadanYear,
  myUserId: string,
): Promise<LeaderboardEntry[]> {
  if (!supabase) return []

  // Fetch all members and their progress in two queries
  const [membersRes, progressRes] = await Promise.all([
    supabase
      .from('halaqah_members')
      .select('user_id, nickname')
      .eq('halaqah_id', halaqahId),
    supabase
      .from('quran_progress')
      .select('user_id, status')
      .eq('ramadan_year', ramadanYear)
      .in(
        'user_id',
        // We can only pass a subquery via a join, so we re-fetch member user_ids
        // This is a simple client-side join for small groups (< 50 members)
        (await supabase
          .from('halaqah_members')
          .select('user_id')
          .eq('halaqah_id', halaqahId)
        ).data?.map((m) => m.user_id) ?? [],
      ),
  ])

  const members = membersRes.data ?? []
  const progress = progressRes.data ?? []

  return members
    .map((m) => {
      const myProgress = progress.filter((p) => p.user_id === m.user_id)
      return {
        nickname: m.nickname,
        juzCompleted: myProgress.filter((p) => p.status === 'completed').length,
        juzInProgress: myProgress.filter((p) => p.status === 'in_progress').length,
        isMe: m.user_id === myUserId,
      }
    })
    .sort((a, b) => b.juzCompleted - a.juzCompleted || b.juzInProgress - a.juzInProgress)
}
