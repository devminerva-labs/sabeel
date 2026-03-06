import { useLiveQuery } from 'dexie-react-hooks'
import { useCallback, useEffect, useMemo } from 'react'
import { db } from '@/lib/db'
import { supabase } from '@/lib/supabase/client'
import type { SurahId, RamadanYear, ProgressStatus } from '@/types'

const NEXT_STATUS: Record<ProgressStatus, ProgressStatus> = {
  not_started: 'in_progress',
  in_progress: 'completed',
  completed: 'not_started',
}

export function useSurahProgress(ramadanYear: RamadanYear, userId?: string | null) {
  const records = useLiveQuery(
    () => db.surahProgress.where({ ramadanYear }).toArray(),
    [ramadanYear],
    [],
  )

  // Pull sync on mount - similar to juz progress
  useEffect(() => {
    if (!userId || !ramadanYear) return
    
    const pullSurahProgress = async () => {
      if (!supabase) return
      const { data, error } = await supabase
        .from('surah_progress')
        .select('*')
        .eq('user_id', userId)
        .eq('ramadan_year', ramadanYear)
      
      if (error || !data) return

      const now = new Date().toISOString()
      const serverRecords = data.map((row) => ({
        surahId: row.surah_id as SurahId,
        ramadanYear: row.ramadan_year as RamadanYear,
        status: row.status as ProgressStatus,
        completedAt: row.completed_at,
        updatedAt: row.updated_at,
        syncedAt: now,
      }))

      if (serverRecords.length === 0) return

      // Batch read: one query instead of N sequential reads
      const existingRecords = await db.surahProgress
        .where('ramadanYear')
        .equals(ramadanYear)
        .toArray()
      const existingMap = new Map(existingRecords.map((r) => [r.surahId, r]))

      // Only upsert records where server version is newer; merge local id to avoid duplicates
      const toUpsert = serverRecords
        .filter((record) => {
          const existing = existingMap.get(record.surahId)
          return !existing || new Date(record.updatedAt) > new Date(existing.updatedAt)
        })
        .map((record) => {
          const existing = existingMap.get(record.surahId)
          return existing ? { ...record, id: existing.id } : record
        })

      if (toUpsert.length > 0) {
        await db.surahProgress.bulkPut(toUpsert)
      }
    }
    
    pullSurahProgress().catch(console.error)
  }, [userId, ramadanYear])

  const statusMap = useMemo(() => {
    const map = new Map<number, ProgressStatus>()
    for (const r of records) {
      map.set(r.surahId, r.status)
    }
    return map
  }, [records])

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
