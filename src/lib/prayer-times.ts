import { Coordinates, PrayerTimes, CalculationMethod, type CalculationParameters } from 'adhan'
import type { PrayerName } from '@/types'

// Makkah coordinates as default fallback
const MAKKAH: Coordinates = new Coordinates(21.4225, 39.8262)

const STORAGE_KEY = 'sabeel_user_coords'
const METHOD_STORAGE_KEY = 'sabeel_calc_method'

export interface PrayerTimesResult {
  fajr: Date
  dhuhr: Date
  asr: Date
  maghrib: Date
  isha: Date
}

export const CALCULATION_METHODS = {
  MuslimWorldLeague: { label: 'Muslim World League', fn: () => CalculationMethod.MuslimWorldLeague() },
  Egyptian: { label: 'Egyptian General Authority', fn: () => CalculationMethod.Egyptian() },
  Karachi: { label: 'University of Islamic Sciences, Karachi', fn: () => CalculationMethod.Karachi() },
  UmmAlQura: { label: 'Umm al-Qura University, Makkah', fn: () => CalculationMethod.UmmAlQura() },
  Dubai: { label: 'Dubai', fn: () => CalculationMethod.Dubai() },
  MoonsightingCommittee: { label: 'Moonsighting Committee', fn: () => CalculationMethod.MoonsightingCommittee() },
  NorthAmerica: { label: 'ISNA (North America)', fn: () => CalculationMethod.NorthAmerica() },
  Kuwait: { label: 'Kuwait', fn: () => CalculationMethod.Kuwait() },
  Qatar: { label: 'Qatar', fn: () => CalculationMethod.Qatar() },
  Singapore: { label: 'Singapore', fn: () => CalculationMethod.Singapore() },
  Tehran: { label: 'Institute of Geophysics, Tehran', fn: () => CalculationMethod.Tehran() },
  Turkey: { label: 'Diyanet, Turkey', fn: () => CalculationMethod.Turkey() },
} as const

export type CalculationMethodKey = keyof typeof CALCULATION_METHODS

export function saveCalculationMethod(method: CalculationMethodKey): void {
  localStorage.setItem(METHOD_STORAGE_KEY, method)
}

export function getSavedCalculationMethod(): CalculationMethodKey {
  const saved = localStorage.getItem(METHOD_STORAGE_KEY)
  if (saved && saved in CALCULATION_METHODS) return saved as CalculationMethodKey
  return 'MuslimWorldLeague'
}

function getCalculationParams(): CalculationParameters {
  const method = getSavedCalculationMethod()
  return CALCULATION_METHODS[method].fn()
}

export function getPrayerTimes(date: Date, coords?: Coordinates): PrayerTimesResult {
  const c = coords ?? getSavedCoordinates() ?? MAKKAH
  const pt = new PrayerTimes(c, date, getCalculationParams())
  return {
    fajr: pt.fajr,
    dhuhr: pt.dhuhr,
    asr: pt.asr,
    maghrib: pt.maghrib,
    isha: pt.isha,
  }
}

export function formatPrayerTime(date: Date): string {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

export function getPrayerTimeByName(times: PrayerTimesResult, name: PrayerName): Date {
  return times[name]
}

export function saveCoordinates(lat: number, lng: number): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ lat, lng }))
}

export function getSavedCoordinates(): Coordinates | null {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) return null
  try {
    const { lat, lng } = JSON.parse(raw)
    return new Coordinates(lat, lng)
  } catch {
    return null
  }
}

export function clearSavedCoordinates(): void {
  localStorage.removeItem(STORAGE_KEY)
}
