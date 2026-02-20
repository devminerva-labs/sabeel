import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import { getJuzCached, getSurahCached } from '@/lib/api/quran.api'
import type { QuranCacheRecord, SurahCacheRecord } from '@/lib/db'
import { SURAH_VERSE_COUNTS } from '@/content/quran-structure'

// Approximate ayah counts per Juz — used for skeleton rows
const JUZ_AYAH_COUNTS: Record<number, number> = {
  1: 148, 2: 111, 3: 126, 4: 131, 5: 124, 6: 110, 7: 149, 8: 142, 9: 159, 10: 127,
  11: 151, 12: 170, 13: 154, 14: 227, 15: 185, 16: 269, 17: 190, 18: 202, 19: 339, 20: 171,
  21: 178, 22: 169, 23: 357, 24: 175, 25: 246, 26: 195, 27: 399, 28: 137, 29: 431, 30: 564,
}

// Use actual surah verse counts for skeleton
function makeSurahSkeleton(surahNumber: number): SurahCacheRecord['ayahs'] {
  const count = SURAH_VERSE_COUNTS[surahNumber] ?? 100
  // Add 1 for Bismillah if applicable
  const totalItems = count + (surahNumber !== 1 && surahNumber !== 9 ? 1 : 0)
  return Array.from({ length: totalItems }, (_, i) => ({
    surah: surahNumber,
    ayah: i, // 0 for Bismillah, 1+ for actual verses
    arabic: '',
    translation: '',
  }))
}

function makeJuzSkeleton(juzNumber: number): QuranCacheRecord['ayahs'] {
  const count = JUZ_AYAH_COUNTS[juzNumber] ?? 120
  return Array.from({ length: count }, (_, i) => ({
    surah: 0,
    ayah: i + 1,
    arabic: '',
    translation: '',
  }))
}

// ==================== JUZ MODE ====================

interface UseQuranReaderJuzOptions {
  mode: 'juz'
  juzNumber: number
}

export function useQuranReaderJuz(options: UseQuranReaderJuzOptions) {
  const { juzNumber } = options
  const queryClient = useQueryClient()

  const { data, isLoading, isPlaceholderData, error } = useQuery<QuranCacheRecord['ayahs']>({
    queryKey: ['quran-juz', juzNumber],
    queryFn: () => getJuzCached(juzNumber),
    staleTime: Infinity,
    gcTime: 1000 * 60 * 30,
    placeholderData: () => makeJuzSkeleton(juzNumber),
    networkMode: 'offlineFirst',
    retry: (failureCount) => {
      if (!navigator.onLine) return false
      return failureCount < 2
    },
  })

  // Silently prefetch adjacent Juz
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

  return { 
    ayahs: data ?? [], 
    isLoading: isLoading || isPlaceholderData, 
    error,
    mode: 'juz' as const,
    juzNumber,
  }
}

// ==================== SURAH MODE ====================

interface UseQuranReaderSurahOptions {
  mode: 'surah'
  surahNumber: number
}

export function useQuranReaderSurah(options: UseQuranReaderSurahOptions) {
  const { surahNumber } = options
  const queryClient = useQueryClient()

  const { data, isLoading, isPlaceholderData, error } = useQuery<SurahCacheRecord['ayahs']>({
    queryKey: ['quran-surah', surahNumber],
    queryFn: () => getSurahCached(surahNumber),
    staleTime: Infinity,
    gcTime: 1000 * 60 * 30,
    placeholderData: () => makeSurahSkeleton(surahNumber),
    networkMode: 'offlineFirst',
    retry: (failureCount) => {
      if (!navigator.onLine) return false
      return failureCount < 2
    },
  })

  // Silently prefetch adjacent Surahs
  useEffect(() => {
    const neighbors = [surahNumber - 1, surahNumber + 1].filter((n) => n >= 1 && n <= 114)
    for (const n of neighbors) {
      queryClient.prefetchQuery({
        queryKey: ['quran-surah', n],
        queryFn: () => getSurahCached(n),
        staleTime: Infinity,
      })
    }
  }, [surahNumber, queryClient])

  return { 
    ayahs: data ?? [], 
    isLoading: isLoading || isPlaceholderData, 
    error,
    mode: 'surah' as const,
    surahNumber,
  }
}

// ==================== UNIFIED HOOK ====================

export type UseQuranReaderOptions = 
  | { mode: 'juz'; juzNumber: number }
  | { mode: 'surah'; surahNumber: number }

export function useQuranReader(options: UseQuranReaderOptions) {
  if (options.mode === 'juz') {
    return useQuranReaderJuz(options)
  } else {
    return useQuranReaderSurah(options)
  }
}
