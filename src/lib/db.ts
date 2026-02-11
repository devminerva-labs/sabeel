import Dexie, { type Table } from 'dexie'
import type { JuzId, RamadanYear, ProgressStatus, AdhkarCategory, AdhkarCounts, PrayerName, PrayerStatus, VoluntaryPrayerType } from '@/types'

export interface QuranProgressRecord {
  id?: number
  juzId: JuzId
  ramadanYear: RamadanYear
  status: ProgressStatus
  completedAt?: string
  updatedAt: string
  syncedAt?: string
}

export interface AdhkarSessionRecord {
  id?: number
  sessionDate: string // ISO date YYYY-MM-DD
  category: AdhkarCategory
  completed: boolean
  counts: AdhkarCounts
  completedAt?: string
  syncedAt?: string
}

export interface PrayerLogRecord {
  id?: number
  date: string // YYYY-MM-DD
  prayer: PrayerName
  status: PrayerStatus
  prayedAt?: string
  updatedAt: string
  syncedAt?: string
}

export interface VoluntaryPrayerRecord {
  id?: number
  date: string // YYYY-MM-DD
  type: VoluntaryPrayerType
  completed: boolean
  completedAt?: string
  syncedAt?: string
}

export interface QuranCacheRecord {
  juzNumber: number // 1-30, used as PK
  ayahs: Array<{ surah: number; ayah: number; arabic: string; translation: string }>
  fetchedAt: string
}

export interface TafsirCacheRecord {
  surahAyah: string // "2:255" — used as PK
  transliteration: string
  tafsir: string
  fetchedAt: string
}

class SabeelDB extends Dexie {
  quranProgress!: Table<QuranProgressRecord>
  adhkarSessions!: Table<AdhkarSessionRecord>
  prayerLogs!: Table<PrayerLogRecord>
  voluntaryPrayers!: Table<VoluntaryPrayerRecord>
  quranCache!: Table<QuranCacheRecord>
  tafsirCache!: Table<TafsirCacheRecord>

  constructor() {
    super('SabeelDB')
    this.version(2).stores({
      quranProgress: '++id, ramadanYear, [juzId+ramadanYear], syncedAt',
      adhkarSessions: '++id, [sessionDate+category], syncedAt',
    })
    this.version(3).stores({
      quranProgress: '++id, ramadanYear, [juzId+ramadanYear], syncedAt',
      adhkarSessions: '++id, [sessionDate+category], syncedAt',
      prayerLogs: '++id, [date+prayer], syncedAt',
      voluntaryPrayers: '++id, [date+type], syncedAt',
      quranCache: 'juzNumber',
    })
    this.version(4).stores({
      quranProgress: '++id, ramadanYear, [juzId+ramadanYear], syncedAt',
      adhkarSessions: '++id, [sessionDate+category], syncedAt',
      prayerLogs: '++id, [date+prayer], syncedAt',
      voluntaryPrayers: '++id, [date+type], syncedAt',
      quranCache: 'juzNumber',
      tafsirCache: 'surahAyah',
    })
  }
}

export const db = new SabeelDB()
