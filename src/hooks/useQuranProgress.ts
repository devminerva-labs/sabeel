import { useLiveQuery } from 'dexie-react-hooks'
import { useCallback } from 'react'
import { db } from '@/lib/db'
import type { JuzId, RamadanYear, ProgressStatus } from '@/types'

const NEXT_STATUS: Record<ProgressStatus, ProgressStatus> = {
  not_started: 'in_progress',
  in_progress: 'completed',
  completed: 'not_started',
}

export function useQuranProgress(ramadanYear: RamadanYear) {
  const records = useLiveQuery(
    () => db.quranProgress.where({ ramadanYear }).toArray(),
    [ramadanYear],
    [],
  )

  // Build a map: juzId → status
  const statusMap = new Map<number, ProgressStatus>()
  for (const r of records) {
    statusMap.set(r.juzId, r.status)
  }

  const getStatus = useCallback(
    (id: JuzId): ProgressStatus => statusMap.get(id) ?? 'not_started',
    [statusMap],
  )

  const cycleStatus = useCallback(
    async (id: JuzId) => {
      const current = statusMap.get(id) ?? 'not_started'
      const next = NEXT_STATUS[current]
      const now = new Date().toISOString()

      const existing = await db.quranProgress
        .where('[juzId+ramadanYear]')
        .equals([id, ramadanYear])
        .first()

      if (existing) {
        await db.quranProgress.update(existing.id!, {
          status: next,
          updatedAt: now,
          completedAt: next === 'completed' ? now : undefined,
          syncedAt: undefined, // mark as pending sync
        })
      } else {
        await db.quranProgress.add({
          juzId: id,
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
    cycleStatus,
    completedCount,
    inProgressCount,
    totalJuz: 30,
  }
}
