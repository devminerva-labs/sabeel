import { Link } from 'react-router-dom'
import { useLiveQuery } from 'dexie-react-hooks'
import { ArabicText } from '@/components/ArabicText'
import { ProgressRing } from '@/components/ProgressRing'
import { useQuranProgress } from '@/hooks/useQuranProgress'
import { useRamadanContext } from '@/hooks/useRamadanContext'
import { usePrayerLog } from '@/hooks/usePrayerLog'
import { usePWAInstall } from '@/hooks/usePWAInstall'
import { calculateCatchUp } from '@/lib/catch-up'
import { db } from '@/lib/db'
import type { AdhkarCategory } from '@/types'

const ADHKAR_CATEGORIES: AdhkarCategory[] = ['morning', 'evening', 'after_prayer', 'before_sleep', 'anxiety']

function todayISO() {
  return new Date().toLocaleDateString('sv-SE')
}

function useAdhkarTodayCount() {
  const date = todayISO()
  const sessions = useLiveQuery(
    () => db.adhkarSessions.where('[sessionDate+category]').between([date, ''], [date, '\uffff']).toArray(),
    [date],
    [],
  )
  const completedCount = sessions.filter((s) => s.completed).length
  return { completedCount, total: ADHKAR_CATEGORIES.length }
}

export function DashboardPage() {
  const { ramadanYear, dayNumber, season } = useRamadanContext()
  const { canInstall, install } = usePWAInstall()
  const { prayedCount } = usePrayerLog()
  const { completedCount: adhkarDone, total: adhkarTotal } = useAdhkarTodayCount()

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

      {/* Today's stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl border border-border bg-background p-4 space-y-1">
          <p className="text-xs text-muted-foreground uppercase tracking-wide">Prayers today</p>
          <p className="text-2xl font-bold text-foreground">
            {prayedCount}<span className="text-base font-normal text-muted-foreground">/5</span>
          </p>
          <p className="text-xs text-muted-foreground">
            {prayedCount === 5 ? 'All prayed' : prayedCount === 0 ? 'None logged yet' : `${5 - prayedCount} remaining`}
          </p>
        </div>

        <div className="rounded-xl border border-border bg-background p-4 space-y-1">
          <p className="text-xs text-muted-foreground uppercase tracking-wide">Adhkar today</p>
          <p className="text-2xl font-bold text-foreground">
            {adhkarDone}<span className="text-base font-normal text-muted-foreground">/{adhkarTotal}</span>
          </p>
          <p className="text-xs text-muted-foreground">
            {adhkarDone === adhkarTotal ? 'All complete' : adhkarDone === 0 ? 'Not started' : 'In progress'}
          </p>
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 gap-3">
        <Link
          to="/app/quran"
          className="rounded-xl bg-primary/10 p-4 text-center hover:bg-primary/20 transition-colors"
        >
          <p className="text-lg font-semibold text-primary">Quran</p>
          <p className="text-sm text-muted-foreground">Track & read</p>
        </Link>
        <Link
          to="/app/prayer"
          className="rounded-xl bg-secondary/10 p-4 text-center hover:bg-secondary/20 transition-colors"
        >
          <p className="text-lg font-semibold text-secondary">Prayer</p>
          <p className="text-sm text-muted-foreground">Track salah</p>
        </Link>
        <Link
          to="/app/adhkar"
          className="rounded-xl bg-primary/10 p-4 text-center hover:bg-primary/20 transition-colors col-span-2"
        >
          <p className="text-lg font-semibold text-primary">Adhkar</p>
          <p className="text-sm text-muted-foreground">Daily remembrance</p>
        </Link>
      </div>

      {/* Leaderboard placeholder */}
      <div className="rounded-xl border border-dashed border-border p-5 text-center space-y-2">
        <p className="text-base font-semibold text-foreground">Halqa Leaderboard</p>
        <p className="text-sm text-muted-foreground">
          Compete with your circle — coming in v1.1.
        </p>
        <p className="text-xs text-muted-foreground italic">
          Invite your Halqa · Private groups · Anonymous leaderboard
        </p>
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
