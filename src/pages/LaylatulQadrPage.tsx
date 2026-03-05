import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArabicText } from '@/components/ArabicText'
import { NightChecklist } from '@/components/NightChecklist'
import { useRamadanContext } from '@/hooks/useRamadanContext'
import { getPrayerTimes, formatPrayerTime } from '@/lib/prayer-times'
import { getLaylahNightNumber, isOddLaylahNight } from '@/lib/ramadan-dates'
import {
  PRIMARY_DUA,
  LAYLAH_DUAS,
  LAYLAH_HADITHS,
  LAYLAH_SURAHS,
  QIYAM_GUIDE,
} from '@/lib/laylatul-qadr-data'

// ─── Sub-components ───────────────────────────────────────────────────────────

function DuaCard({ arabic, transliteration, translation, source, isPrimary }: {
  arabic: string
  transliteration: string
  translation: string
  source: string
  isPrimary?: boolean
}) {
  return (
    <div className={`rounded-xl border p-4 space-y-3 ${
      isPrimary
        ? 'border-primary/40 bg-primary/5'
        : 'border-border bg-card'
    }`}>
      <ArabicText className="text-xl leading-loose text-foreground text-right">
        {arabic}
      </ArabicText>
      <p className="text-sm italic text-muted-foreground leading-relaxed">{transliteration}</p>
      <p className="text-sm text-foreground leading-relaxed">&ldquo;{translation}&rdquo;</p>
      <p className="text-xs text-muted-foreground">{source}</p>
    </div>
  )
}

function HadithCard({ arabic, text, source }: { arabic?: string; text: string; source: string }) {
  return (
    <div className="border-l-2 border-primary pl-4 py-1 space-y-2">
      {arabic && (
        <ArabicText className="text-base leading-loose text-foreground">
          {arabic}
        </ArabicText>
      )}
      <p className="text-sm text-foreground italic leading-relaxed">&ldquo;{text}&rdquo;</p>
      <p className="text-xs text-muted-foreground">{source}</p>
    </div>
  )
}

function CollapsibleSection({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between p-4 text-left"
      >
        <span className="text-sm font-semibold text-foreground">{title}</span>
        <svg
          className={`w-4 h-4 text-muted-foreground transition-transform ${open ? 'rotate-180' : ''}`}
          fill="none" viewBox="0 0 16 16"
        >
          <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {open && (
        <div className="px-4 pb-4 space-y-3 border-t border-border pt-3">
          {children}
        </div>
      )}
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export function LaylatulQadrPage() {
  const { dayNumber } = useRamadanContext()
  const [maghrib, setMaghrib] = useState<Date | undefined>()
  const [lastThird, setLastThird] = useState<Date | undefined>()

  useEffect(() => {
    try {
      const today = new Date()
      const todayTimes = getPrayerTimes(today)
      const tomorrow = new Date(today)
      tomorrow.setDate(tomorrow.getDate() + 1)
      const tomorrowTimes = getPrayerTimes(tomorrow)

      setMaghrib(todayTimes.maghrib)

      // Last third = Fajr_tomorrow - (Fajr_tomorrow - Maghrib_today) / 3
      const nightDuration = tomorrowTimes.fajr.getTime() - todayTimes.maghrib.getTime()
      const lastThirdStart = new Date(tomorrowTimes.fajr.getTime() - nightDuration / 3)
      setLastThird(lastThirdStart)
    } catch {
      // No geolocation — times unavailable
    }
  }, [])

  const now = new Date()
  const nightNumber = dayNumber ? getLaylahNightNumber(dayNumber, now, maghrib) : null
  const isOdd = nightNumber ? isOddLaylahNight(nightNumber) : false

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="text-center space-y-3 pt-2">
        <ArabicText className="text-4xl leading-loose text-primary">
          لَيْلَةُ الْقَدْرِ
        </ArabicText>
        <div className="space-y-1">
          <h1 className="text-xl font-bold text-foreground">The Night of Power</h1>
          {nightNumber ? (
            <p className="text-sm text-muted-foreground">
              Night {nightNumber} of Ramadan
              {isOdd && (
                <span className="ml-2 text-primary font-medium">— Odd Night</span>
              )}
            </p>
          ) : (
            <p className="text-sm text-muted-foreground">Better than a thousand months</p>
          )}
        </div>
      </div>

      {/* Primary Dua — always at top */}
      <div className="space-y-2">
        <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium px-1">
          The Dua for Laylatul Qadr
        </p>
        <DuaCard {...PRIMARY_DUA} isPrimary />
        <p className="text-xs text-muted-foreground px-1 leading-relaxed">
          Aisha (may Allah be pleased with her) asked: &ldquo;If I know which night is Laylatul Qadr, what should I say?&rdquo; The Prophet (ﷺ) taught her this dua.
        </p>
      </div>

      {/* Hadiths */}
      <div className="space-y-2">
        <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium px-1">
          The Night in Hadith
        </p>
        <div className="space-y-4">
          {LAYLAH_HADITHS.map((h) => (
            <HadithCard key={h.id} {...h} />
          ))}
        </div>
      </div>

      {/* Tonight's Checklist */}
      {nightNumber && (
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium px-1">
            Tonight's Ibadah
          </p>
          <NightChecklist />
        </div>
      )}

      {/* Prayer times if available */}
      {(maghrib || lastThird) && (
        <div className="rounded-xl border border-border bg-card p-4 space-y-2">
          <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">Tonight's Times</p>
          <div className="grid grid-cols-2 gap-3">
            {maghrib && (
              <div>
                <p className="text-xs text-muted-foreground">Night begins (Maghrib)</p>
                <p className="text-base font-semibold text-foreground">{formatPrayerTime(maghrib)}</p>
              </div>
            )}
            {lastThird && (
              <div>
                <p className="text-xs text-muted-foreground">Last third of night</p>
                <p className="text-base font-semibold text-primary">{formatPrayerTime(lastThird)}</p>
              </div>
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            The last third is the best time for Qiyam and dua.
          </p>
        </div>
      )}

      {/* Qiyam ul-Layl Guide */}
      <CollapsibleSection title="Qiyam ul-Layl Guide">
        <p className="text-sm text-muted-foreground leading-relaxed">{QIYAM_GUIDE.what}</p>
        <p className="text-sm text-foreground font-medium">Best time</p>
        <p className="text-sm text-muted-foreground leading-relaxed">{QIYAM_GUIDE.bestTime}</p>
        <p className="text-sm text-foreground font-medium">How many rakats</p>
        <ul className="space-y-1">
          {QIYAM_GUIDE.rakats.map((r, i) => (
            <li key={i} className="flex gap-2 text-sm text-muted-foreground">
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
              {r}
            </li>
          ))}
        </ul>
        <p className="text-sm text-foreground font-medium">What to recite</p>
        <ul className="space-y-1">
          {QIYAM_GUIDE.recitation.map((r, i) => (
            <li key={i} className="flex gap-2 text-sm text-muted-foreground">
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
              {r}
            </li>
          ))}
        </ul>
      </CollapsibleSection>

      {/* Additional Duas */}
      <CollapsibleSection title="More Duas for These Nights">
        <div className="space-y-4">
          {LAYLAH_DUAS.filter((d) => !d.isPrimary).map((dua) => (
            <DuaCard key={dua.id} {...dua} />
          ))}
        </div>
      </CollapsibleSection>

      {/* Recommended Surahs */}
      <div className="space-y-2">
        <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium px-1">
          Surahs to Read and Ponder
        </p>
        <div className="space-y-2">
          {LAYLAH_SURAHS.map((surah) => (
            <Link
              key={surah.number}
              to="/app/quran"
              className="block rounded-xl border border-border bg-card p-4 hover:bg-muted/30 transition-colors space-y-1"
            >
              <div className="flex items-baseline justify-between gap-2">
                <div className="flex items-baseline gap-2">
                  <ArabicText className="text-base text-foreground">{surah.arabicName}</ArabicText>
                  <span className="text-sm font-medium text-foreground">{surah.name}</span>
                </div>
                <span className="text-xs text-muted-foreground flex-shrink-0">{surah.ayaatCount} ayaat</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">{surah.reason}</p>
              {surah.keyAyaat && (
                <p className="text-xs text-primary font-medium">{surah.keyAyaat}</p>
              )}
            </Link>
          ))}
        </div>
      </div>

      {/* Link to adhkar */}
      <Link
        to="/app/adhkar"
        className="block rounded-xl border border-primary/20 bg-primary/5 p-4 text-center hover:bg-primary/10 transition-colors"
      >
        <p className="text-sm font-semibold text-primary">Laylatul Qadr Adhkar</p>
        <p className="text-xs text-muted-foreground mt-0.5">Open full dhikr counter</p>
      </Link>
    </div>
  )
}
