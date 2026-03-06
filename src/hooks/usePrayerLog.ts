import { useLiveQuery } from 'dexie-react-hooks'
import { useCallback, useEffect, useMemo } from 'react'
import { db } from '@/lib/db'
import { syncPrayerLog, deletePrayerLog, pullPrayerLogs } from '@/lib/api/prayer-log.api'
import type { PrayerName, PrayerStatus } from '@/types'

function todayISO(): string {
  // sv-SE locale produces YYYY-MM-DD in local time (avoids UTC date-shift for UTC+ users)
  return new Date().toLocaleDateString('sv-SE')
}

export function usePrayerLog(userId?: string | null) {
  const date = todayISO()

  const records = useLiveQuery(
    () => db.prayerLogs.where('[date+prayer]').between([date, ''], [date, '\uffff']).toArray(),
    [date],
    [],
  )

  // Pull from server on mount and when userId changes
  useEffect(() => {
    if (userId) {
      pullPrayerLogs(userId, date).catch(console.error)
    }
  }, [userId, date])

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
      // Read date fresh at call time to avoid stale closure if midnight passes without re-render
      const currentDate = todayISO()
      const now = new Date().toISOString()
      const existing = await db.prayerLogs
        .where('[date+prayer]')
        .equals([currentDate, name])
        .first()

      if (!existing) {
        const record = { date: currentDate, prayer: name, status: 'prayed' as PrayerStatus, prayedAt: now, updatedAt: now }
        await db.prayerLogs.add(record)
        if (userId) syncPrayerLog(userId, record).catch(console.error)
      } else if (existing.status === 'prayed') {
        const updatedAt = now
        await db.prayerLogs.update(existing.id!, {
          status: 'missed',
          prayedAt: undefined,
          updatedAt,
          syncedAt: undefined,
        })
        if (userId) {
          syncPrayerLog(userId, { date: currentDate, prayer: name, status: 'missed', updatedAt }).catch(console.error)
        }
      } else {
        // missed → delete (untracked)
        await db.prayerLogs.delete(existing.id!)
        if (userId) deletePrayerLog(userId, currentDate, name).catch(console.error)
      }
    },
    [userId],
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
