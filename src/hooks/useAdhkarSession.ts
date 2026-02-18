import { useLiveQuery } from 'dexie-react-hooks'
import { useCallback, useEffect } from 'react'
import { db } from '@/lib/db'
import { upsertAdhkarSession, pullAdhkarSessions } from '@/lib/api/adhkar-sessions.api'
import type { AdhkarCategory, AdhkarCounts } from '@/types'

function todayISO(): string {
  return new Date().toLocaleDateString('sv-SE')
}

export function useAdhkarSession(category: AdhkarCategory, userId?: string | null) {
  const sessionDate = todayISO()

  const session = useLiveQuery(
    () =>
      db.adhkarSessions
        .where('[sessionDate+category]')
        .equals([sessionDate, category])
        .first(),
    [sessionDate, category],
  )

  // Pull from server on mount and when userId changes
  useEffect(() => {
    if (userId) {
      pullAdhkarSessions(userId, sessionDate).catch(console.error)
    }
  }, [userId, sessionDate])

  const counts: AdhkarCounts = session?.counts ?? {}

  const increment = useCallback(
    async (dhikrId: string) => {
      const now = todayISO()
      const existing = await db.adhkarSessions
        .where('[sessionDate+category]')
        .equals([now, category])
        .first()

      const newCounts = { ...(existing?.counts ?? {}), [dhikrId]: ((existing?.counts ?? {})[dhikrId] ?? 0) + 1 }

      if (existing) {
        await db.adhkarSessions.update(existing.id!, {
          counts: newCounts,
          syncedAt: undefined,
        })
      } else {
        await db.adhkarSessions.add({
          sessionDate: now,
          category,
          completed: false,
          counts: newCounts,
        })
      }

      if (userId) {
        upsertAdhkarSession(userId, now, category, newCounts, false).catch(console.error)
      }
    },
    [category, userId],
  )

  const markComplete = useCallback(async () => {
    const now = todayISO()
    const existing = await db.adhkarSessions
      .where('[sessionDate+category]')
      .equals([now, category])
      .first()

    if (existing) {
      await db.adhkarSessions.update(existing.id!, {
        completed: true,
        completedAt: new Date().toISOString(),
        syncedAt: undefined,
      })

      if (userId) {
        upsertAdhkarSession(userId, now, category, existing.counts, true).catch(console.error)
      }
    }
  }, [category, userId])

  return {
    counts,
    completed: session?.completed ?? false,
    increment,
    markComplete,
  }
}
