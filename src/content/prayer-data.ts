import type { PrayerName, VoluntaryPrayerType } from '@/types'

export interface PrayerInfo {
  name: PrayerName
  english: string
  arabic: string
}

export interface VoluntaryPrayerInfo {
  type: VoluntaryPrayerType
  english: string
  arabic: string
  rakats: number
  associatedFard?: PrayerName
}

export const FARD_PRAYERS: PrayerInfo[] = [
  { name: 'fajr', english: 'Fajr', arabic: 'الفجر' },
  { name: 'dhuhr', english: 'Dhuhr', arabic: 'الظهر' },
  { name: 'asr', english: 'Asr', arabic: 'العصر' },
  { name: 'maghrib', english: 'Maghrib', arabic: 'المغرب' },
  { name: 'isha', english: 'Isha', arabic: 'العشاء' },
]

export const RAWATIB_PRAYERS: VoluntaryPrayerInfo[] = [
  { type: 'sunnah_fajr_before', english: '2 before Fajr', arabic: 'سنة الفجر', rakats: 2, associatedFard: 'fajr' },
  { type: 'sunnah_dhuhr_before', english: '4 before Dhuhr', arabic: 'سنة الظهر القبلية', rakats: 4, associatedFard: 'dhuhr' },
  { type: 'sunnah_dhuhr_after', english: '2 after Dhuhr', arabic: 'سنة الظهر البعدية', rakats: 2, associatedFard: 'dhuhr' },
  { type: 'sunnah_maghrib_after', english: '2 after Maghrib', arabic: 'سنة المغرب', rakats: 2, associatedFard: 'maghrib' },
  { type: 'sunnah_isha_after', english: '2 after Isha', arabic: 'سنة العشاء', rakats: 2, associatedFard: 'isha' },
]

export const STANDALONE_PRAYERS: VoluntaryPrayerInfo[] = [
  { type: 'duha', english: 'Duha', arabic: 'الضحى', rakats: 2 },
  { type: 'tahajjud', english: 'Tahajjud', arabic: 'التهجد', rakats: 2 },
  { type: 'taraweeh', english: 'Taraweeh', arabic: 'التراويح', rakats: 20 },
  { type: 'witr', english: 'Witr', arabic: 'الوتر', rakats: 3 },
]

export const ALL_VOLUNTARY_PRAYERS: VoluntaryPrayerInfo[] = [...RAWATIB_PRAYERS, ...STANDALONE_PRAYERS]
