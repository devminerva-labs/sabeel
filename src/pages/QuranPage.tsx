import { useState, useCallback, useRef } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { QuranReader } from '@/components/QuranReader'
import { SurahList } from '@/components/SurahList'
import { ProgressRing } from '@/components/ProgressRing'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { useQuranProgress } from '@/hooks/useQuranProgress'
import { useSurahProgress } from '@/hooks/useSurahProgress'
import { useRamadanContext } from '@/hooks/useRamadanContext'
import { calculateCatchUp } from '@/lib/catch-up'
import { juzId, surahId, type JuzId } from '@/types'
import { JUZ_DATA } from '@/content/juz-data'
import { getJuzCached } from '@/lib/api/quran.api'

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

export function QuranPage() {
  const { ramadanYear, dayNumber, season } = useRamadanContext()
  const [selectedJuz, setSelectedJuz] = useState<number | null>(null)
  const [targetSurah, setTargetSurah] = useState<number | undefined>(undefined)
  const [view, setView] = useState<QuranView>('juz')
  const [autoTrackMsg, setAutoTrackMsg] = useState<string | null>(null)

  // We need a stable RamadanYear for the hook — use 0 as placeholder when outside Ramadan
  // The hook will just return empty data for a non-existent year
  const safeYear = (ramadanYear ?? 0) as import('@/types').RamadanYear
  const progress = useQuranProgress(safeYear)
  const surahProg = useSurahProgress(safeYear)

  const openJuz = (juz: number, surah?: number) => {
    setSelectedJuz(juz)
    setTargetSurah(surah)
    setAutoTrackMsg(null)
  }

  // Auto-tracking callbacks for the reader
  const handleStartReading = useCallback(() => {
    if (!ramadanYear || selectedJuz === null) return
    const id = juzId(selectedJuz)
    const current = progress.getStatus(id)
    if (current === 'not_started') {
      progress.setStatusIf(id, 'not_started', 'in_progress')
      setAutoTrackMsg(`Juz ${selectedJuz} marked as in progress`)
      setTimeout(() => setAutoTrackMsg(null), 3000)
    }
  }, [ramadanYear, progress, selectedJuz])

  const handleFinishReading = useCallback(() => {
    if (!ramadanYear || selectedJuz === null) return
    const id = juzId(selectedJuz)
    const current = progress.getStatus(id)
    if (current === 'in_progress') {
      progress.setStatusIf(id, 'in_progress', 'completed')
      setAutoTrackMsg(`Juz ${selectedJuz} marked as completed!`)
      setTimeout(() => setAutoTrackMsg(null), 4000)
    }
  }, [ramadanYear, progress, selectedJuz])

  const handleSurahRead = useCallback((surahNumber: number) => {
    if (!ramadanYear) return
    const id = surahId(surahNumber)
    const current = surahProg.getStatus(id)
    if (current !== 'completed') {
      surahProg.setStatusIf(id, current, 'completed')
    }
  }, [ramadanYear, surahProg])

  if (selectedJuz !== null) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => { setSelectedJuz(null); setTargetSurah(undefined) }}
            className="text-sm text-primary font-medium hover:underline"
          >
            ← Back
          </button>
          <h1 className="text-xl font-semibold">
            Juz {selectedJuz}
            <span className="text-sm font-normal text-muted-foreground ml-2">
              {JUZ_DATA.find((j) => j.id === selectedJuz)?.name}
            </span>
          </h1>
        </div>

        {/* Auto-track notification */}
        {autoTrackMsg && (
          <div className="rounded-lg bg-primary/10 border border-primary/20 px-4 py-2 text-sm font-medium text-primary text-center animate-in fade-in slide-in-from-top-2 duration-300">
            {autoTrackMsg}
          </div>
        )}

        <ErrorBoundary level="component" fallback={<p className="text-center text-muted-foreground">Reader failed to load.</p>}>
          <QuranReader
            juzNumber={selectedJuz}
            targetSurah={targetSurah}
            onStartReading={handleStartReading}
            onFinishReading={handleFinishReading}
            onSurahRead={handleSurahRead}
          />
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
        <ViewToggle view={view} onChange={setView} />
        {view === 'juz' ? (
          <>
            <p className="text-sm text-muted-foreground text-center">Ramadan has not started yet. Tap a Juz to read.</p>
            <JuzGridReadOnly onSelect={setSelectedJuz} />
          </>
        ) : (
          <SurahList onSelectSurah={(juz, surah) => openJuz(juz, surah)} />
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
      view={view}
      onViewChange={setView}
      surahProgress={surahProg}
    />
  )
}

function QuranGridView({
  ramadanYear,
  dayNumber,
  totalDays,
  onSelectJuz,
  view,
  onViewChange,
  surahProgress,
}: {
  ramadanYear: import('@/types').RamadanYear
  dayNumber: number | null
  totalDays: 29 | 30
  onSelectJuz: (juz: number, surah?: number) => void
  view: QuranView
  onViewChange: (v: QuranView) => void
  surahProgress: ReturnType<typeof useSurahProgress>
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
          onSelectSurah={(juz, surah) => onSelectJuz(juz, surah)}
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
