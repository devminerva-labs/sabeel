import { Link } from 'react-router-dom'
import { ArabicText } from '@/components/ArabicText'
import { ProgressRing } from '@/components/ProgressRing'
import { useQuranProgress } from '@/hooks/useQuranProgress'
import { useRamadanContext } from '@/hooks/useRamadanContext'
import { usePWAInstall } from '@/hooks/usePWAInstall'
import { calculateCatchUp } from '@/lib/catch-up'

export function DashboardPage() {
  const { ramadanYear, dayNumber, season } = useRamadanContext()
  const { canInstall, install } = usePWAInstall()

  return (
    <div className="space-y-6">
      {/* PWA install prompt */}
      {canInstall && (
        <button
          onClick={install}
          className="w-full rounded-lg bg-primary/10 border border-primary/20 p-3 text-sm font-medium text-primary hover:bg-primary/20 transition-colors"
        >
          Install Sabeel for quick access
        </button>
      )}

      <div className="text-center space-y-2">
        <ArabicText as="h1" className="text-3xl">
          بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ
        </ArabicText>
        <h2 className="text-xl font-semibold text-foreground">Your Ramadan Dashboard</h2>
        {dayNumber && (
          <p className="text-muted-foreground">Day {dayNumber} of Ramadan</p>
        )}
        {!ramadanYear && (
          <p className="text-muted-foreground">Ramadan has not started yet</p>
        )}
      </div>

      {/* Progress ring */}
      {ramadanYear ? (
        <DashboardProgress ramadanYear={ramadanYear} dayNumber={dayNumber} totalDays={season?.days ?? 30} />
      ) : (
        <div className="flex justify-center">
          <ProgressRing completed={0} total={30} />
        </div>
      )}

      {/* Quick actions */}
      <div className="grid grid-cols-2 gap-3">
        <Link
          to="/tracker"
          className="rounded-xl bg-primary/10 p-4 text-center hover:bg-primary/20 transition-colors"
        >
          <p className="text-lg font-semibold text-primary">Quran Tracker</p>
          <p className="text-sm text-muted-foreground">Continue reading</p>
        </Link>
        <Link
          to="/adhkar"
          className="rounded-xl bg-secondary/10 p-4 text-center hover:bg-secondary/20 transition-colors"
        >
          <p className="text-lg font-semibold text-secondary">Adhkar</p>
          <p className="text-sm text-muted-foreground">Daily remembrance</p>
        </Link>
      </div>
    </div>
  )
}

function DashboardProgress({
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
    <div className="space-y-3">
      <div className="flex justify-center">
        <ProgressRing completed={completedCount} total={totalJuz} />
      </div>
      {catchUp && (
        <p
          className={`text-center text-sm font-medium ${
            catchUp.isOnTrack ? 'text-green-600 dark:text-green-400' : 'text-amber-600 dark:text-amber-400'
          }`}
        >
          {catchUp.message}
        </p>
      )}
    </div>
  )
}
