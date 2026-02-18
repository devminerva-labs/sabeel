import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '@/lib/db'
import type { ReadingBookmarkRecord } from '@/lib/db'

export function useLastReadingBookmark(): ReadingBookmarkRecord | undefined {
  return useLiveQuery(
    () =>
      db.readingBookmarks
        .toArray()
        .then((records) =>
          records.sort(
            (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
          )[0]
        )
  )
}
