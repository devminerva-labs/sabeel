import type { PrayerStatus } from '@/types'
import type { PrayerInfo } from '@/content/prayer-data'

interface PrayerCardProps {
  prayer: PrayerInfo
  time: string
  status: PrayerStatus | null
  onToggle: () => void
}

const STATUS_STYLES: Record<string, string> = {
  prayed: 'bg-green-500/15 border-green-500/30 text-green-700 dark:text-green-400',
  missed: 'bg-red-500/15 border-red-500/30 text-red-700 dark:text-red-400',
  default: 'bg-background border-border text-foreground',
}

const STATUS_ICONS: Record<string, string> = {
  prayed: '✓',
  missed: '✗',
  default: '○',
}

export function PrayerCard({ prayer, time, status, onToggle }: PrayerCardProps) {
  const style = status ? STATUS_STYLES[status] : STATUS_STYLES.default
  const icon = status ? STATUS_ICONS[status] : STATUS_ICONS.default

  return (
    <button
      onClick={onToggle}
      className={`w-full rounded-xl border p-4 flex items-center justify-between transition-colors active:scale-[0.98] ${style}`}
    >
      <div className="flex items-center gap-3">
        <span className="text-2xl font-bold w-8 text-center">{icon}</span>
        <div className="text-left">
          <p className="font-semibold">{prayer.english}</p>
          <p className="text-sm opacity-70 font-arabic">{prayer.arabic}</p>
        </div>
      </div>
      <span className="text-sm font-medium opacity-70">{time}</span>
    </button>
  )
}
