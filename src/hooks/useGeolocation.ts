import { useState, useCallback } from 'react'
import { saveCoordinates, getSavedCoordinates, clearSavedCoordinates } from '@/lib/prayer-times'

type GeoStatus = 'idle' | 'requesting' | 'granted' | 'denied' | 'unavailable'

export function useGeolocation() {
  const [status, setStatus] = useState<GeoStatus>(() =>
    getSavedCoordinates() ? 'granted' : 'idle'
  )
  const [error, setError] = useState<string | null>(null)
  const [hasCoords, setHasCoords] = useState(() => getSavedCoordinates() !== null)

  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setStatus('unavailable')
      setError('Geolocation is not supported by your browser')
      return
    }

    setStatus('requesting')
    setError(null)

    navigator.geolocation.getCurrentPosition(
      (position) => {
        saveCoordinates(position.coords.latitude, position.coords.longitude)
        setStatus('granted')
        setHasCoords(true)
        setError(null)
      },
      (err) => {
        setStatus('denied')
        setError(
          err.code === err.PERMISSION_DENIED
            ? 'Location permission denied'
            : 'Could not determine your location'
        )
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 600000 }
    )
  }, [])

  const clearLocation = useCallback(() => {
    clearSavedCoordinates()
    setHasCoords(false)
    setStatus('idle')
    setError(null)
  }, [])

  return { status, error, requestLocation, clearLocation, hasCoords } as const
}
