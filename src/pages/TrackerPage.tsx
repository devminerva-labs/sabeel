import { QuranGrid } from '@/components/QuranGrid'
import { ProgressRing } from '@/components/ProgressRing'
import { useQuranProgress } from '@/hooks/useQuranProgress'
import { useRamadanContext } from '@/hooks/useRamadanContext'
import { calculateCatchUp } from '@/lib/catch-up'

export function TrackerPage() {
  const { ramadanYear, dayNumber, season } = useRamadanContext()

  if (!ramadanYear || !season) {
    return (
      <div className="space-y-4 text-center py-12">
        <h1 className="text-xl font-semibold">Quran Tracker</h1>
        <p className="text-muted-foreground">Ramadan has not started yet.</p>
        <p className="text-sm text-muted-foreground">The tracker will activate when Ramadan begins.</p>
      </div>
    )
  }

  return <TrackerContent ramadanYear={ramadanYear} dayNumber={dayNumber} totalDays={season.days} />
}

function TrackerContent({
  ramadanYear,
  dayNumber,
  totalDays,
}: {
  ramadanYear: import('@/types').RamadanYear
  dayNumber: number | null
  totalDays: 29 | 30
}) {
  const { completedCount, totalJuz } = useQuranProgress(ramadanYear)
  const catchUp = dayNumber ? calculateCatchUp(completedCount, dayNumber, totalDays) : null

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Quran Tracker</h1>
          {dayNumber && (
            <p className="text-sm text-muted-foreground">Day {dayNumber} of Ramadan</p>
          )}
        </div>
        <ProgressRing completed={completedCount} total={totalJuz} size={72} strokeWidth={6} />
      </div>

      {/* Catch-up banner */}
      {catchUp && (
        <div
          className={`rounded-lg px-4 py-3 text-sm font-medium ${
            catchUp.isOnTrack
              ? 'bg-status-completed/20 text-green-800 dark:text-green-300'
              : 'bg-status-in-progress/20 text-amber-800 dark:text-amber-300'
          }`}
        >
          {catchUp.message}
        </div>
      )}

      {/* Tap instructions */}
      <p className="text-xs text-muted-foreground text-center">
        Tap a Juz to cycle: not started → in progress → completed
      </p>

      <QuranGrid ramadanYear={ramadanYear} />
    </div>
  )
}
