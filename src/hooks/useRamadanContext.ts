import { useMemo } from 'react'
import { getCurrentRamadanYear, getRamadanSeason, getRamadanDayNumber } from '@/lib/ramadan-dates'

export function useRamadanContext() {
  return useMemo(() => {
    const ramadanYear = getCurrentRamadanYear()
    const season = ramadanYear ? getRamadanSeason(ramadanYear) : undefined
    const dayNumber = ramadanYear ? getRamadanDayNumber(ramadanYear) : null

    return { ramadanYear, season, dayNumber }
  }, [])
}
