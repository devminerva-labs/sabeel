import { useState, useMemo } from 'react'
import { ArabicText } from '@/components/ArabicText'
import { SURAH_DATA } from '@/content/surah-data'
import type { ProgressStatus } from '@/types'

interface SurahListProps {
  /** Called when user taps a surah to read it */
  onSelectSurah: (surahId: number) => void
  /** Optional: surah status getter for showing progress indicators */
  getSurahStatus?: (surahId: number) => ProgressStatus
  /** Optional: tap status badge to manually cycle surah progress */
  onCycleSurahStatus?: (surahId: number) => void
}

const STATUS_BADGE: Record<ProgressStatus, { bg: string; label: string }> = {
  not_started: { bg: 'bg-muted text-muted-foreground', label: '' },
  in_progress: { bg: 'bg-status-in-progress text-amber-950', label: 'Reading' },
  completed: { bg: 'bg-status-completed text-green-950', label: 'Read' },
}

export function SurahList({ onSelectSurah, getSurahStatus, onCycleSurahStatus }: SurahListProps) {
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return SURAH_DATA
    const num = parseInt(q, 10)
    return SURAH_DATA.filter(
      (s) =>
        s.englishName.toLowerCase().includes(q) ||
        s.transliteration.toLowerCase().includes(q) ||
        s.arabicName.includes(q) ||
        (!isNaN(num) && s.id === num),
    )
  }, [query])

  const completedCount = getSurahStatus
    ? SURAH_DATA.filter((s) => getSurahStatus(s.id) === 'completed').length
    : 0

  return (
    <div className="space-y-3">
      {/* Progress summary */}
      {getSurahStatus && (
        <div className="text-xs text-muted-foreground text-center">
          {completedCount} of 114 surahs read · Tap badge to track manually
        </div>
      )}

      {/* Search */}
      <div className="relative">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search surah name or number..."
          className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          aria-label="Search surahs"
        />
      </div>

      {/* List */}
      <div className="divide-y divide-border rounded-lg border border-border overflow-hidden">
        {filtered.length === 0 && (
          <p className="px-4 py-6 text-center text-sm text-muted-foreground">No surahs found.</p>
        )}
        {filtered.map((surah) => {
          const status = getSurahStatus?.(surah.id) ?? 'not_started'
          const badge = STATUS_BADGE[status]

          return (
            <div key={surah.id} className="flex items-center bg-background hover:bg-muted/50 transition-colors duration-150">
              {/* Status badge — tap to cycle manually */}
              {onCycleSurahStatus && (
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onCycleSurahStatus(surah.id)
                  }}
                  className={`shrink-0 ml-3 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                    status === 'completed'
                      ? 'border-green-500 bg-green-500 text-white'
                      : status === 'in_progress'
                        ? 'border-amber-500 bg-amber-500/20'
                        : 'border-border bg-transparent'
                  }`}
                  aria-label={`Mark ${surah.englishName} as ${status === 'completed' ? 'not started' : status === 'in_progress' ? 'completed' : 'in progress'}`}
                >
                  {status === 'completed' && (
                    <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                      <path d="M13.78 4.22a.75.75 0 010 1.06l-7.25 7.25a.75.75 0 01-1.06 0L2.22 9.28a.75.75 0 011.06-1.06L6 10.94l6.72-6.72a.75.75 0 011.06 0z" />
                    </svg>
                  )}
                  {status === 'in_progress' && (
                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                  )}
                </button>
              )}

              {/* Main row — tap to open reader */}
              <button
                onClick={() => onSelectSurah(surah.id)}
                onTouchStart={(e) => e.stopPropagation()}
                className="flex-1 flex items-center gap-3 px-4 py-3 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring touch-manipulation"
                aria-label={`${surah.englishName}, ${surah.verseCount} verses, ${badge.label || 'not started'}`}
                style={{ touchAction: 'manipulation' }}
              >
                {/* Number badge */}
                <span className="shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center">
                  {surah.id}
                </span>

                {/* Names */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{surah.transliteration}</p>
                  <p className="text-xs text-muted-foreground">
                    {surah.englishName} · {surah.verseCount} verses ·{' '}
                    <span className={surah.revelationType === 'meccan' ? 'text-amber-600 dark:text-amber-400' : 'text-primary'}>
                      {surah.revelationType === 'meccan' ? 'Meccan' : 'Medinan'}
                    </span>
                  </p>
                </div>

                {/* Arabic name */}
                <ArabicText as="span" className="shrink-0 text-lg text-foreground">
                  {surah.arabicName}
                </ArabicText>
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
