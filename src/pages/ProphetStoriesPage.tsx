import { useState } from 'react'
import { ArabicText } from '@/components/ArabicText'
import { PROPHET_STORIES, type ProphetStory } from '@/content/prophets-data'
import { MENK_PROPHEY_VIDEOS, type VideoContent } from '@/content/prophets-videos'

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
                {(() => {
                  const videos = MENK_PROPHEY_VIDEOS[story.id]
                  if (!videos || videos.length === 0) return null
                  return (
                    <span className="inline-flex items-center gap-1 text-xs text-primary mt-2">
                      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M8 5v14l11-7z"/>
                      </svg>
                      {videos.length} video{videos.length > 1 ? 's' : ''} available
                    </span>
                  )
                })()}
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
  const videos = MENK_PROPHEY_VIDEOS[story.id] || []
  const [activeTab, setActiveTab] = useState<'story' | 'videos'>('story')

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

      {/* Tabs */}
      {videos.length > 0 && (
        <div className="flex rounded-lg bg-muted p-1 gap-1">
          <button
            onClick={() => setActiveTab('story')}
            className={`flex-1 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
              activeTab === 'story'
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Story
          </button>
          <button
            onClick={() => setActiveTab('videos')}
            className={`flex-1 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
              activeTab === 'videos'
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Videos ({videos.length})
          </button>
        </div>
      )}

      {/* Content */}
      {activeTab === 'story' ? (
        <>
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
        </>
      ) : (
        <VideoList videos={videos} prophetName={story.name} />
      )}

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

function VideoList({ videos, prophetName }: { videos: VideoContent[]; prophetName: string }) {
  if (videos.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>No videos available for {prophetName}.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Watch Mufti Ismail Menk's Stories of the Prophets series on YouTube.
      </p>

      <div className="space-y-3">
        {videos.map((video) => (
          <a
            key={video.episode}
            href={video.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 rounded-xl border border-border bg-background p-4 hover:bg-muted/40 transition-colors group"
          >
            {/* Play Button */}
            <div className="shrink-0 w-12 h-12 rounded-full bg-red-600 text-white flex items-center justify-center group-hover:scale-105 transition-transform">
              <svg className="w-5 h-5 ml-0.5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z"/>
              </svg>
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <p className="font-medium text-foreground truncate">
                Episode {video.episode}: {video.topic}
              </p>
              <p className="text-sm text-muted-foreground">
                {video.author} • {video.channel}
              </p>
            </div>

            {/* External Link Icon */}
            <svg 
              className="w-5 h-5 text-muted-foreground shrink-0" 
              fill="none" 
              viewBox="0 0 24 24" 
              strokeWidth={2} 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
            </svg>
          </a>
        ))}
      </div>

      <div className="rounded-lg bg-muted/50 border border-border p-3 text-xs text-muted-foreground">
        <p>
          Videos open on YouTube. For the best experience, consider using YouTube Premium for ad-free viewing and offline downloads.
        </p>
      </div>
    </div>
  )
}
