import { db, type QuranCacheRecord } from '@/lib/db'

const BASE_URL = 'https://api.alquran.cloud/v1'

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

  return arabicAyahs.map((ar, i) => ({
    surah: ar.surah.number,
    ayah: ar.numberInSurah,
    arabic: ar.text,
    translation: englishAyahs[i]?.text ?? '',
  }))
}

export async function getJuzCached(juzNumber: number): Promise<QuranCacheRecord['ayahs']> {
  const cached = await db.quranCache.get(juzNumber)
  if (cached) return cached.ayahs

  const ayahs = await fetchJuzFromAPI(juzNumber)
  await db.quranCache.put({
    juzNumber,
    ayahs,
    fetchedAt: new Date().toISOString(),
  })

  return ayahs
}
