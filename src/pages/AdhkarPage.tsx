import { ArabicText } from '@/components/ArabicText'

const categories = [
  { id: 'morning', label: 'Morning', labelAr: 'أذكار الصباح' },
  { id: 'evening', label: 'Evening', labelAr: 'أذكار المساء' },
  { id: 'after_prayer', label: 'After Prayer', labelAr: 'أذكار بعد الصلاة' },
  { id: 'before_sleep', label: 'Before Sleep', labelAr: 'أذكار النوم' },
  { id: 'anxiety', label: 'Anxiety & Stress', labelAr: 'أذكار القلق' },
] as const

export function AdhkarPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Adhkar</h1>
      <p className="text-muted-foreground">Daily remembrance from Hisn al-Muslim</p>

      <div className="space-y-3">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className={`rounded-xl p-4 transition-colors cursor-pointer ${
              cat.id === 'anxiety'
                ? 'bg-calm-bg hover:bg-calm-accent/20'
                : 'bg-muted hover:bg-muted/80'
            }`}
          >
            <p className="font-semibold text-foreground">{cat.label}</p>
            <ArabicText className="text-lg text-muted-foreground">{cat.labelAr}</ArabicText>
          </div>
        ))}
      </div>
    </div>
  )
}
