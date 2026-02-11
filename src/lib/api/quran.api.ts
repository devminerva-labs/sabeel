import { db, type QuranCacheRecord } from '@/lib/db'

const BASE_URL = 'https://api.alquran.cloud/v1'

// Bump this when switching API editions or translation sources to invalidate old cache
const CACHE_SCHEMA_VERSION = 2

// The quran-uthmani edition prepends Bismillah to verse 1 of every surah except:
// - Surah 1 (Al-Fatiha): Bismillah IS verse 1 — keep as-is
// - Surah 9 (At-Tawbah): no Bismillah at all
const BISMILLAH_TEXT = 'بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ'

interface AlQuranAyah {
  number: number
  text: string
  surah: { number: number; name: string; englishName: string }
  numberInSurah: number
}

interface AlQuranResponse {
  code: number
  status: string
  data: { ayahs: AlQuranAyah[] }
}

export async function fetchJuzFromAPI(juzNumber: number): Promise<QuranCacheRecord['ayahs']> {
  const [arabicRes, englishRes] = await Promise.all([
    fetch(`${BASE_URL}/juz/${juzNumber}/quran-uthmani`),
    fetch(`${BASE_URL}/juz/${juzNumber}/en.sahih`),
  ])

  if (!arabicRes.ok || !englishRes.ok) {
    throw new Error(`Failed to fetch Juz ${juzNumber}`)
  }

  const arabicData: AlQuranResponse = await arabicRes.json()
  const englishData: AlQuranResponse = await englishRes.json()

  const arabicAyahs = arabicData.data.ayahs
  const englishAyahs = englishData.data.ayahs

  return arabicAyahs.flatMap((ar, i) => {
    const surah = ar.surah.number
    const ayah = ar.numberInSurah
    const arabic = ar.text.trim()
    const translation = englishAyahs[i]?.text ?? ''

    // For non-Fatiha, non-Tawbah surahs, the API prepends Bismillah to verse 1.
    // Split it out so it can be rendered as an unlabeled basmala header.
    if (surah !== 1 && surah !== 9 && ayah === 1 && arabic.startsWith(BISMILLAH_TEXT)) {
      const verseText = arabic.slice(BISMILLAH_TEXT.length).trim()
      return [
        { surah, ayah: 1, arabic: BISMILLAH_TEXT, translation: '', isBismillah: true },
        { surah, ayah: 1, arabic: verseText, translation },
      ]
    }

    return [{ surah, ayah, arabic, translation }]
  })
}

export async function getJuzCached(juzNumber: number): Promise<QuranCacheRecord['ayahs']> {
  const cached = await db.quranCache.get(juzNumber)
  if (cached && cached.schemaVersion === CACHE_SCHEMA_VERSION) return cached.ayahs

  const ayahs = await fetchJuzFromAPI(juzNumber)
  await db.quranCache.put({
    juzNumber,
    ayahs,
    fetchedAt: new Date().toISOString(),
    schemaVersion: CACHE_SCHEMA_VERSION,
  })

  return ayahs
}
