import type { RamadanYear } from '@/types'

interface RamadanSeason {
  start: string
  end: string
  days: 29 | 30
}

// Hardcoded — avoids controversy and temporal drift issues.
// Add new years before each Ramadan.
export const RAMADAN_SEASONS: Record<number, RamadanSeason> = {
  2026: { start: '2026-02-18', end: '2026-03-19', days: 30 },
  2027: { start: '2027-02-07', end: '2027-03-08', days: 30 },
}

export function getCurrentRamadanYear(): RamadanYear | null {
  // Use sv-SE locale for local-time YYYY-MM-DD to match getRamadanDayNumber's local-time logic.
  const today = new Date().toLocaleDateString('sv-SE')
  for (const [year, season] of Object.entries(RAMADAN_SEASONS)) {
    if (today >= season.start && today <= season.end) {
      return Number(year) as RamadanYear
    }
  }
  return null
}

export function getRamadanSeason(year: RamadanYear): RamadanSeason | undefined {
  return RAMADAN_SEASONS[year]
}

export function getRamadanDayNumber(year: RamadanYear): number | null {
  const season = RAMADAN_SEASONS[year]
  if (!season) return null
  const today = new Date()
  // Append T00:00:00 to force local-time parsing (bare date strings parse as UTC midnight,
  // which causes off-by-one errors for users in UTC+ timezones near midnight).
  const start = new Date(season.start + 'T00:00:00')
  const diff = Math.floor((today.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
  if (diff < 0 || diff >= season.days) return null
  return diff + 1
}

// The range of valid Laylatul Qadr night numbers (last 10 nights of Ramadan)
export type LaylahNight = 21 | 22 | 23 | 24 | 25 | 26 | 27 | 28 | 29 | 30

/**
 * Returns the current Islamic night number (1-30), accounting for the fact
 * that the Islamic night starts at Maghrib, not midnight.
 *
 * If maghrib is provided and now >= maghrib, the night belongs to dayNumber + 1.
 * Optional `now` parameter makes this testable without mocking Date.
 */
export function getLaylahNightNumber(
  dayNumber: number,
  now: Date = new Date(),
  maghrib?: Date,
): LaylahNight | null {
  const afterMaghrib = maghrib ? now >= maghrib : false
  const nightNumber = dayNumber + (afterMaghrib ? 1 : 0)
  if (nightNumber < 21 || nightNumber > 30) return null
  return nightNumber as LaylahNight
}

/**
 * Returns 'active' when the current Islamic night is within the last 10 nights
 * (nights 21-30), 'pre' when Ramadan is ongoing but last 10 haven't started,
 * or null when not in Ramadan.
 */
export function getLaylahPhase(
  dayNumber: number | null,
  now: Date = new Date(),
  maghrib?: Date,
): 'pre' | 'active' | null {
  if (!dayNumber) return null
  const afterMaghrib = maghrib ? now >= maghrib : false
  const islamicNight = dayNumber + (afterMaghrib ? 1 : 0)
  if (islamicNight >= 21) return 'active'
  return 'pre'
}

/** Returns true if the given night number is an odd night (potential Laylatul Qadr) */
export function isOddLaylahNight(nightNumber: LaylahNight): boolean {
  return nightNumber % 2 === 1
}

/**
 * How many nights remain until the last 10 nights begin.
 * Returns 0 when already in the last 10 nights.
 */
export function nightsUntilLastTen(dayNumber: number, maghrib?: Date, now: Date = new Date()): number {
  const afterMaghrib = maghrib ? now >= maghrib : false
  const islamicNight = dayNumber + (afterMaghrib ? 1 : 0)
  return Math.max(0, 21 - islamicNight)
}
