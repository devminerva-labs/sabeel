import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getPrayerTimes } from '@/lib/prayer-times'
import {
  getLaylahPhase,
  getLaylahNightNumber,
  isOddLaylahNight,
  nightsUntilLastTen,
} from '@/lib/ramadan-dates'

interface Props {
  dayNumber: number
}

const DISMISS_KEY = 'laylah_dismissed'

function isDismissed(): boolean {
  try {
    return localStorage.getItem(DISMISS_KEY) === 'true'
  } catch {
    return false
  }
}

export function LaylatulQadrBanner({ dayNumber }: Props) {
  const [dismissed, setDismissed] = useState(isDismissed)
  const [maghrib, setMaghrib] = useState<Date | undefined>()

  // Fetch today's Maghrib time for accurate night detection
  useEffect(() => {
    try {
      const times = getPrayerTimes(new Date())
      setMaghrib(times.maghrib)
    } catch {
      // Fall back to calendar-only detection
    }
  }, [])

  if (dismissed) return null

  const now = new Date()
  const phase = getLaylahPhase(dayNumber, now, maghrib)

  // Not yet in Ramadan or already ended — show nothing
  if (!phase) return null

  function dismiss() {
    localStorage.setItem(DISMISS_KEY, 'true')
    setDismissed(true)
  }

  if (phase === 'pre') {
    const nights = nightsUntilLastTen(dayNumber, maghrib, now)
    return (
      <div className="relative rounded-xl border border-primary/30 bg-primary/5 p-4 space-y-1">
        <button
          onClick={dismiss}
          aria-label="Dismiss"
          className="absolute top-3 right-3 text-muted-foreground hover:text-foreground transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 16 16">
            <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
        <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">Last 10 Nights</p>
        <p className="text-base font-semibold text-foreground">
          {nights === 1
            ? 'Tomorrow night the last 10 nights begin'
            : `${nights} nights until the Last 10 Nights begin`}
        </p>
        <p className="text-sm text-muted-foreground">
          Prepare your heart. Laylatul Qadr — better than a thousand months.
        </p>
      </div>
    )
  }

  // phase === 'active'
  const nightNumber = getLaylahNightNumber(dayNumber, now, maghrib)
  const isOdd = nightNumber ? isOddLaylahNight(nightNumber) : false
  const is27th = nightNumber === 27

  return (
    <Link
      to="/app/laylah"
      className="block relative rounded-xl border border-primary/40 bg-card p-4 space-y-2 hover:bg-muted/30 transition-colors"
      style={{ background: 'linear-gradient(135deg, #0b0f1f 0%, #141928 100%)' }}
    >
      <button
        onClick={(e) => { e.preventDefault(); dismiss() }}
        aria-label="Dismiss"
        className="absolute top-3 right-3 text-muted-foreground hover:text-foreground transition-colors z-10"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 16 16">
          <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>

      <div className="space-y-1">
        {is27th ? (
          <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: '#c9a84c' }}>
            The Grand Night — 27th of Ramadan
          </p>
        ) : (
          <p className="text-xs font-medium uppercase tracking-wide" style={{ color: '#c9a84c' }}>
            {isOdd ? 'Odd Night — Potential Laylatul Qadr' : 'Last 10 Nights of Ramadan'}
          </p>
        )}

        <p className="text-base font-semibold" style={{ color: '#f0e6c8' }}>
          {nightNumber
            ? `Night ${nightNumber} of Ramadan`
            : `Day ${dayNumber} — Last 10 Nights`}
        </p>

        {isOdd && (
          <p className="text-sm" style={{ color: '#8a8070' }}>
            Stand in prayer tonight. Open Laylatul Qadr guide.
          </p>
        )}
      </div>

      <div className="flex items-center gap-1 pt-1">
        <span className="text-xs font-medium" style={{ color: '#c9a84c' }}>
          Open guide
        </span>
        <svg className="w-3 h-3" fill="none" viewBox="0 0 12 12" style={{ color: '#c9a84c' }}>
          <path d="M2 6h8M6 2l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </Link>
  )
}
