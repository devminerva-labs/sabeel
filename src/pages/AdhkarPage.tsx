import { useState } from 'react'
import { ArabicText } from '@/components/ArabicText'
import { DhikrCard } from '@/components/DhikrCard'
import { useAdhkarSession } from '@/hooks/useAdhkarSession'
import { CATEGORIES, getAdhkarByCategory } from '@/content/adhkar-data'
import type { AdhkarCategory } from '@/types'

export function AdhkarPage() {
  const [activeCategory, setActiveCategory] = useState<AdhkarCategory | null>(null)

  if (activeCategory) {
    return (
      <CategoryView
        category={activeCategory}
        onBack={() => setActiveCategory(null)}
      />
    )
  }

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Adhkar</h1>
      <p className="text-muted-foreground text-sm">Daily remembrance from Hisn al-Muslim</p>

      <div className="space-y-3">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`w-full rounded-xl p-4 text-start transition-colors ${
              cat.id === 'anxiety'
                ? 'bg-calm-bg hover:bg-calm-accent/20'
                : 'bg-muted hover:bg-muted/80'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">{cat.icon}</span>
              <div>
                <p className="font-semibold text-foreground">{cat.label}</p>
                <ArabicText className="text-base text-muted-foreground">{cat.labelAr}</ArabicText>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

function CategoryView({ category, onBack }: { category: AdhkarCategory; onBack: () => void }) {
  const cat = CATEGORIES.find((c) => c.id === category)!
  const adhkar = getAdhkarByCategory(category)
  const { counts, increment } = useAdhkarSession(category)
  const isAnxiety = category === 'anxiety'

  const totalDone = adhkar.filter((d) => (counts[d.id] ?? 0) >= d.repetitions).length

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          className="p-2 -ms-2 rounded-lg hover:bg-muted transition-colors"
          aria-label="Back to categories"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </button>
        <div className="flex-1">
          <h1 className="text-xl font-semibold">{cat.label}</h1>
          <ArabicText className="text-sm text-muted-foreground">{cat.labelAr}</ArabicText>
        </div>
        <div className="text-sm text-muted-foreground">
          {totalDone}/{adhkar.length}
        </div>
      </div>

      {/* Anxiety note */}
      {isAnxiety && (
        <p className="text-sm text-calm-text italic px-1">
          Take your time. Allah is with the patient.
        </p>
      )}

      {/* Dhikr cards */}
      <div className="space-y-4">
        {adhkar.map((dhikr) => (
          <DhikrCard
            key={dhikr.id}
            dhikr={dhikr}
            count={counts[dhikr.id] ?? 0}
            onIncrement={() => increment(dhikr.id)}
            isAnxiety={isAnxiety}
          />
        ))}
      </div>
    </div>
  )
}
