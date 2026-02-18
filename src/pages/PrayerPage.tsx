import { useMemo, useEffect, useState, useCallback } from 'react'
import { PrayerCard } from '@/components/PrayerCard'
import { usePrayerLog } from '@/hooks/usePrayerLog'
import { useVoluntaryPrayers } from '@/hooks/useVoluntaryPrayers'
import { useGeolocation } from '@/hooks/useGeolocation'
import { useAuth } from '@/hooks/useAuth'
import {
  getPrayerTimes,
  formatPrayerTime,
  CALCULATION_METHODS,
  getSavedCalculationMethod,
  saveCalculationMethod,
  saveCoordinates,
  clearSavedCoordinates,
  type CalculationMethodKey,
} from '@/lib/prayer-times'
import { FARD_PRAYERS, RAWATIB_PRAYERS, STANDALONE_PRAYERS, ALL_VOLUNTARY_PRAYERS } from '@/content/prayer-data'

// Common city coordinates
const COMMON_CITIES = [
  { name: 'Makkah', lat: 21.4225, lng: 39.8262 },
  { name: 'Madinah', lat: 24.5247, lng: 39.5692 },
  { name: 'Cairo', lat: 30.0444, lng: 31.2357 },
  { name: 'Istanbul', lat: 41.0082, lng: 28.9784 },
  { name: 'London', lat: 51.5074, lng: -0.1278 },
  { name: 'New York', lat: 40.7128, lng: -74.0060 },
  { name: 'Lagos', lat: 6.5244, lng: 3.3792 },
  { name: 'Jakarta', lat: -6.2088, lng: 106.8456 },
  { name: 'Karachi', lat: 24.8607, lng: 67.0011 },
  { name: 'Kuala Lumpur', lat: 3.1390, lng: 101.6869 },
]

export function PrayerPage() {
  const { user } = useAuth()
  const { getStatus, togglePrayer, prayedCount, date } = usePrayerLog(user?.id)
  const { isCompleted, toggle, completedCount } = useVoluntaryPrayers()
  const { status: geoStatus, error: geoError, requestLocation, hasCoords } = useGeolocation()

  const [method, setMethod] = useState<CalculationMethodKey>(getSavedCalculationMethod)
  // Bump to force recompute after geolocation changes
  const [coordsVersion, setCoordsVersion] = useState(0)
  // Manual location input state
  const [showManualInput, setShowManualInput] = useState(false)
  const [manualLat, setManualLat] = useState('')
  const [manualLng, setManualLng] = useState('')
  const [manualError, setManualError] = useState<string | null>(null)

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

  const handleManualLocationSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault()
    setManualError(null)
    const lat = parseFloat(manualLat)
    const lng = parseFloat(manualLng)
    if (isNaN(lat) || isNaN(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      setManualError('Invalid coordinates. Latitude: -90 to 90, Longitude: -180 to 180')
      return
    }
    saveCoordinates(lat, lng)
    setCoordsVersion((v) => v + 1)
    setShowManualInput(false)
  }, [manualLat, manualLng])

  const handleCitySelect = useCallback((lat: number, lng: number) => {
    saveCoordinates(lat, lng)
    setManualLat(lat.toString())
    setManualLng(lng.toString())
    setCoordsVersion((v) => v + 1)
    setShowManualInput(false)
  }, [])

  const handleClearLocation = useCallback(() => {
    clearSavedCoordinates()
    setCoordsVersion((v) => v + 1)
    setManualLat('')
    setManualLng('')
  }, [])

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
          <div className="flex items-center gap-2">
            {(geoStatus === 'denied' || geoStatus === 'idle' || geoStatus === 'unavailable') && (
              <>
                <button
                  onClick={requestLocation}
                  className="text-xs text-primary font-medium hover:underline"
                >
                  {geoStatus === 'denied' ? 'Retry' : 'Detect'}
                </button>
                <span className="text-xs text-muted-foreground">|</span>
                <button
                  onClick={() => setShowManualInput(!showManualInput)}
                  className="text-xs text-primary font-medium hover:underline"
                >
                  Manual
                </button>
              </>
            )}
            {hasCoords && (
              <button
                onClick={handleClearLocation}
                className="text-xs text-muted-foreground hover:text-foreground"
              >
                Reset
              </button>
            )}
          </div>
        </div>
        
        {/* Manual location input */}
        {showManualInput && (
          <form onSubmit={handleManualLocationSubmit} className="space-y-2 pt-2 border-t border-border">
            <p className="text-xs font-medium text-foreground">Enter coordinates or select a city:</p>
            <div className="flex gap-2">
              <input
                type="number"
                step="any"
                placeholder="Latitude"
                value={manualLat}
                onChange={(e) => setManualLat(e.target.value)}
                className="flex-1 text-sm rounded-md border border-border bg-background px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <input
                type="number"
                step="any"
                placeholder="Longitude"
                value={manualLng}
                onChange={(e) => setManualLng(e.target.value)}
                className="flex-1 text-sm rounded-md border border-border bg-background px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <button
                type="submit"
                className="px-3 py-1.5 bg-primary text-primary-foreground text-sm rounded-md hover:opacity-90"
              >
                Set
              </button>
            </div>
            {manualError && <p className="text-xs text-red-500">{manualError}</p>}
            <div className="flex flex-wrap gap-1 pt-1">
              {COMMON_CITIES.map((city) => (
                <button
                  key={city.name}
                  type="button"
                  onClick={() => handleCitySelect(city.lat, city.lng)}
                  className="text-xs px-2 py-1 rounded bg-muted hover:bg-muted/70 transition-colors"
                >
                  {city.name}
                </button>
              ))}
            </div>
          </form>
        )}
        
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
