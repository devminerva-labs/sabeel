import { db, type QuranCacheRecord } from '@/lib/db'

const BASE_URL = 'https://api.quran.com/api/v4'

// Bump this when switching API editions or translation sources to invalidate old cache
const CACHE_SCHEMA_VERSION = 4

// Bismillah text as returned by the Quran.com API (from Surah 1:1)
// Surah 1 (Al-Fatiha): Bismillah IS verse 1 — kept as-is
// Surah 9 (At-Tawbah): no Bismillah at all
// All other surahs: inject Bismillah as an unlabeled header before verse 1
const BISMILLAH_ARABIC = 'بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ'

interface QuranComVerse {
  verse_key: string // e.g. "2:255"
  text_uthmani: string
  translations: Array<{ text: string }>
}

interface QuranComResponse {
  verses: QuranComVerse[]
  pagination: { total_pages: number }
}

function stripHtml(text: string): string {
  // Remove footnote superscripts and any remaining HTML tags
  return text.replace(/<sup[^>]*>.*?<\/sup>/g, '').replace(/<[^>]+>/g, '').trim()
}

export async function fetchJuzFromAPI(juzNumber: number): Promise<QuranCacheRecord['ayahs']> {
  const allVerses: QuranComVerse[] = []
  let page = 1
  let totalPages = 1

  // Fetch all pages (Juz 30 has 564 ayahs which exceeds the 300 per_page limit)
  while (page <= totalPages) {
    const res = await fetch(
      `${BASE_URL}/verses/by_juz/${juzNumber}?language=en&translations=20&fields=text_uthmani&per_page=300&page=${page}`
    )

    if (!res.ok) {
      throw new Error(`Failed to fetch Juz ${juzNumber}`)
    }

    const data: QuranComResponse = await res.json()
    allVerses.push(...data.verses)
    totalPages = data.pagination.total_pages
    page++
  }

  const result: QuranCacheRecord['ayahs'] = []
  let currentSurah = 0

  for (const v of allVerses) {
    const [surahStr = '0', ayahStr = '0'] = v.verse_key.split(':')
    const surah = parseInt(surahStr, 10)
    const ayah = parseInt(ayahStr, 10)
    const arabic = v.text_uthmani.trim()
    const translation = stripHtml(v.translations[0]?.text ?? '')

    // When a new surah starts, inject a Bismillah header for all surahs
    // except Al-Fatiha (where it is verse 1) and At-Tawbah (which has none).
    if (surah !== currentSurah) {
      currentSurah = surah
      if (surah !== 1 && surah !== 9) {
        result.push({ surah, ayah: 0, arabic: BISMILLAH_ARABIC, translation: '', isBismillah: true })
      }
    }

    result.push({ surah, ayah, arabic, translation })
  }

  return result
}

export async function getJuzCached(juzNumber: number): Promise<QuranCacheRecord['ayahs']> {
  const cached = await db.quranCache.get(juzNumber)
  if (cached && cached.schemaVersion === CACHE_SCHEMA_VERSION) return cached.ayahs

  try {
    const ayahs = await fetchJuzFromAPI(juzNumber)
    await db.quranCache.put({
      juzNumber,
      ayahs,
      fetchedAt: new Date().toISOString(),
      schemaVersion: CACHE_SCHEMA_VERSION,
    })
    return ayahs
  } catch (err) {
    // Offline or network error — return stale cache if available
    if (cached && cached.ayahs.length > 0) return cached.ayahs
    throw err
  }
}

// Pre-cache all Juz for offline reading
export async function precacheAllJuz(progressCallback?: (current: number, total: number) => void): Promise<void> {
  const total = 30
  for (let juz = 1; juz <= total; juz++) {
    try {
      await getJuzCached(juz)
      progressCallback?.(juz, total)
    } catch (err) {
      console.error(`Failed to cache Juz ${juz}:`, err)
    }
  }
}

// Check if all Juz are cached
export async function areAllJuzCached(): Promise<boolean> {
  const cached = await db.quranCache.toArray()
  return cached.length === 30 && cached.every(c => c.ayahs.length > 0)
}
