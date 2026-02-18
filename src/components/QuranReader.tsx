import { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import { useQuranReader } from '@/hooks/useQuranReader'
import { AyahDetailSheet } from '@/components/AyahDetailSheet'

function ayahAudioUrl(surah: number, ayah: number): string {
  const s = String(surah).padStart(3, '0')
  const a = String(ayah).padStart(3, '0')
  return `https://verses.quran.com/Alafasy/mp3/${s}${a}.mp3`
}

function useSurahAudio() {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const queueRef = useRef<{ surah: number; ayah: number }[]>([])
  const indexRef = useRef(0)
  const [playingSurah, setPlayingSurah] = useState<number | null>(null)
  const [currentAyah, setCurrentAyah] = useState(0)
  const [isLoading, setIsLoading] = useState(false)

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.src = ''
    }
    queueRef.current = []
    indexRef.current = 0
    setPlayingSurah(null)
    setCurrentAyah(0)
    setIsLoading(false)
  }, [])

  const playNext = useCallback(() => {
    const queue = queueRef.current
    const idx = indexRef.current

    const verse = queue[idx]
    if (!verse) {
      stop()
      return
    }

    setCurrentAyah(verse.ayah)

    if (!audioRef.current) {
      audioRef.current = new Audio()
    }

    const audio = audioRef.current
    audio.src = ayahAudioUrl(verse.surah, verse.ayah)
    setIsLoading(true)

    audio.oncanplay = () => setIsLoading(false)
    audio.onended = () => {
      indexRef.current++
      playNext()
    }
    audio.onerror = () => {
      // Skip to next verse on error
      indexRef.current++
      playNext()
    }

    audio.play().catch(() => {
      stop()
    })
  }, [stop])

  const play = useCallback((surah: number, verses: { surah: number; ayah: number }[]) => {
    stop()
    queueRef.current = verses
    indexRef.current = 0
    setPlayingSurah(surah)
    playNext()
  }, [stop, playNext])

  const toggle = useCallback((surah: number, verses: { surah: number; ayah: number }[]) => {
    if (playingSurah === surah) {
      stop()
    } else {
      play(surah, verses)
    }
  }, [playingSurah, play, stop])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      audioRef.current?.pause()
    }
  }, [])

  return { playingSurah, currentAyah, isLoading, toggle, stop }
}

// Surah names for headers (all 114)
const SURAH_NAMES: Record<number, { arabic: string; english: string }> = {
  1: { arabic: 'الفاتحة', english: 'Al-Fatiha' },
  2: { arabic: 'البقرة', english: 'Al-Baqarah' },
  3: { arabic: 'آل عمران', english: "Ali 'Imran" },
  4: { arabic: 'النساء', english: 'An-Nisa' },
  5: { arabic: 'المائدة', english: "Al-Ma'idah" },
  6: { arabic: 'الأنعام', english: "Al-An'am" },
  7: { arabic: 'الأعراف', english: "Al-A'raf" },
  8: { arabic: 'الأنفال', english: 'Al-Anfal' },
  9: { arabic: 'التوبة', english: 'At-Tawbah' },
  10: { arabic: 'يونس', english: 'Yunus' },
  11: { arabic: 'هود', english: 'Hud' },
  12: { arabic: 'يوسف', english: 'Yusuf' },
  13: { arabic: 'الرعد', english: "Ar-Ra'd" },
  14: { arabic: 'إبراهيم', english: 'Ibrahim' },
  15: { arabic: 'الحجر', english: 'Al-Hijr' },
  16: { arabic: 'النحل', english: 'An-Nahl' },
  17: { arabic: 'الإسراء', english: 'Al-Isra' },
  18: { arabic: 'الكهف', english: 'Al-Kahf' },
  19: { arabic: 'مريم', english: 'Maryam' },
  20: { arabic: 'طه', english: 'Ta-Ha' },
  21: { arabic: 'الأنبياء', english: 'Al-Anbiya' },
  22: { arabic: 'الحج', english: 'Al-Hajj' },
  23: { arabic: 'المؤمنون', english: "Al-Mu'minun" },
  24: { arabic: 'النور', english: 'An-Nur' },
  25: { arabic: 'الفرقان', english: 'Al-Furqan' },
  26: { arabic: 'الشعراء', english: "Ash-Shu'ara" },
  27: { arabic: 'النمل', english: 'An-Naml' },
  28: { arabic: 'القصص', english: 'Al-Qasas' },
  29: { arabic: 'العنكبوت', english: 'Al-Ankabut' },
  30: { arabic: 'الروم', english: 'Ar-Rum' },
  31: { arabic: 'لقمان', english: 'Luqman' },
  32: { arabic: 'السجدة', english: 'As-Sajdah' },
  33: { arabic: 'الأحزاب', english: 'Al-Ahzab' },
  34: { arabic: 'سبأ', english: "Saba'" },
  35: { arabic: 'فاطر', english: 'Fatir' },
  36: { arabic: 'يس', english: 'Ya-Sin' },
  37: { arabic: 'الصافات', english: 'As-Saffat' },
  38: { arabic: 'ص', english: 'Sad' },
  39: { arabic: 'الزمر', english: 'Az-Zumar' },
  40: { arabic: 'غافر', english: 'Ghafir' },
  41: { arabic: 'فصلت', english: 'Fussilat' },
  42: { arabic: 'الشورى', english: 'Ash-Shura' },
  43: { arabic: 'الزخرف', english: 'Az-Zukhruf' },
  44: { arabic: 'الدخان', english: 'Ad-Dukhan' },
  45: { arabic: 'الجاثية', english: 'Al-Jathiyah' },
  46: { arabic: 'الأحقاف', english: 'Al-Ahqaf' },
  47: { arabic: 'محمد', english: 'Muhammad' },
  48: { arabic: 'الفتح', english: 'Al-Fath' },
  49: { arabic: 'الحجرات', english: 'Al-Hujurat' },
  50: { arabic: 'ق', english: 'Qaf' },
  51: { arabic: 'الذاريات', english: 'Adh-Dhariyat' },
  52: { arabic: 'الطور', english: 'At-Tur' },
  53: { arabic: 'النجم', english: 'An-Najm' },
  54: { arabic: 'القمر', english: 'Al-Qamar' },
  55: { arabic: 'الرحمن', english: 'Ar-Rahman' },
  56: { arabic: 'الواقعة', english: "Al-Waqi'ah" },
  57: { arabic: 'الحديد', english: 'Al-Hadid' },
  58: { arabic: 'المجادلة', english: 'Al-Mujadila' },
  59: { arabic: 'الحشر', english: 'Al-Hashr' },
  60: { arabic: 'الممتحنة', english: 'Al-Mumtahanah' },
  61: { arabic: 'الصف', english: 'As-Saff' },
  62: { arabic: 'الجمعة', english: "Al-Jumu'ah" },
  63: { arabic: 'المنافقون', english: 'Al-Munafiqun' },
  64: { arabic: 'التغابن', english: 'At-Taghabun' },
  65: { arabic: 'الطلاق', english: 'At-Talaq' },
  66: { arabic: 'التحريم', english: 'At-Tahrim' },
  67: { arabic: 'الملك', english: 'Al-Mulk' },
  68: { arabic: 'القلم', english: 'Al-Qalam' },
  69: { arabic: 'الحاقة', english: 'Al-Haqqah' },
  70: { arabic: 'المعارج', english: "Al-Ma'arij" },
  71: { arabic: 'نوح', english: 'Nuh' },
  72: { arabic: 'الجن', english: 'Al-Jinn' },
  73: { arabic: 'المزمل', english: 'Al-Muzzammil' },
  74: { arabic: 'المدثر', english: 'Al-Muddaththir' },
  75: { arabic: 'القيامة', english: 'Al-Qiyamah' },
  76: { arabic: 'الإنسان', english: 'Al-Insan' },
  77: { arabic: 'المرسلات', english: 'Al-Mursalat' },
  78: { arabic: 'النبأ', english: 'An-Naba' },
  79: { arabic: 'النازعات', english: "An-Nazi'at" },
  80: { arabic: 'عبس', english: 'Abasa' },
  81: { arabic: 'التكوير', english: 'At-Takwir' },
  82: { arabic: 'الانفطار', english: 'Al-Infitar' },
  83: { arabic: 'المطففين', english: 'Al-Mutaffifin' },
  84: { arabic: 'الانشقاق', english: 'Al-Inshiqaq' },
  85: { arabic: 'البروج', english: 'Al-Buruj' },
  86: { arabic: 'الطارق', english: 'At-Tariq' },
  87: { arabic: 'الأعلى', english: "Al-A'la" },
  88: { arabic: 'الغاشية', english: 'Al-Ghashiyah' },
  89: { arabic: 'الفجر', english: 'Al-Fajr' },
  90: { arabic: 'البلد', english: 'Al-Balad' },
  91: { arabic: 'الشمس', english: 'Ash-Shams' },
  92: { arabic: 'الليل', english: 'Al-Layl' },
  93: { arabic: 'الضحى', english: 'Ad-Duha' },
  94: { arabic: 'الشرح', english: 'Ash-Sharh' },
  95: { arabic: 'التين', english: 'At-Tin' },
  96: { arabic: 'العلق', english: "Al-'Alaq" },
  97: { arabic: 'القدر', english: 'Al-Qadr' },
  98: { arabic: 'البينة', english: 'Al-Bayyinah' },
  99: { arabic: 'الزلزلة', english: 'Az-Zalzalah' },
  100: { arabic: 'العاديات', english: "Al-'Adiyat" },
  101: { arabic: 'القارعة', english: "Al-Qari'ah" },
  102: { arabic: 'التكاثر', english: 'At-Takathur' },
  103: { arabic: 'العصر', english: "Al-'Asr" },
  104: { arabic: 'الهمزة', english: 'Al-Humazah' },
  105: { arabic: 'الفيل', english: 'Al-Fil' },
  106: { arabic: 'قريش', english: 'Quraysh' },
  107: { arabic: 'الماعون', english: "Al-Ma'un" },
  108: { arabic: 'الكوثر', english: 'Al-Kawthar' },
  109: { arabic: 'الكافرون', english: 'Al-Kafirun' },
  110: { arabic: 'النصر', english: 'An-Nasr' },
  111: { arabic: 'المسد', english: 'Al-Masad' },
  112: { arabic: 'الإخلاص', english: 'Al-Ikhlas' },
  113: { arabic: 'الفلق', english: 'Al-Falaq' },
  114: { arabic: 'الناس', english: 'An-Nas' },
}

// Eastern Arabic numerals
const EASTERN_ARABIC = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩']

function toArabicNumeral(n: number): string {
  return String(n)
    .split('')
    .map((d) => EASTERN_ARABIC[Number(d)])
    .join('')
}

interface Ayah {
  surah: number
  ayah: number
  arabic: string
  translation: string
  isBismillah?: boolean
}

interface SurahGroup {
  surah: number
  name: { arabic: string; english: string } | undefined
  ayahs: Ayah[]
}

// Number of verses per page (approximate — surah headers may add visual weight)
const VERSES_PER_PAGE = 15

interface QuranReaderProps {
  juzNumber: number
  targetSurah?: number
  onStartReading?: () => void
  onFinishReading?: () => void
  onSurahRead?: (surahNumber: number) => void
}

export function QuranReader({ juzNumber, targetSurah, onStartReading, onFinishReading, onSurahRead }: QuranReaderProps) {
  const { ayahs, isLoading, error } = useQuranReader(juzNumber)
  const [selectedAyah, setSelectedAyah] = useState<Ayah | null>(null)
  const [selectedSurahName, setSelectedSurahName] = useState<string | undefined>(undefined)
  const [currentPage, setCurrentPage] = useState(0)
  const { playingSurah, currentAyah, isLoading: audioLoading, toggle: toggleSurahAudio } = useSurahAudio()
  const startCalledRef = useRef(false)
  const finishCalledRef = useRef(false)
  const touchStartRef = useRef<{ x: number; y: number } | null>(null)
  const pageContainerRef = useRef<HTMLDivElement>(null)

  // Group ayahs by surah
  const surahGroups = useMemo(() => {
    const groups: SurahGroup[] = []
    let current: SurahGroup | null = null

    for (const ayah of ayahs) {
      if (!current || ayah.surah !== current.surah) {
        current = {
          surah: ayah.surah,
          name: SURAH_NAMES[ayah.surah],
          ayahs: [],
        }
        groups.push(current)
      }
      current.ayahs.push(ayah)
    }

    return groups
  }, [ayahs])

  // Split into pages — each page is a slice of contiguous ayahs
  const pages = useMemo(() => {
    if (ayahs.length === 0) return []
    const result: Ayah[][] = []
    for (let i = 0; i < ayahs.length; i += VERSES_PER_PAGE) {
      result.push(ayahs.slice(i, i + VERSES_PER_PAGE))
    }
    return result
  }, [ayahs])

  const totalPages = pages.length

  // Find page containing target surah
  useEffect(() => {
    if (!targetSurah || pages.length === 0) return
    const pageIdx = pages.findIndex((page) =>
      page.some((a) => a.surah === targetSurah && a.ayah <= 1),
    )
    if (pageIdx >= 0) setCurrentPage(pageIdx)
  }, [targetSurah, pages])

  // Auto-track: mark juz as "in_progress" when content loads
  useEffect(() => {
    if (!isLoading && ayahs.length > 0 && !startCalledRef.current) {
      startCalledRef.current = true
      onStartReading?.()
    }
  }, [isLoading, ayahs.length, onStartReading])

  // Auto-track: mark juz as "completed" when user reaches last page
  useEffect(() => {
    if (totalPages > 0 && currentPage === totalPages - 1 && !finishCalledRef.current) {
      finishCalledRef.current = true
      onFinishReading?.()
    }
  }, [currentPage, totalPages, onFinishReading])

  // Auto-track surahs: when a page is viewed, check if any surah ends on this or previous pages
  useEffect(() => {
    if (!onSurahRead || pages.length === 0) return
    // Collect all ayahs up to and including current page
    const seenAyahs = pages.slice(0, currentPage + 1).flat()
    // Find surahs whose last ayah in this juz has been shown
    const surahsOnPage = new Set(seenAyahs.map((a) => a.surah))
    for (const surahNum of surahsOnPage) {
      const group = surahGroups.find((g) => g.surah === surahNum)
      if (!group) continue
      const lastAyah = group.ayahs[group.ayahs.length - 1]
      if (lastAyah && seenAyahs.includes(lastAyah)) {
        onSurahRead(surahNum)
      }
    }
  }, [currentPage, pages, surahGroups, onSurahRead])

  // Navigate pages
  const goToPage = useCallback((page: number) => {
    setCurrentPage(Math.max(0, Math.min(page, totalPages - 1)))
    // Scroll to top of the reader
    pageContainerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [totalPages])

  const nextPage = useCallback(() => goToPage(currentPage + 1), [currentPage, goToPage])
  const prevPage = useCallback(() => goToPage(currentPage - 1), [currentPage, goToPage])

  // Touch swipe handling
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0]
    if (touch) touchStartRef.current = { x: touch.clientX, y: touch.clientY }
  }, [])

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (!touchStartRef.current) return
    const touch = e.changedTouches[0]
    if (!touch) return

    const dx = touch.clientX - touchStartRef.current.x
    const dy = touch.clientY - touchStartRef.current.y
    touchStartRef.current = null

    // Only trigger if horizontal swipe > 50px and more horizontal than vertical
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) {
      // Swipe left = next page (RTL: right = next, but we follow standard mobile convention)
      if (dx < 0) nextPage()
      else prevPage()
    }
  }, [nextPage, prevPage])

  // Keyboard navigation
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') nextPage()
      else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') prevPage()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [nextPage, prevPage])

  if (isLoading) {
    return (
      <div className="space-y-4 animate-pulse px-1" aria-label="Loading Quran verses">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="space-y-2 py-2">
            <div className="h-8 rounded bg-muted w-full" />
            <div className="h-8 rounded bg-muted" style={{ width: `${60 + (i % 5) * 8}%` }} />
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    const isOffline = !navigator.onLine
    return (
      <div className="text-center py-12 space-y-3">
        <p className="text-red-500 font-medium">Failed to load Juz {juzNumber}</p>
        <p className="text-sm text-muted-foreground">
          {isOffline
            ? 'You are offline. This Juz needs to be loaded online at least once before it can be read offline.'
            : 'Check your internet connection and try again.'}
        </p>
        <button
          onClick={() => window.location.reload()}
          className="text-sm text-primary font-medium hover:underline"
        >
          Retry
        </button>
      </div>
    )
  }

  // Get current page ayahs and group them by surah for rendering
  const pageAyahs = pages[currentPage] ?? []
  const pageGroups: SurahGroup[] = []
  let currentGroup: SurahGroup | null = null
  for (const ayah of pageAyahs) {
    if (!currentGroup || ayah.surah !== currentGroup.surah) {
      currentGroup = { surah: ayah.surah, name: SURAH_NAMES[ayah.surah], ayahs: [] }
      pageGroups.push(currentGroup)
    }
    currentGroup.ayahs.push(ayah)
  }

  // Check if a surah header should show (first ayah of surah on this page, or ayah 0/1)
  const surahStartsOnPage = (group: SurahGroup): boolean => {
    const firstAyah = group.ayahs[0]
    if (!firstAyah) return false
    // Show header if the first verse of this group is the first real verse (ayah 0 or 1)
    // or if it's a bismillah
    if (firstAyah.isBismillah || firstAyah.ayah <= 1) return true
    // Also show if it's the first occurrence of this surah in the entire juz
    // and the previous page doesn't contain this surah
    if (currentPage === 0) return true
    const prevPageAyahs = pages[currentPage - 1] ?? []
    return !prevPageAyahs.some((a) => a.surah === group.surah)
  }

  return (
    <>
      {/* Page indicator */}
      <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
        <span>Tap verse marker for translation</span>
        <span>Page {currentPage + 1} of {totalPages}</span>
      </div>

      {/* Page content with swipe */}
      <div
        ref={pageContainerRef}
        className="mushaf-page min-h-[60vh] relative"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {pageGroups.map((group) => (
          <div key={`${group.surah}-${group.ayahs[0]?.ayah}`}>
            {/* Surah header — only if the surah starts on this page */}
            {group.name && surahStartsOnPage(group) && (
              <div className="surah-header-ornament">
                <h2 className="text-xl font-bold" style={{ fontFamily: 'var(--font-arabic)' }} lang="ar">
                  {group.name.arabic}
                </h2>
                <p className="text-sm text-muted-foreground mt-0.5">{group.name.english}</p>
                <button
                  onClick={() => {
                    // Get all verses for this surah across all pages
                    const fullGroup = surahGroups.find((g) => g.surah === group.surah)
                    const verses = (fullGroup?.ayahs ?? group.ayahs)
                      .filter((a) => !a.isBismillah && a.ayah > 0)
                      .map((a) => ({ surah: a.surah, ayah: a.ayah }))
                    toggleSurahAudio(group.surah, verses)
                  }}
                  aria-label={playingSurah === group.surah ? `Stop playing ${group.name.english}` : `Play ${group.name.english}`}
                  className="mt-2 inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full border border-accent text-accent hover:bg-accent hover:text-accent-foreground transition-colors"
                >
                  {playingSurah === group.surah ? (
                    <>
                      {audioLoading ? (
                        <span className="w-3.5 h-3.5 rounded-full border-2 border-current border-t-transparent animate-spin block" />
                      ) : (
                        <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                          <rect x="3" y="2" width="4" height="12" rx="1" />
                          <rect x="9" y="2" width="4" height="12" rx="1" />
                        </svg>
                      )}
                      Playing · Ayah {currentAyah}
                    </>
                  ) : (
                    <>
                      <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                        <path d="M3 2.5l10 5.5-10 5.5V2.5z" />
                      </svg>
                      Play Surah
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Continuous flowing text for this group on this page */}
            <p className="mushaf-text" lang="ar">
              {group.ayahs.map((ayah) => {
                if (ayah.isBismillah) {
                  return (
                    <span key={`bismillah-${ayah.surah}`} className="mushaf-bismillah">
                      {ayah.arabic}
                    </span>
                  )
                }

                return (
                  <span key={`${ayah.surah}-${ayah.ayah}`}>
                    {ayah.arabic}{' '}
                    <span
                      role="button"
                      tabIndex={0}
                      className="verse-marker"
                      aria-label={`Verse ${ayah.ayah} of ${group.name?.english ?? `Surah ${ayah.surah}`}. Tap for details.`}
                      onClick={() => {
                        setSelectedAyah(ayah)
                        setSelectedSurahName(group.name?.english)
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault()
                          setSelectedAyah(ayah)
                          setSelectedSurahName(group.name?.english)
                        }
                      }}
                    >
                      {toArabicNumeral(ayah.ayah)}
                    </span>{' '}
                  </span>
                )
              })}
            </p>
          </div>
        ))}

        {/* Last page indicator */}
        {currentPage === totalPages - 1 && (
          <div className="text-center py-4 text-sm text-muted-foreground">
            End of Juz {juzNumber}
          </div>
        )}
      </div>

      {/* Navigation controls */}
      <div className="flex items-center justify-between mt-4 gap-2">
        <button
          onClick={prevPage}
          disabled={currentPage === 0}
          className="flex items-center gap-1 px-4 py-2.5 rounded-lg bg-muted text-sm font-medium disabled:opacity-30 transition-opacity active:scale-95"
          aria-label="Previous page"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            <path d="M10 3L5 8l5 5" />
          </svg>
          Previous
        </button>

        <span className="text-sm font-medium text-muted-foreground tabular-nums">
          {currentPage + 1} / {totalPages}
        </span>

        <button
          onClick={nextPage}
          disabled={currentPage === totalPages - 1}
          className="flex items-center gap-1 px-4 py-2.5 rounded-lg bg-muted text-sm font-medium disabled:opacity-30 transition-opacity active:scale-95"
          aria-label="Next page"
        >
          Next
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            <path d="M6 3l5 5-5 5" />
          </svg>
        </button>
      </div>

      <AyahDetailSheet
        ayah={selectedAyah}
        surahName={selectedSurahName}
        onClose={() => setSelectedAyah(null)}
      />
    </>
  )
}
