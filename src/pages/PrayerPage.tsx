import { useMemo, useEffect, useState, useCallback } from 'react'
import { PrayerCard } from '@/components/PrayerCard'
import { usePrayerLog } from '@/hooks/usePrayerLog'
import { useVoluntaryPrayers } from '@/hooks/useVoluntaryPrayers'
import { useGeolocation } from '@/hooks/useGeolocation'
import {
  getPrayerTimes,
  formatPrayerTime,
  CALCULATION_METHODS,
  getSavedCalculationMethod,
  saveCalculationMethod,
  type CalculationMethodKey,
} from '@/lib/prayer-times'
import { FARD_PRAYERS, RAWATIB_PRAYERS, STANDALONE_PRAYERS, ALL_VOLUNTARY_PRAYERS } from '@/content/prayer-data'

export function PrayerPage() {
  const { getStatus, togglePrayer, prayedCount, date } = usePrayerLog()
  const { isCompleted, toggle, completedCount } = useVoluntaryPrayers()
  const { status: geoStatus, error: geoError, requestLocation, hasCoords } = useGeolocation()

  const [method, setMethod] = useState<CalculationMethodKey>(getSavedCalculationMethod)
  // Bump to force recompute after geolocation changes
  const [coordsVersion, setCoordsVersion] = useState(0)

  // Auto-request geolocation on mount if no saved coords
  useEffect(() => {
    if (!hasCoords) {
      requestLocation()
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // When geolocation completes, bump version to recalculate times
  useEffect(() => {
    if (geoStatus === 'granted') {
      setCoordsVersion((v) => v + 1)
    }
  }, [geoStatus])

  const handleMethodChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const newMethod = e.target.value as CalculationMethodKey
    saveCalculationMethod(newMethod)
    setMethod(newMethod)
  }, [])

  const times = useMemo(
    () => getPrayerTimes(new Date()),
    [method, coordsVersion] // eslint-disable-line react-hooks/exhaustive-deps
  )

  const formattedDate = new Date(date + 'T00:00:00').toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  })

  const locationLabel =
    geoStatus === 'requesting'
      ? 'Detecting your location...'
      : geoStatus === 'granted'
        ? 'Using your location'
        : geoStatus === 'denied' || geoStatus === 'unavailable'
          ? geoError ?? 'Using default (Makkah)'
          : 'Using default (Makkah)'

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold">Prayer Tracker</h1>
        <p className="text-sm text-muted-foreground">{formattedDate}</p>
      </div>

      {/* Location & method settings */}
      <div className="rounded-lg border border-border p-3 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">{locationLabel}</span>
          {(geoStatus === 'denied' || geoStatus === 'idle') && (
            <button
              onClick={requestLocation}
              className="text-xs text-primary font-medium hover:underline"
            >
              {geoStatus === 'denied' ? 'Retry' : 'Detect location'}
            </button>
          )}
        </div>
        <div>
          <label htmlFor="calc-method" className="text-xs text-muted-foreground block mb-1">
            Calculation method
          </label>
          <select
            id="calc-method"
            value={method}
            onChange={handleMethodChange}
            className="w-full text-sm rounded-md border border-border bg-background px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-ring"
          >
            {Object.entries(CALCULATION_METHODS).map(([key, { label }]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </div>
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
