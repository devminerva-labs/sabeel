import { useLiveQuery } from 'dexie-react-hooks'
import { useCallback } from 'react'
import { db } from '@/lib/db'
import type { SurahId, RamadanYear, ProgressStatus } from '@/types'

const NEXT_STATUS: Record<ProgressStatus, ProgressStatus> = {
  not_started: 'in_progress',
  in_progress: 'completed',
  completed: 'not_started',
}

export function useSurahProgress(ramadanYear: RamadanYear) {
  const records = useLiveQuery(
    () => db.surahProgress.where({ ramadanYear }).toArray(),
    [ramadanYear],
    [],
  )

  const statusMap = new Map<number, ProgressStatus>()
  for (const r of records) {
    statusMap.set(r.surahId, r.status)
  }

  const getStatus = useCallback(
    (id: SurahId): ProgressStatus => statusMap.get(id) ?? 'not_started',
    [statusMap],
  )

  /** Set status only if current matches `from`. Used for auto-tracking. */
  const setStatusIf = useCallback(
    async (id: SurahId, from: ProgressStatus, to: ProgressStatus) => {
      const current = statusMap.get(id) ?? 'not_started'
      if (current !== from) return

      const now = new Date().toISOString()
      const existing = await db.surahProgress
        .where('[surahId+ramadanYear]')
        .equals([id, ramadanYear])
        .first()

      if (existing) {
        await db.surahProgress.update(existing.id!, {
          status: to,
          updatedAt: now,
          completedAt: to === 'completed' ? now : undefined,
          syncedAt: undefined,
        })
      } else {
        await db.surahProgress.add({
          surahId: id,
          ramadanYear,
          status: to,
          updatedAt: now,
          completedAt: to === 'completed' ? now : undefined,
        })
      }
    },
    [ramadanYear, statusMap],
  )

  /** Manual cycle: not_started → in_progress → completed → not_started */
  const cycleStatus = useCallback(
    async (id: SurahId) => {
      const current = statusMap.get(id) ?? 'not_started'
      const next = NEXT_STATUS[current]
      const now = new Date().toISOString()

      const existing = await db.surahProgress
        .where('[surahId+ramadanYear]')
        .equals([id, ramadanYear])
        .first()

      if (existing) {
        await db.surahProgress.update(existing.id!, {
          status: next,
          updatedAt: now,
          completedAt: next === 'completed' ? now : undefined,
          syncedAt: undefined,
        })
      } else {
        await db.surahProgress.add({
          surahId: id,
          ramadanYear,
          status: next,
          updatedAt: now,
          completedAt: next === 'completed' ? now : undefined,
        })
      }
    },
    [ramadanYear, statusMap],
  )

  const completedCount = records.filter((r) => r.status === 'completed').length
  const inProgressCount = records.filter((r) => r.status === 'in_progress').length

  return {
    getStatus,
    setStatusIf,
    cycleStatus,
    completedCount,
    inProgressCount,
    totalSurahs: 114,
  }
}
