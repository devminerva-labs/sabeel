import { useLiveQuery } from 'dexie-react-hooks'
import { useCallback, useMemo, useRef } from 'react'
import { db } from '@/lib/db'
import type { VoluntaryPrayerType } from '@/types'

function todayISO(): string {
  return new Date().toLocaleDateString('sv-SE')
}

export function useVoluntaryPrayers() {
  const date = todayISO()
  // Tracks in-flight toggle operations to prevent double-tap duplicate writes
  const inFlightRef = useRef(new Set<VoluntaryPrayerType>())

  const records = useLiveQuery(
    () => db.voluntaryPrayers.where('[date+type]').between([date, ''], [date, '\uffff']).toArray(),
    [date],
    [],
  )

  const completedSet = useMemo(() => {
    const set = new Set<VoluntaryPrayerType>()
    for (const r of records) {
      if (r.completed) set.add(r.type)
    }
    return set
  }, [records])

  const isCompleted = useCallback(
    (type: VoluntaryPrayerType): boolean => completedSet.has(type),
    [completedSet],
  )

  const toggle = useCallback(
    async (type: VoluntaryPrayerType) => {
      if (inFlightRef.current.has(type)) return
      inFlightRef.current.add(type)
      try {
        const now = new Date().toISOString()
        const existing = await db.voluntaryPrayers
          .where('[date+type]')
          .equals([date, type])
          .first()

        if (!existing) {
          await db.voluntaryPrayers.add({
            date,
            type,
            completed: true,
            completedAt: now,
          })
        } else if (existing.completed) {
          await db.voluntaryPrayers.delete(existing.id!)
        }
      } finally {
        inFlightRef.current.delete(type)
      }
    },
    [date],
  )

  const completedCount = completedSet.size

  return { isCompleted, toggle, completedCount, date }
}
