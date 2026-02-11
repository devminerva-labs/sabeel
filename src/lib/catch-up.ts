import type { CatchUpResult } from '@/types'

/**
 * Pure function — no side effects, no server calls.
 * All inputs available client-side.
 */
export function calculateCatchUp(
  completedJuz: number,
  ramadanDayNumber: number,
  totalRamadanDays: 29 | 30,
): CatchUpResult {
  const remainingJuz = 30 - completedJuz
  const remainingDays = totalRamadanDays - ramadanDayNumber

  if (remainingDays <= 0) {
    return {
      targetJuzToday: 0,
      remainingJuz,
      remainingDays: 0,
      isOnTrack: completedJuz >= 30,
      message: completedJuz >= 30 ? 'Alhamdulillah! Quran completed!' : `Ramadan complete — ${completedJuz}/30 Juz read`,
    }
  }

  const idealPerDay = 30 / totalRamadanDays
  const expectedByToday = Math.ceil(idealPerDay * ramadanDayNumber)
  const isOnTrack = completedJuz >= expectedByToday

  const targetJuzToday = isOnTrack
    ? Math.ceil(idealPerDay)
    : Math.ceil(remainingJuz / remainingDays)

  const message = isOnTrack
    ? `On track — read ${targetJuzToday} Juz today`
    : `${remainingJuz} Juz left in ${remainingDays} days — read ${targetJuzToday} today`

  return { targetJuzToday, remainingJuz, remainingDays, isOnTrack, message }
}
