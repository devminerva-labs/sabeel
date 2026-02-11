export type ProgressStatus = 'not_started' | 'in_progress' | 'completed'

export type AdhkarCategory =
  | 'morning'
  | 'evening'
  | 'after_prayer'
  | 'before_sleep'
  | 'anxiety'

// Per-dhikr counter counts: { "morning-01": 3, "morning-02": 1 }
export type AdhkarCounts = Record<string, number>

export interface CatchUpResult {
  targetJuzToday: number
  remainingJuz: number
  remainingDays: number
  isOnTrack: boolean
  message: string
}
