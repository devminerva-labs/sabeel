import { useMemo } from 'react'
import { PrayerCard } from '@/components/PrayerCard'
import { usePrayerLog } from '@/hooks/usePrayerLog'
import { useVoluntaryPrayers } from '@/hooks/useVoluntaryPrayers'
import { getPrayerTimes, formatPrayerTime } from '@/lib/prayer-times'
import { FARD_PRAYERS, RAWATIB_PRAYERS, STANDALONE_PRAYERS, ALL_VOLUNTARY_PRAYERS } from '@/content/prayer-data'

export function PrayerPage() {
  const { getStatus, togglePrayer, prayedCount, date } = usePrayerLog()
  const { isCompleted, toggle, completedCount } = useVoluntaryPrayers()

  const times = useMemo(() => getPrayerTimes(new Date()), [])

  const formattedDate = new Date(date + 'T00:00:00').toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold">Prayer Tracker</h1>
        <p className="text-sm text-muted-foreground">{formattedDate}</p>
      </div>

      {/* Summary */}
      <div className="rounded-lg bg-primary/10 px-4 py-3 text-sm font-medium text-primary">
        {prayedCount}/5 prayers prayed · {completedCount}/{ALL_VOLUNTARY_PRAYERS.length} Sunnah completed
      </div>

      {/* Fard Prayers */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Fard Prayers</h2>
        <p className="text-xs text-muted-foreground">
          Tap to cycle: unmarked → prayed → missed → unmarked
        </p>
        {FARD_PRAYERS.map((prayer) => (
          <PrayerCard
            key={prayer.name}
            prayer={prayer}
            time={formatPrayerTime(times[prayer.name])}
            status={getStatus(prayer.name)}
            onToggle={() => togglePrayer(prayer.name)}
          />
        ))}
      </section>

      {/* Sunnah Rawatib */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Sunnah Rawatib</h2>
        <p className="text-xs text-muted-foreground">12 rakats of regular Sunnah prayers</p>
        <div className="space-y-2">
          {RAWATIB_PRAYERS.map((prayer) => (
            <label
              key={prayer.type}
              className="flex items-center gap-3 rounded-lg border border-border p-3 cursor-pointer hover:bg-muted/50 transition-colors"
            >
              <input
                type="checkbox"
                checked={isCompleted(prayer.type)}
                onChange={() => toggle(prayer.type)}
                className="h-5 w-5 rounded border-border accent-primary"
              />
              <div className="flex-1">
                <p className="text-sm font-medium">{prayer.english}</p>
                <p className="text-xs text-muted-foreground font-arabic">{prayer.arabic} · {prayer.rakats} rakats</p>
              </div>
            </label>
          ))}
        </div>
      </section>

      {/* Standalone voluntary */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Additional Prayers</h2>
        <div className="space-y-2">
          {STANDALONE_PRAYERS.map((prayer) => (
            <label
              key={prayer.type}
              className="flex items-center gap-3 rounded-lg border border-border p-3 cursor-pointer hover:bg-muted/50 transition-colors"
            >
              <input
                type="checkbox"
                checked={isCompleted(prayer.type)}
                onChange={() => toggle(prayer.type)}
                className="h-5 w-5 rounded border-border accent-primary"
              />
              <div className="flex-1">
                <p className="text-sm font-medium">{prayer.english}</p>
                <p className="text-xs text-muted-foreground font-arabic">{prayer.arabic} · {prayer.rakats} rakats</p>
              </div>
            </label>
          ))}
        </div>
      </section>
    </div>
  )
}
