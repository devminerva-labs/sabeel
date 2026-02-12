export type ProgressStatus = 'not_started' | 'in_progress' | 'completed'

export type AdhkarCategory =
  | 'morning'
  | 'evening'
  | 'after_prayer'
  | 'before_sleep'
  | 'anxiety'
  | 'eating'
  | 'home'
  | 'quran_dua'

// Per-dhikr counter counts: { "morning-01": 3, "morning-02": 1 }
export type AdhkarCounts = Record<string, number>

export interface CatchUpResult {
  targetJuzToday: number
  remainingJuz: number
  remainingDays: number
  isOnTrack: boolean
  message: string
}

export type PrayerName = 'fajr' | 'dhuhr' | 'asr' | 'maghrib' | 'isha'
export type PrayerStatus = 'prayed' | 'missed'
export type VoluntaryPrayerType =
  | 'sunnah_fajr_before'
  | 'sunnah_dhuhr_before'
  | 'sunnah_dhuhr_after'
  | 'sunnah_maghrib_after'
  | 'sunnah_isha_after'
  | 'tahajjud'
  | 'duha'
  | 'taraweeh'
  | 'witr'
