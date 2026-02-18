import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import { getJuzCached } from '@/lib/api/quran.api'
import type { QuranCacheRecord } from '@/lib/db'

// Approximate ayah counts per Juz — used for skeleton rows
const JUZ_AYAH_COUNTS: Record<number, number> = {
  1: 148, 2: 111, 3: 126, 4: 176, 5: 124, 6: 110, 7: 149, 8: 142, 9: 159, 10: 127,
  11: 138, 12: 150, 13: 154, 14: 99, 15: 185, 16: 286, 17: 159, 18: 171, 19: 175, 20: 167,
  21: 145, 22: 131, 23: 133, 24: 123, 25: 128, 26: 121, 27: 112, 28: 137, 29: 431, 30: 564,
}

function makeSkeleton(juzNumber: number): QuranCacheRecord['ayahs'] {
  const count = JUZ_AYAH_COUNTS[juzNumber] ?? 120
  return Array.from({ length: count }, (_, i) => ({
    surah: 0,
    ayah: i + 1,
    arabic: '',
    translation: '',
  }))
}

export function useQuranReader(juzNumber: number) {
  const queryClient = useQueryClient()

  const { data, isLoading, isPlaceholderData, error } = useQuery<QuranCacheRecord['ayahs']>({
    queryKey: ['quran-juz', juzNumber],
    queryFn: () => getJuzCached(juzNumber),
    staleTime: Infinity,
    gcTime: 1000 * 60 * 30,
    placeholderData: () => makeSkeleton(juzNumber),
    // Always run queryFn (which reads Dexie first) even when browser reports offline
    networkMode: 'offlineFirst',
    retry: (failureCount) => {
      // Don't retry when offline — show error/stale cache immediately
      if (!navigator.onLine) return false
      return failureCount < 2
    },
  })

  // Silently prefetch adjacent Juz while the user is reading
  useEffect(() => {
    const neighbors = [juzNumber - 1, juzNumber + 1].filter((n) => n >= 1 && n <= 30)
    for (const n of neighbors) {
      queryClient.prefetchQuery({
        queryKey: ['quran-juz', n],
        queryFn: () => getJuzCached(n),
        staleTime: Infinity,
      })
    }
  }, [juzNumber, queryClient])

  return { ayahs: data ?? [], isLoading: isLoading || isPlaceholderData, error }
}
