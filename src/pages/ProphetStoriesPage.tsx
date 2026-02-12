import { useState } from 'react'
import { ArabicText } from '@/components/ArabicText'
import { PROPHET_STORIES, type ProphetStory } from '@/content/prophets-data'

export function ProphetStoriesPage() {
  const [selected, setSelected] = useState<ProphetStory | null>(null)

  if (selected) {
    return <StoryView story={selected} onBack={() => setSelected(null)} />
  }

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <h1 className="text-xl font-semibold">Stories of the Prophets</h1>
        <p className="text-sm text-muted-foreground">قصص الأنبياء — from the Quran and authentic Sunnah</p>
      </div>

      <div className="space-y-3">
        {PROPHET_STORIES.map((story) => (
          <button
            key={story.id}
            onClick={() => setSelected(story)}
            className="w-full rounded-xl border border-border bg-background p-4 text-start hover:bg-muted/40 transition-colors"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="space-y-0.5">
                <p className="font-semibold text-foreground">{story.name} <span className="text-muted-foreground font-normal text-xs">عليه السلام</span></p>
                <ArabicText className="text-base text-muted-foreground">{story.nameAr}</ArabicText>
                <p className="text-sm text-muted-foreground mt-1">{story.title}</p>
              </div>
              <svg className="w-4 h-4 text-muted-foreground shrink-0 mt-1" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

function StoryView({ story, onBack }: { story: ProphetStory; onBack: () => void }) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start gap-3">
        <button
          onClick={onBack}
          className="p-2 -ms-2 rounded-lg hover:bg-muted transition-colors shrink-0 mt-0.5"
          aria-label="Back to stories"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </button>
        <div>
          <ArabicText as="h1" className="text-2xl font-bold">{story.nameAr}</ArabicText>
          <p className="text-base font-semibold text-foreground mt-0.5">{story.title}</p>
          <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{story.summary}</p>
        </div>
      </div>

      {/* Surah references */}
      {story.surahs && story.surahs.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Mentioned in the Quran</p>
          <div className="flex flex-wrap gap-2">
            {story.surahs.map((surah) => (
              <div key={surah.number} className="rounded-lg bg-muted/60 border border-border px-3 py-1.5 space-y-0.5">
                <p className="text-xs font-semibold text-foreground">{surah.name} ({surah.number})</p>
                <p className="text-xs text-muted-foreground">{surah.note}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sections */}
      <div className="space-y-6">
        {story.sections.map((section, i) => (
          <div key={i} className="space-y-3">
            <h2 className="text-sm font-semibold text-foreground uppercase tracking-wide">{section.heading}</h2>
            <p className="text-sm text-foreground leading-relaxed">{section.body}</p>

            {section.arabic && (
              <div className="rounded-lg bg-muted/50 border border-border px-4 py-3 space-y-1">
                <ArabicText as="p" className="text-xl text-right text-foreground leading-[2.4]">
                  {section.arabic}
                </ArabicText>
                {section.source && (
                  <p className="text-xs text-muted-foreground">{section.source}</p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Ramadan lesson */}
      <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 space-y-2">
        <p className="text-xs font-semibold text-primary uppercase tracking-wide">Lesson for Ramadan</p>
        <p className="text-sm text-foreground leading-relaxed">{story.ramadanLesson}</p>
      </div>

      {/* Back link */}
      <button
        onClick={onBack}
        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        Back to all stories
      </button>
    </div>
  )
}
