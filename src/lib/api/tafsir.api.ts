import { db } from '@/lib/db'

const ALQURAN_API = 'https://api.alquran.cloud/v1'
const CACHE_TTL_MS = 7 * 24 * 60 * 60 * 1000 // 7 days

export interface AyahDetail {
  surah: number
  ayah: number
  transliteration: string
  tafsir: string
}

export async function getAyahDetail(surah: number, ayah: number): Promise<AyahDetail> {
  const key = `${surah}:${ayah}`

  const cached = await db.tafsirCache.get(key)
  if (cached) {
    const age = Date.now() - new Date(cached.fetchedAt).getTime()
    if (age < CACHE_TTL_MS) {
      return { surah, ayah, transliteration: cached.transliteration, tafsir: cached.tafsir }
    }
  }

  const ref = `${surah}:${ayah}`
  const [translitRes, tafsirRes] = await Promise.all([
    fetch(`${ALQURAN_API}/ayah/${ref}/en.transliteration`),
    fetch(`${ALQURAN_API}/ayah/${ref}/en.muyassar`),
  ])

  if (!translitRes.ok || !tafsirRes.ok) {
    throw new Error(`Failed to fetch ayah detail for ${ref}`)
  }

  const [translitData, tafsirData] = await Promise.all([translitRes.json(), tafsirRes.json()])

  const transliteration: string = translitData?.data?.text ?? ''
  const tafsir: string = tafsirData?.data?.text ?? ''

  await db.tafsirCache.put({ surahAyah: key, transliteration, tafsir, fetchedAt: new Date().toISOString() })

  return { surah, ayah, transliteration, tafsir }
}
