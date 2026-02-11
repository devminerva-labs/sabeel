import { useLiveQuery } from 'dexie-react-hooks'
import { useCallback, useMemo } from 'react'
import { db } from '@/lib/db'
import type { PrayerName, PrayerStatus } from '@/types'

function todayISO(): string {
  // sv-SE locale produces YYYY-MM-DD in local time (avoids UTC date-shift for UTC+ users)
  return new Date().toLocaleDateString('sv-SE')
}

export function usePrayerLog() {
  const date = todayISO()

  const records = useLiveQuery(
    () => db.prayerLogs.where('[date+prayer]').between([date, ''], [date, '\uffff']).toArray(),
    [date],
    [],
  )

  const prayers = useMemo(() => {
    const map = new Map<PrayerName, PrayerStatus>()
    for (const r of records) {
      map.set(r.prayer, r.status)
    }
    return map
  }, [records])

  const getStatus = useCallback(
    (name: PrayerName): PrayerStatus | null => prayers.get(name) ?? null,
    [prayers],
  )

  // Cycles: untracked → prayed → missed → (delete = untracked)
  const togglePrayer = useCallback(
    async (name: PrayerName) => {
      const now = new Date().toISOString()
      const existing = await db.prayerLogs
        .where('[date+prayer]')
        .equals([date, name])
        .first()

      if (!existing) {
        await db.prayerLogs.add({
          date,
          prayer: name,
          status: 'prayed',
          prayedAt: now,
          updatedAt: now,
        })
      } else if (existing.status === 'prayed') {
        await db.prayerLogs.update(existing.id!, {
          status: 'missed',
          prayedAt: undefined,
          updatedAt: now,
          syncedAt: undefined,
        })
      } else {
        // missed → delete (untracked)
        await db.prayerLogs.delete(existing.id!)
      }
    },
    [date],
  )

  const prayedCount = records.filter((r) => r.status === 'prayed').length
  const missedCount = records.filter((r) => r.status === 'missed').length

  return {
    prayers,
    getStatus,
    togglePrayer,
    prayedCount,
    missedCount,
    date,
  }
}
