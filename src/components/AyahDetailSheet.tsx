import { useEffect, useRef, useState } from 'react'
import { ArabicText } from '@/components/ArabicText'
import { getAyahDetail, type AyahDetail } from '@/lib/api/tafsir.api'

interface Ayah {
  surah: number
  ayah: number
  arabic: string
  translation: string
}

interface AyahDetailSheetProps {
  ayah: Ayah | null
  surahName?: string
  onClose: () => void
}

function audioUrl(surah: number, ayah: number) {
  const s = String(surah).padStart(3, '0')
  const a = String(ayah).padStart(3, '0')
  return `https://verses.quran.com/Alafasy/mp3/${s}${a}.mp3`
}

function useAyahAudio(surah: number | null, ayah: number | null) {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Stop and reset audio whenever the ayah changes
  useEffect(() => {
    const audio = audioRef.current
    if (audio) {
      audio.pause()
      audio.src = ''
    }
    audioRef.current = null
    setIsPlaying(false)
    setIsLoading(false)
  }, [surah, ayah])

  function toggle() {
    if (surah === null || ayah === null) return

    if (!audioRef.current) {
      const audio = new Audio(audioUrl(surah, ayah))
      audioRef.current = audio

      audio.addEventListener('canplay', () => setIsLoading(false))
      audio.addEventListener('ended', () => setIsPlaying(false))
      audio.addEventListener('pause', () => setIsPlaying(false))
      audio.addEventListener('play', () => setIsPlaying(true))
      audio.addEventListener('error', () => {
        setIsLoading(false)
        setIsPlaying(false)
      })
    }

    const audio = audioRef.current
    if (audio.paused) {
      setIsLoading(audio.readyState < 3) // HAVE_FUTURE_DATA
      audio.play().catch(() => {
        setIsLoading(false)
        setIsPlaying(false)
      })
    } else {
      audio.pause()
    }
  }

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      audioRef.current?.pause()
    }
  }, [])

  return { isPlaying, isLoading, toggle }
}

export function AyahDetailSheet({ ayah, surahName, onClose }: AyahDetailSheetProps) {
  const [detail, setDetail] = useState<AyahDetail | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const { isPlaying, isLoading: audioLoading, toggle } = useAyahAudio(
    ayah?.surah ?? null,
    ayah?.ayah ?? null,
  )

  useEffect(() => {
    if (!ayah) {
      setDetail(null)
      setError(false)
      return
    }
    setLoading(true)
    setError(false)
    setDetail(null)
    getAyahDetail(ayah.surah, ayah.ayah)
      .then(setDetail)
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [ayah?.surah, ayah?.ayah])

  if (!ayah) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 z-40"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Sheet */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`Ayah detail: ${surahName ?? `Surah ${ayah.surah}`} ${ayah.ayah}`}
        className="fixed bottom-0 left-0 right-0 z-50 bg-background rounded-t-2xl shadow-2xl max-h-[85dvh] flex flex-col"
      >
        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-1 shrink-0">
          <div className="w-10 h-1 rounded-full bg-border" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-border shrink-0">
          <div className="flex items-center gap-3">
            {/* Audio play/pause button */}
            <button
              onClick={toggle}
              aria-label={isPlaying ? 'Pause recitation' : 'Play recitation'}
              className="flex items-center justify-center w-9 h-9 rounded-full bg-primary/10 hover:bg-primary/20 text-primary transition-colors disabled:opacity-40"
              disabled={audioLoading}
            >
              {audioLoading ? (
                <span className="w-4 h-4 rounded-full border-2 border-primary border-t-transparent animate-spin block" />
              ) : isPlaying ? (
                <PauseIcon />
              ) : (
                <PlayIcon />
              )}
            </button>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide">
                {surahName ?? `Surah ${ayah.surah}`}
              </p>
              <p className="text-sm font-semibold text-foreground">
                Ayah {ayah.ayah}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close ayah detail"
            className="text-muted-foreground hover:text-foreground transition-colors p-1"
          >
            ✕
          </button>
        </div>

        {/* Scrollable content */}
        <div className="overflow-y-auto px-5 pb-8 pt-4 space-y-5 flex-1">
          {/* Arabic text — large and prominent */}
          <ArabicText as="p" className="text-3xl leading-[2.8] text-right text-foreground">
            {ayah.arabic} ﴿{ayah.ayah}﴾
          </ArabicText>

          {/* Tafsir loading skeleton */}
          {loading && (
            <div className="space-y-2 animate-pulse">
              <div className="h-3 rounded bg-muted w-3/4" />
              <div className="h-3 rounded bg-muted w-1/2" />
            </div>
          )}

          {!loading && detail && (
            <>
              {detail.transliteration && (
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
                    Transliteration
                  </p>
                  <p className="text-sm text-foreground italic leading-relaxed">
                    {detail.transliteration}
                  </p>
                </div>
              )}

              {/* Translation */}
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
                  Translation
                </p>
                <p className="text-sm text-foreground leading-relaxed">
                  {ayah.translation}
                </p>
              </div>

              {/* Tafsir */}
              {detail.tafsir && (
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
                    Tafsir
                  </p>
                  <p className="text-sm text-foreground leading-relaxed">
                    {detail.tafsir}
                  </p>
                </div>
              )}
            </>
          )}

          {error && (
            <p className="text-sm text-muted-foreground">
              Could not load detail. Check your connection.
            </p>
          )}

          {/* Translation always visible as fallback when detail not loaded */}
          {!loading && !detail && !error && (
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
                Translation
              </p>
              <p className="text-sm text-foreground leading-relaxed">
                {ayah.translation}
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

function PlayIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <path d="M3 2.5l10 5.5-10 5.5V2.5z" />
    </svg>
  )
}

function PauseIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <rect x="3" y="2" width="4" height="12" rx="1" />
      <rect x="9" y="2" width="4" height="12" rx="1" />
    </svg>
  )
}
