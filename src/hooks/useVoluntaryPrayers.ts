import { useLiveQuery } from 'dexie-react-hooks'
import { useCallback, useMemo } from 'react'
import { db } from '@/lib/db'
import type { VoluntaryPrayerType } from '@/types'

function todayISO(): string {
  return new Date().toISOString().slice(0, 10)
}

export function useVoluntaryPrayers() {
  const date = todayISO()

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
    },
    [date],
  )

  const completedCount = completedSet.size

  return { isCompleted, toggle, completedCount, date }
}
