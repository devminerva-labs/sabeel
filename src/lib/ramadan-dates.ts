import type { RamadanYear } from '@/types'

interface RamadanSeason {
  start: string
  end: string
  days: 29 | 30
}

// Hardcoded — avoids controversy and temporal drift issues.
// Add new years before each Ramadan.
export const RAMADAN_SEASONS: Record<number, RamadanSeason> = {
  2026: { start: '2026-02-17', end: '2026-03-18', days: 30 },
  2027: { start: '2027-02-07', end: '2027-03-08', days: 30 },
}

export function getCurrentRamadanYear(): RamadanYear | null {
  const today = new Date().toISOString().slice(0, 10)
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
  const start = new Date(season.start)
  const diff = Math.floor((today.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
  if (diff < 0 || diff >= season.days) return null
  return diff + 1
}
