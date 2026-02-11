import { Coordinates, PrayerTimes, CalculationMethod, type CalculationParameters } from 'adhan'
import type { PrayerName } from '@/types'

// Makkah coordinates as default fallback
const MAKKAH: Coordinates = new Coordinates(21.4225, 39.8262)

const STORAGE_KEY = 'sabeel_user_coords'

export interface PrayerTimesResult {
  fajr: Date
  dhuhr: Date
  asr: Date
  maghrib: Date
  isha: Date
}

function getCalculationParams(): CalculationParameters {
  return CalculationMethod.UmmAlQura()
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
