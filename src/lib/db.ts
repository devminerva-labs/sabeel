import Dexie, { type Table } from 'dexie'
import type { JuzId, RamadanYear, ProgressStatus, AdhkarCategory, AdhkarCounts } from '@/types'

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

class SabeelDB extends Dexie {
  quranProgress!: Table<QuranProgressRecord>
  adhkarSessions!: Table<AdhkarSessionRecord>

  constructor() {
    super('SabeelDB')
    this.version(2).stores({
      quranProgress: '++id, ramadanYear, [juzId+ramadanYear], syncedAt',
      adhkarSessions: '++id, [sessionDate+category], syncedAt',
    })
  }
}

export const db = new SabeelDB()
