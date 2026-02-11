import { useLiveQuery } from 'dexie-react-hooks'
import { useCallback } from 'react'
import { db } from '@/lib/db'
import type { AdhkarCategory, AdhkarCounts } from '@/types'

function todayISO(): string {
  return new Date().toISOString().slice(0, 10)
}

export function useAdhkarSession(category: AdhkarCategory) {
  const sessionDate = todayISO()

  const session = useLiveQuery(
    () =>
      db.adhkarSessions
        .where('[sessionDate+category]')
        .equals([sessionDate, category])
        .first(),
    [sessionDate, category],
  )

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
    },
    [category],
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
    }
  }, [category])

  return {
    counts,
    completed: session?.completed ?? false,
    increment,
    markComplete,
  }
}
