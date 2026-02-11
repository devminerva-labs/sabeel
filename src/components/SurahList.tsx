import { useState, useMemo } from 'react'
import { ArabicText } from '@/components/ArabicText'
import { SURAH_DATA } from '@/content/surah-data'

interface SurahListProps {
  onSelectSurah: (juzNumber: number, surahId: number) => void
}

export function SurahList({ onSelectSurah }: SurahListProps) {
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

  return (
    <div className="space-y-3">
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
        {filtered.map((surah) => (
          <button
            key={surah.id}
            onClick={() => onSelectSurah(surah.juzStart, surah.id)}
            className="w-full flex items-center gap-3 px-4 py-3 text-left bg-background hover:bg-muted/50 active:bg-muted transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label={`${surah.englishName}, ${surah.verseCount} verses, ${surah.revelationType}`}
          >
            {/* Number badge */}
            <span className="shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center">
              {surah.id}
            </span>

            {/* Names */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{surah.englishName}</p>
              <p className="text-xs text-muted-foreground">
                {surah.transliteration} · {surah.verseCount} verses ·{' '}
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
        ))}
      </div>
    </div>
  )
}
