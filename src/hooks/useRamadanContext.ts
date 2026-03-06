import { useState, useEffect } from 'react'
import { getCurrentRamadanYear, getRamadanSeason, getRamadanDayNumber } from '@/lib/ramadan-dates'

function computeContext() {
  const ramadanYear = getCurrentRamadanYear()
  const season = ramadanYear ? getRamadanSeason(ramadanYear) : undefined
  const dayNumber = ramadanYear ? getRamadanDayNumber(ramadanYear) : null
  return { ramadanYear, season, dayNumber }
}

export function useRamadanContext() {
  const [ctx, setCtx] = useState(computeContext)
  // Independent tick counter so the timer reschedules even when dayNumber stays null
  // (e.g. the day after the last day of Ramadan, null → null wouldn't re-trigger [ctx.dayNumber]).
  const [tick, setTick] = useState(0)

  // Recompute at midnight so dayNumber stays current if the app is left open overnight.
  useEffect(() => {
    const now = new Date()
    const msUntilMidnight =
      new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1).getTime() - now.getTime()

    const timer = setTimeout(() => {
      setCtx(computeContext())
      setTick((t) => t + 1) // always bumps, guaranteeing the next timer schedules
    }, msUntilMidnight + 500) // +500ms buffer past midnight

    return () => clearTimeout(timer)
  }, [tick])

  return ctx
}
