import { supabase } from '@/lib/supabase/client'
import { db } from '@/lib/db'
import type { PrayerName, PrayerStatus } from '@/types'

export async function syncPrayerLog(
  userId: string,
  record: { date: string; prayer: PrayerName; status: PrayerStatus; prayedAt?: string; updatedAt: string },
): Promise<void> {
  if (!supabase) return

  const { error } = await supabase
    .from('prayer_logs')
    .upsert(
      {
        user_id: userId,
        date: record.date,
        prayer: record.prayer,
        status: record.status,
        prayed_at: record.prayedAt ?? null,
        updated_at: record.updatedAt,
      },
      { onConflict: 'user_id,date,prayer' },
    )

  if (error) {
    console.error('[sync] prayer_logs upsert failed:', error.message)
  }
}

export async function deletePrayerLog(
  userId: string,
  date: string,
  prayer: PrayerName,
): Promise<void> {
  if (!supabase) return

  const { error } = await supabase
    .from('prayer_logs')
    .delete()
    .eq('user_id', userId)
    .eq('date', date)
    .eq('prayer', prayer)

  if (error) {
    console.error('[sync] prayer_logs delete failed:', error.message)
  }
}

export async function pullPrayerLogs(userId: string, date: string): Promise<void> {
  if (!supabase) return

  const { data, error } = await supabase
    .from('prayer_logs')
    .select('*')
    .eq('user_id', userId)
    .eq('date', date)

  if (error || !data || data.length === 0) return

  for (const row of data) {
    const existing = await db.prayerLogs
      .where('[date+prayer]')
      .equals([row.date, row.prayer])
      .first()

    if (existing) {
      if (new Date(row.updated_at) > new Date(existing.updatedAt)) {
        await db.prayerLogs.update(existing.id!, {
          status: row.status as PrayerStatus,
          prayedAt: row.prayed_at ?? undefined,
          updatedAt: row.updated_at,
          syncedAt: new Date().toISOString(),
        })
      }
    } else {
      await db.prayerLogs.add({
        date: row.date,
        prayer: row.prayer as PrayerName,
        status: row.status as PrayerStatus,
        prayedAt: row.prayed_at ?? undefined,
        updatedAt: row.updated_at,
        syncedAt: new Date().toISOString(),
      })
    }
  }
}
