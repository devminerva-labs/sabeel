import { useLiveQuery } from 'dexie-react-hooks'
import { useCallback, useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { db } from '@/lib/db'
import { syncLocalProgress, pullServerProgress } from '@/lib/api/quran-progress.api'
import { supabase } from '@/lib/supabase/client'
import type { JuzId, RamadanYear, ProgressStatus } from '@/types'

/** Sync to Supabase then invalidate the leaderboard cache */
async function triggerSync(invalidateLeaderboard: () => void) {
  if (!supabase) return
  const { data } = await supabase.auth.getUser()
  if (data.user) {
    try {
      await syncLocalProgress(data.user.id)
      invalidateLeaderboard()
    } catch (err) {
      console.error('[sync] failed:', err)
    }
  }
}

const NEXT_STATUS: Record<ProgressStatus, ProgressStatus> = {
  not_started: 'in_progress',
  in_progress: 'completed',
  completed: 'not_started',
}

export function useQuranProgress(ramadanYear: RamadanYear, userId?: string | null) {
  const queryClient = useQueryClient()
  const invalidateLeaderboard = useCallback(
    () => queryClient.invalidateQueries({ queryKey: ['halaqah-leaderboard'] }),
    [queryClient],
  )

  const records = useLiveQuery(
    () => db.quranProgress.where({ ramadanYear }).toArray(),
    [ramadanYear],
    [],
  )

  // Pull sync on mount and when userId changes
  useEffect(() => {
    if (userId && ramadanYear) {
      pullServerProgress(userId, ramadanYear).catch(console.error)
    }
  }, [userId, ramadanYear])

  // Build a map: juzId → status
  const statusMap = new Map<number, ProgressStatus>()
  for (const r of records) {
    statusMap.set(r.juzId, r.status)
  }

  const getStatus = useCallback(
    (id: JuzId): ProgressStatus => statusMap.get(id) ?? 'not_started',
    [statusMap],
  )

  /** Set status to a specific value only if the current status matches `from`. */
  const setStatusIf = useCallback(
    async (id: JuzId, from: ProgressStatus, to: ProgressStatus) => {
      const current = statusMap.get(id) ?? 'not_started'
      if (current !== from) return // no-op if status doesn't match

      const now = new Date().toISOString()
      const existing = await db.quranProgress
        .where('[juzId+ramadanYear]')
        .equals([id, ramadanYear])
        .first()

      if (existing) {
        await db.quranProgress.update(existing.id!, {
          status: to,
          updatedAt: now,
          completedAt: to === 'completed' ? now : undefined,
          syncedAt: undefined,
        })
      } else {
        await db.quranProgress.add({
          juzId: id,
          ramadanYear,
          status: to,
          updatedAt: now,
          completedAt: to === 'completed' ? now : undefined,
        })
      }
      triggerSync(invalidateLeaderboard)
    },
    [ramadanYear, statusMap, invalidateLeaderboard],
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
      triggerSync(invalidateLeaderboard)
    },
    [ramadanYear, statusMap, invalidateLeaderboard],
  )

  const completedCount = records.filter((r) => r.status === 'completed').length
  const inProgressCount = records.filter((r) => r.status === 'in_progress').length

  // Manual sync trigger
  const pullSync = useCallback(async () => {
    if (!userId || !ramadanYear) return
    await pullServerProgress(userId, ramadanYear)
    invalidateLeaderboard()
  }, [userId, ramadanYear, invalidateLeaderboard])

  return {
    getStatus,
    setStatusIf,
    cycleStatus,
    completedCount,
    inProgressCount,
    totalJuz: 30,
    pullSync,
  }
}
