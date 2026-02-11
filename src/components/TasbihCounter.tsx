import { useCallback } from 'react'

interface TasbihCounterProps {
  count: number
  target: number
  onTap: () => void
  isAnxiety?: boolean
}

export function TasbihCounter({ count, target, onTap, isAnxiety = false }: TasbihCounterProps) {
  const isComplete = count >= target
  const progress = Math.min(count / target, 1)
  const circumference = 2 * Math.PI * 54 // radius = 54

  const handleTap = useCallback(() => {
    // Haptic feedback (Android only, best-effort)
    if (navigator.vibrate) {
      if (count + 1 >= target && !isComplete) {
        navigator.vibrate([30, 60, 30, 60, 100]) // completion pattern
      } else {
        navigator.vibrate(20)
      }
    }
    onTap()
  }, [onTap, count, target, isComplete])

  return (
    <button
      onClick={handleTap}
      className={`relative w-32 h-32 rounded-full flex items-center justify-center transition-transform active:scale-95 touch-manipulation ${
        isAnxiety
          ? isComplete
            ? 'bg-calm-accent/20'
            : 'bg-calm-bg'
          : isComplete
            ? 'bg-status-completed/20'
            : 'bg-muted'
      }`}
      aria-label={`Counter: ${count} of ${target}. Tap to increment.`}
    >
      {/* Progress ring */}
      <svg width="128" height="128" className="absolute inset-0 -rotate-90">
        <circle
          cx="64"
          cy="64"
          r="54"
          fill="none"
          strokeWidth="5"
          stroke="currentColor"
          className="text-border"
        />
        <circle
          cx="64"
          cy="64"
          r="54"
          fill="none"
          strokeWidth="5"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - progress)}
          strokeLinecap="round"
          stroke="currentColor"
          className={`transition-[stroke-dashoffset] duration-200 ${
            isAnxiety ? 'text-calm-accent' : 'text-status-completed'
          }`}
        />
      </svg>

      {/* Count display */}
      <div className="text-center z-10">
        <span className="text-2xl font-bold text-foreground">{count}</span>
        {!isAnxiety && (
          <span className="text-sm text-muted-foreground">/{target}</span>
        )}
      </div>
    </button>
  )
}
