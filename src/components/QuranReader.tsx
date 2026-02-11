import { useState, useEffect, useRef } from 'react'
import { useQuranReader } from '@/hooks/useQuranReader'
import { ArabicText } from '@/components/ArabicText'
import { AyahDetailSheet } from '@/components/AyahDetailSheet'

// Surah names for headers (subset used in Quran reader)
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

interface Ayah {
  surah: number
  ayah: number
  arabic: string
  translation: string
}

interface QuranReaderProps {
  juzNumber: number
  targetSurah?: number // scroll to this surah after loading
}

export function QuranReader({ juzNumber, targetSurah }: QuranReaderProps) {
  const { ayahs, isLoading, error } = useQuranReader(juzNumber)
  const [selectedAyah, setSelectedAyah] = useState<Ayah | null>(null)
  const [selectedSurahName, setSelectedSurahName] = useState<string | undefined>(undefined)
  const surahHeaderRefs = useRef<Map<number, HTMLDivElement>>(new Map())

  // Scroll to target surah once data loads
  useEffect(() => {
    if (!isLoading && targetSurah && ayahs.length > 0) {
      const el = surahHeaderRefs.current.get(targetSurah)
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }
  }, [isLoading, targetSurah, ayahs.length])

  if (isLoading) {
    return (
      <div className="space-y-4 animate-pulse px-1" aria-label="Loading Quran verses">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="space-y-2 py-2">
            <div className="h-8 rounded bg-muted w-full" />
            <div className="h-8 rounded bg-muted" style={{ width: `${60 + (i % 5) * 8}%` }} />
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12 space-y-2">
        <p className="text-red-500 font-medium">Failed to load Juz {juzNumber}</p>
        <p className="text-sm text-muted-foreground">Check your internet connection and try again.</p>
      </div>
    )
  }

  // Group ayahs by surah for headers
  let currentSurah = 0

  return (
    <>
      <p className="text-xs text-muted-foreground text-center mb-3">Tap any verse for translation & tafsir</p>
      <div className="space-y-1">
        {ayahs.map((ayah) => {
          const showSurahHeader = ayah.surah !== currentSurah
          if (showSurahHeader) currentSurah = ayah.surah

          const surahInfo = SURAH_NAMES[ayah.surah]

          const key = ayah.isBismillah ? `bismillah-${ayah.surah}` : `${ayah.surah}-${ayah.ayah}`

          return (
            <div key={key}>
              {showSurahHeader && surahInfo && (
                <div
                  ref={(el) => { if (el) surahHeaderRefs.current.set(ayah.surah, el) }}
                  className="text-center py-4 my-2 border-y border-border"
                >
                  <ArabicText as="h2" className="text-xl font-bold">
                    {surahInfo.arabic}
                  </ArabicText>
                  <p className="text-sm text-muted-foreground mt-1">{surahInfo.english}</p>
                </div>
              )}
              {ayah.isBismillah ? (
                <div className="text-center py-3">
                  <ArabicText as="p" className="text-2xl text-muted-foreground">
                    {ayah.arabic}
                  </ArabicText>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setSelectedAyah(ayah)
                    setSelectedSurahName(surahInfo?.english)
                  }}
                  className="w-full text-right py-2 px-1 rounded-lg hover:bg-muted/50 active:bg-muted transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  aria-label={`Verse ${ayah.ayah} of ${surahInfo?.english ?? `Surah ${ayah.surah}`}. Tap for details.`}
                >
                  <ArabicText as="p" className="text-2xl leading-[2.8]">
                    {ayah.arabic} ﴿{ayah.ayah}﴾
                  </ArabicText>
                </button>
              )}
            </div>
          )
        })}
      </div>

      <AyahDetailSheet
        ayah={selectedAyah}
        surahName={selectedSurahName}
        onClose={() => setSelectedAyah(null)}
      />
    </>
  )
}
