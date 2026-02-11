import { useState } from 'react'
import { ArabicText } from '@/components/ArabicText'
import { TasbihCounter } from '@/components/TasbihCounter'
import type { Dhikr } from '@/content/adhkar-data'

interface DhikrCardProps {
  dhikr: Dhikr
  count: number
  onIncrement: () => void
  isAnxiety?: boolean
}

export function DhikrCard({ dhikr, count, onIncrement, isAnxiety = false }: DhikrCardProps) {
  const [expanded, setExpanded] = useState(false)
  const isComplete = count >= dhikr.repetitions

  return (
    <div
      className={`rounded-xl border transition-colors ${
        isAnxiety
          ? 'border-calm-accent/30 bg-calm-bg'
          : isComplete
            ? 'border-status-completed/30 bg-status-completed/5'
            : 'border-border bg-background'
      }`}
    >
      {/* Main content */}
      <div className="p-4 space-y-3">
        {/* Arabic text */}
        <ArabicText as="p" className="text-xl leading-[2.2]">
          {dhikr.arabic}
        </ArabicText>

        {/* Counter */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex-1 min-w-0">
            <p className="text-sm text-muted-foreground">{dhikr.transliteration}</p>
          </div>
          <TasbihCounter
            count={count}
            target={dhikr.repetitions}
            onTap={onIncrement}
            isAnxiety={isAnxiety}
          />
        </div>

        {/* Expand toggle */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          {expanded ? 'Show less' : 'Translation & source'}
        </button>
      </div>

      {/* Expanded details */}
      {expanded && (
        <div className={`px-4 pb-4 space-y-2 border-t ${isAnxiety ? 'border-calm-accent/20' : 'border-border'}`}>
          <p className="text-sm text-foreground pt-3">{dhikr.translation}</p>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="font-medium">{dhikr.source.text}</span>
            <span className="px-1.5 py-0.5 rounded bg-muted text-xs">{dhikr.source.grading}</span>
          </div>
          {dhikr.virtue && (
            <p className="text-xs text-muted-foreground italic">{dhikr.virtue}</p>
          )}
        </div>
      )}
    </div>
  )
}
