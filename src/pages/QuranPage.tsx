import { useState, useCallback, useRef, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { QuranReader } from '@/components/QuranReader'
import { SurahList } from '@/components/SurahList'
import { ProgressRing } from '@/components/ProgressRing'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { OfflineIndicator } from '@/components/OfflineIndicator'
import { useQuranProgress } from '@/hooks/useQuranProgress'
import { useSurahProgress } from '@/hooks/useSurahProgress'
import { useLastReadingBookmark } from '@/hooks/useLastReadingBookmark'
import { useRamadanContext } from '@/hooks/useRamadanContext'
import { useAuth } from '@/hooks/useAuth'
import { calculateCatchUp } from '@/lib/catch-up'
import { juzId, surahId, type JuzId } from '@/types'
import { JUZ_DATA } from '@/content/juz-data'
import { SURAH_DATA } from '@/content/surah-data'
import { getJuzCached, precacheAllJuz } from '@/lib/api/quran.api'

type QuranView = 'juz' | 'surah'

function ViewToggle({ view, onChange }: { view: QuranView; onChange: (v: QuranView) => void }) {
  return (
    <div className="flex rounded-lg bg-muted p-1 gap-1" role="tablist" aria-label="Quran view">
      {(['juz', 'surah'] as const).map((v) => (
        <button
          key={v}
          role="tab"
          aria-selected={view === v}
          onClick={() => onChange(v)}
          className={`flex-1 rounded-md px-3 py-1.5 text-sm font-medium transition-colors duration-150 ${
            view === v
              ? 'bg-background text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          {v === 'juz' ? 'By Juz' : 'By Surah'}
        </button>
      ))}
    </div>
  )
}

// Reader mode types
type ReaderMode =
  | { type: 'juz'; juzNumber: number; targetSurah?: number }
  | { type: 'surah'; surahNumber: number }

export function QuranPage() {
  const { ramadanYear, dayNumber, season } = useRamadanContext()
  const [readerMode, setReaderMode] = useState<ReaderMode | null>(null)
  const [view, setView] = useState<QuranView>('juz')
  const [autoTrackMsg, setAutoTrackMsg] = useState<string | null>(null)
  const [downloadingJuz, setDownloadingJuz] = useState(false)
  const [downloadProgress, setDownloadProgress] = useState(0)

  const lastBookmark = useLastReadingBookmark()
  const location = useLocation()

  const { user } = useAuth()
  // We need a stable RamadanYear for the hook — use 0 as placeholder when outside Ramadan
  // The hook will just return empty data for a non-existent year
  const safeYear = (ramadanYear ?? 0) as import('@/types').RamadanYear
  const progress = useQuranProgress(safeYear, user?.id)
  const surahProg = useSurahProgress(safeYear, user?.id)

  // Open Juz mode
  const openJuz = (juz: number, targetSurah?: number) => {
    setReaderMode({ type: 'juz', juzNumber: juz, targetSurah })
    setAutoTrackMsg(null)
  }

  // Open Surah mode (NEW)
  const openSurah = (surahNumber: number) => {
    setReaderMode({ type: 'surah', surahNumber })
    setAutoTrackMsg(null)
  }

  useEffect(() => {
    const resumeJuz = (location.state as { resumeJuz?: number } | null)?.resumeJuz
    if (resumeJuz) {
      openJuz(resumeJuz)
    }
  }, []) // only on mount

  // Scroll to top when entering reader mode
  useEffect(() => {
    if (readerMode) {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }, [readerMode])

  // Get current reader info for tracking
  const currentJuzNumber = readerMode?.type === 'juz' ? readerMode.juzNumber : null
  // const currentSurahNumber = readerMode?.type === 'surah' ? readerMode.surahNumber : null

  // Auto-tracking callbacks for the reader (only for Juz mode)
  const handleStartReading = useCallback(() => {
    if (!ramadanYear || currentJuzNumber === null) return
    const id = juzId(currentJuzNumber)
    const current = progress.getStatus(id)
    if (current === 'not_started') {
      progress.setStatusIf(id, 'not_started', 'in_progress')
      setAutoTrackMsg(`Juz ${currentJuzNumber} marked as in progress`)
      setTimeout(() => setAutoTrackMsg(null), 3000)
    }
  }, [ramadanYear, progress, currentJuzNumber])

  const handleFinishReading = useCallback(() => {
    if (!ramadanYear || currentJuzNumber === null) return
    const id = juzId(currentJuzNumber)
    const current = progress.getStatus(id)
    if (current === 'in_progress') {
      progress.setStatusIf(id, 'in_progress', 'completed')
      setAutoTrackMsg(`Juz ${currentJuzNumber} marked as completed!`)
      setTimeout(() => setAutoTrackMsg(null), 4000)
    }
  }, [ramadanYear, progress, currentJuzNumber])

  const handleSurahRead = useCallback((surahNumber: number) => {
    if (!ramadanYear) return
    const id = surahId(surahNumber)
    const current = surahProg.getStatus(id)
    if (current !== 'completed') {
      surahProg.setStatusIf(id, current, 'completed')
    }
  }, [ramadanYear, surahProg])

  const handleDownloadForOffline = useCallback(async () => {
    setDownloadingJuz(true)
    setDownloadProgress(0)
    try {
      await precacheAllJuz((current, total) => {
        setDownloadProgress(Math.round((current / total) * 100))
      })
    } catch (err) {
      console.error('Failed to download:', err)
    } finally {
      setDownloadingJuz(false)
    }
  }, [])

  // Render reader mode (either Juz or Surah)
  if (readerMode) {
    const isJuzMode = readerMode.type === 'juz'
    const title = isJuzMode 
      ? `Juz ${readerMode.juzNumber}`
      : SURAH_DATA.find(s => s.id === readerMode.surahNumber)?.englishName ?? `Surah ${readerMode.surahNumber}`
    const subtitle = isJuzMode
      ? JUZ_DATA.find((j) => j.id === readerMode.juzNumber)?.name
      : `${SURAH_DATA.find(s => s.id === readerMode.surahNumber)?.verseCount ?? ''} verses`

    return (
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setReaderMode(null)}
            className="text-sm text-primary font-medium hover:underline"
          >
            ← Back
          </button>
          <h1 className="text-xl font-semibold">
            {title}
            <span className="text-sm font-normal text-muted-foreground ml-2">
              {subtitle}
            </span>
          </h1>
        </div>

        {/* Auto-track notification (only for Juz mode) */}
        {autoTrackMsg && isJuzMode && (
          <div className="rounded-lg bg-primary/10 border border-primary/20 px-4 py-2 text-sm font-medium text-primary text-center animate-in fade-in slide-in-from-top-2 duration-300">
            {autoTrackMsg}
          </div>
        )}

        {/* Offline indicator */}
        <OfflineIndicator />

        {/* Download for offline (only for Juz mode) */}
        {isJuzMode && (
          !downloadingJuz ? (
            <button
              onClick={handleDownloadForOffline}
              className="w-full rounded-lg border border-border p-3 text-sm text-muted-foreground hover:bg-muted/50 transition-colors flex items-center justify-center gap-2"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M8 1a.5.5 0 0 1 .5.5v10.793l3.146-3.147a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 .708-.708L7.5 12.293V1.5A.5.5 0 0 1 8 1z"/>
                <path d="M1.5 14.5a.5.5 0 0 1 .5-.5h12a.5.5 0 0 1 0 1h-12a.5.5 0 0 1-.5-.5z"/>
              </svg>
              Download for offline reading
            </button>
          ) : (
            <div className="w-full rounded-lg border border-border p-3 text-sm text-muted-foreground">
              <div className="flex items-center justify-between mb-1">
                <span>Downloading Quran...</span>
                <span>{downloadProgress}%</span>
              </div>
              <div className="h-1 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary transition-all duration-300" 
                  style={{ width: `${downloadProgress}%` }}
                />
              </div>
            </div>
          )
        )}

        <ErrorBoundary level="component" fallback={<p className="text-center text-muted-foreground">Reader failed to load.</p>}>
          {isJuzMode ? (
            <QuranReader
              mode="juz"
              juzNumber={readerMode.juzNumber}
              targetSurah={readerMode.targetSurah}
              onStartReading={handleStartReading}
              onFinishReading={handleFinishReading}
              onSurahRead={handleSurahRead}
            />
          ) : (
            <QuranReader
              mode="surah"
              surahNumber={readerMode.surahNumber}
              onSurahRead={handleSurahRead}
            />
          )}
        </ErrorBoundary>
      </div>
    )
  }

  if (!ramadanYear || !season) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold">Quran</h1>
        </div>
        <ContinueReadingCard bookmark={lastBookmark} onResume={openJuz} />
        <ViewToggle view={view} onChange={setView} />
        {view === 'juz' ? (
          <>
            <p className="text-sm text-muted-foreground text-center">Ramadan has not started yet. Tap a Juz to read.</p>
            <JuzGridReadOnly onSelect={openJuz} />
          </>
        ) : (
          <SurahList onSelectSurah={openSurah} />
        )}
      </div>
    )
  }

  return (
    <QuranGridView
      ramadanYear={ramadanYear}
      dayNumber={dayNumber}
      totalDays={season.days}
      onSelectJuz={openJuz}
      onSelectSurah={openSurah}
      view={view}
      onViewChange={setView}
      surahProgress={surahProg}
      lastBookmark={lastBookmark}
    />
  )
}

function QuranGridView({
  ramadanYear,
  dayNumber,
  totalDays,
  onSelectJuz,
  onSelectSurah,
  view,
  onViewChange,
  surahProgress,
  lastBookmark,
}: {
  ramadanYear: import('@/types').RamadanYear
  dayNumber: number | null
  totalDays: 29 | 30
  onSelectJuz: (juz: number, surah?: number) => void
  onSelectSurah: (surah: number) => void
  view: QuranView
  onViewChange: (v: QuranView) => void
  surahProgress: ReturnType<typeof useSurahProgress>
  lastBookmark: import('@/lib/db').ReadingBookmarkRecord | undefined
}) {
  const { completedCount, totalJuz } = useQuranProgress(ramadanYear)
  const catchUp = dayNumber ? calculateCatchUp(completedCount, dayNumber, totalDays) : null

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Quran</h1>
          {dayNumber && (
            <p className="text-sm text-muted-foreground">Day {dayNumber} of Ramadan</p>
          )}
        </div>
        <ProgressRing completed={completedCount} total={totalJuz} size={72} strokeWidth={6} />
      </div>

      <ContinueReadingCard bookmark={lastBookmark} onResume={onSelectJuz} />
      <ViewToggle view={view} onChange={onViewChange} />

      {catchUp && view === 'juz' && (
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

      {view === 'juz' ? (
        <>
          <p className="text-xs text-muted-foreground text-center">
            Tap to cycle status · Hold to read
          </p>
          <ErrorBoundary level="component" fallback={<p className="text-center text-muted-foreground">Grid failed to load.</p>}>
            <QuranGridWithReader ramadanYear={ramadanYear} onSelectJuz={onSelectJuz} />
          </ErrorBoundary>
        </>
      ) : (
        <SurahList
          onSelectSurah={onSelectSurah}
          getSurahStatus={(id) => surahProgress.getStatus(surahId(id))}
          onCycleSurahStatus={(id) => surahProgress.cycleStatus(surahId(id))}
        />
      )}
    </div>
  )
}

function QuranGridWithReader({
  ramadanYear,
  onSelectJuz,
}: {
  ramadanYear: import('@/types').RamadanYear
  onSelectJuz: (juz: number) => void
}) {
  const { getStatus, cycleStatus } = useQuranProgress(ramadanYear)
  const queryClient = useQueryClient()
  const prefetchTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)
  const longPressTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)
  const didLongPress = useRef(false)

  const handleTap = useCallback(
    (id: JuzId) => {
      cycleStatus(id)
    },
    [cycleStatus],
  )

  const handlePrefetch = useCallback(
    (juzNumber: number) => {
      if (prefetchTimeout.current) clearTimeout(prefetchTimeout.current)
      prefetchTimeout.current = setTimeout(() => {
        queryClient.prefetchQuery({
          queryKey: ['quran-juz', juzNumber],
          queryFn: () => getJuzCached(juzNumber),
          staleTime: Infinity,
        })
      }, 300)
    },
    [queryClient],
  )

  const handlePrefetchCancel = useCallback(() => {
    if (prefetchTimeout.current) clearTimeout(prefetchTimeout.current)
  }, [])

  const startLongPress = useCallback(
    (juzId: number) => {
      didLongPress.current = false
      longPressTimeout.current = setTimeout(() => {
        didLongPress.current = true
        onSelectJuz(juzId)
      }, 500)
    },
    [onSelectJuz],
  )

  const cancelLongPress = useCallback(() => {
    if (longPressTimeout.current) clearTimeout(longPressTimeout.current)
  }, [])

  return (
    <div className="grid grid-cols-5 gap-2" role="grid" aria-label="Quran Juz tracker with reader">
      {JUZ_DATA.map((juz) => {
        const id = juzId(juz.id)
        const status = getStatus(id)
        const statusStyles: Record<string, string> = {
          not_started: 'bg-status-not-started text-foreground/60',
          in_progress: 'bg-status-in-progress text-amber-950',
          completed: 'bg-status-completed text-green-950',
        }

        return (
          <button
            key={juz.id}
            onClick={() => { if (!didLongPress.current) handleTap(id) }}
            onPointerDown={() => { startLongPress(juz.id); handlePrefetch(juz.id) }}
            onPointerUp={cancelLongPress}
            onPointerLeave={() => { cancelLongPress(); handlePrefetchCancel() }}
            onFocus={() => handlePrefetch(juz.id)}
            onBlur={handlePrefetchCancel}
            className={`aspect-square rounded-lg flex flex-col items-center justify-center text-sm font-medium transition-colors duration-200 active:scale-95 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 outline-none select-none ${statusStyles[status]}`}
            role="gridcell"
            aria-label={`Juz ${juz.id}, ${status}. Hold to read.`}
          >
            <span className="text-base font-bold">{juz.id}</span>
            <span className="text-[10px] leading-tight opacity-70 truncate max-w-full px-1">
              {juz.startSurah}
            </span>
          </button>
        )
      })}
    </div>
  )
}

function ContinueReadingCard({
  bookmark,
  onResume,
}: {
  bookmark: import('@/lib/db').ReadingBookmarkRecord | undefined
  onResume: (juz: number) => void
}) {
  if (!bookmark) return null
  const juz = JUZ_DATA.find((j) => j.id === bookmark.juzNumber)
  return (
    <button
      onClick={() => onResume(bookmark.juzNumber)}
      className="w-full rounded-xl border border-primary/20 bg-primary/5 p-4 text-left hover:bg-primary/10 transition-colors"
    >
      <p className="text-xs text-muted-foreground uppercase tracking-wide">Continue Reading</p>
      <p className="text-base font-semibold text-foreground mt-0.5">
        Juz {bookmark.juzNumber}
        {juz && (
          <span className="text-sm font-normal text-muted-foreground ml-2">{juz.name}</span>
        )}
      </p>
      <p className="text-xs text-muted-foreground mt-0.5">
        Page {bookmark.page + 1} · {juz?.startSurah}
      </p>
    </button>
  )
}

function JuzGridReadOnly({ onSelect }: { onSelect: (juz: number) => void }) {
  return (
    <div className="grid grid-cols-5 gap-2 mt-4" role="grid" aria-label="Quran Juz selector">
      {JUZ_DATA.map((juz) => (
        <button
          key={juz.id}
          onClick={() => onSelect(juz.id)}
          className="aspect-square rounded-lg flex flex-col items-center justify-center text-sm font-medium bg-status-not-started text-foreground/60 transition-colors duration-200 active:scale-95 focus-visible:ring-2 focus-visible:ring-ring outline-none"
          role="gridcell"
          aria-label={`Read Juz ${juz.id}`}
        >
          <span className="text-base font-bold">{juz.id}</span>
          <span className="text-[10px] leading-tight opacity-70 truncate max-w-full px-1">
            {juz.startSurah}
          </span>
        </button>
      ))}
    </div>
  )
}
