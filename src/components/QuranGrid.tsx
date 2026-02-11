import { useCallback } from 'react'
import { useQuranProgress } from '@/hooks/useQuranProgress'
import { juzId, type JuzId, type RamadanYear, type ProgressStatus } from '@/types'
import { JUZ_DATA } from '@/content/juz-data'

const STATUS_STYLES: Record<ProgressStatus, string> = {
  not_started: 'bg-status-not-started text-foreground/60',
  in_progress: 'bg-status-in-progress text-amber-950',
  completed: 'bg-status-completed text-green-950',
}

const STATUS_LABELS: Record<ProgressStatus, string> = {
  not_started: 'Not started',
  in_progress: 'In progress',
  completed: 'Completed',
}

interface QuranGridProps {
  ramadanYear: RamadanYear
}

export function QuranGrid({ ramadanYear }: QuranGridProps) {
  const { getStatus, cycleStatus } = useQuranProgress(ramadanYear)

  const handleTap = useCallback(
    (id: JuzId) => {
      cycleStatus(id)
    },
    [cycleStatus],
  )

  return (
    <div className="grid grid-cols-5 gap-2" role="grid" aria-label="Quran Juz progress tracker">
      {JUZ_DATA.map((juz) => {
        const id = juzId(juz.id)
        const status = getStatus(id)

        return (
          <button
            key={juz.id}
            onClick={() => handleTap(id)}
            className={`aspect-square rounded-lg flex flex-col items-center justify-center text-sm font-medium transition-colors duration-200 active:scale-95 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 outline-none ${STATUS_STYLES[status]}`}
            role="gridcell"
            aria-label={`Juz ${juz.id}, ${STATUS_LABELS[status]}`}
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
