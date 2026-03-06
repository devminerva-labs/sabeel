import { ArabicText } from '@/components/ArabicText'

interface Props {
  open: boolean
  onClose: () => void
}

export function QuranCompletionModal({ open, onClose }: Props) {
  if (!open) return null

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
        aria-label="Quran completion celebration"
        className="fixed bottom-0 left-0 right-0 z-50 bg-background rounded-t-2xl shadow-2xl max-h-[85dvh] flex flex-col"
      >
        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-1 shrink-0">
          <div className="w-10 h-1 rounded-full bg-border" />
        </div>

        {/* Close button */}
        <div className="flex justify-end px-5 pt-2 shrink-0">
          <button
            onClick={onClose}
            aria-label="Close"
            className="text-muted-foreground hover:text-foreground transition-colors p-1"
          >
            ✕
          </button>
        </div>

        {/* Scrollable content */}
        <div className="overflow-y-auto px-6 pb-10 pt-2 space-y-6 flex-1">

          {/* ── Section 1: Celebration ── */}
          <div className="text-center space-y-4">
            <p className="text-3xl" aria-hidden="true">✦</p>
            <div className="space-y-1">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
                Masha'Allah
              </p>
              <h2 className="text-xl font-bold text-foreground">
                You have completed the Quran
              </h2>
            </div>

            {/* Du'a */}
            <div className="rounded-xl border border-primary/30 bg-primary/5 px-5 py-5 space-y-3">
              <ArabicText
                as="p"
                className="text-2xl leading-loose text-foreground text-right"
              >
                اللَّهُمَّ ارْحَمْنِي بِالْقُرْآنِ وَاجْعَلْهُ لِي إِمَامًا وَنُورًا وَهُدًى وَرَحْمَةً
              </ArabicText>
              <p className="text-xs text-muted-foreground italic leading-relaxed">
                Allāhummar-ḥamnī bil-Qur'ān, waj'alhu lī imāman wa nūran wa hudan wa raḥmah
              </p>
              <p className="text-sm text-foreground leading-relaxed">
                "O Allah, have mercy on me through the Quran, and make it for me an imam, a light, a guidance and a mercy."
              </p>
            </div>

            <p className="text-sm text-muted-foreground leading-relaxed">
              May Allah accept your recitation and make it a light for you on the Day of Judgement.
            </p>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-border" />
            <p className="text-xs text-muted-foreground uppercase tracking-widest shrink-0">
              What's next
            </p>
            <div className="flex-1 h-px bg-border" />
          </div>

          {/* ── Section 2: Tadabbur teaser ── */}
          <div className="space-y-4">
            <div className="space-y-1">
              <h3 className="text-base font-semibold text-foreground">
                Now begins the deeper journey
              </h3>
              <p className="text-sm font-medium text-primary">
                Tadabbur — Pondering the Quran
              </p>
            </div>

            {/* Verse */}
            <div className="border-l-2 border-primary pl-4 space-y-1">
              <ArabicText as="p" className="text-base leading-loose text-foreground text-right">
                كِتَابٌ أَنزَلْنَاهُ إِلَيْكَ مُبَارَكٌ لِّيَدَّبَّرُوا آيَاتِهِ
              </ArabicText>
              <p className="text-sm text-foreground italic leading-relaxed">
                "A Book We have sent down to you, full of blessings, so that they may ponder its verses."
              </p>
              <p className="text-xs text-muted-foreground">— Sūrah Ṣād, 38:29</p>
            </div>

            <p className="text-sm text-muted-foreground leading-relaxed">
              Recitation is the foundation. Reflection is the fruit. Soon, Sabeel will guide you through every surah — its themes, its lessons, its call to your heart.
            </p>

            {/* Coming-soon badge */}
            <div className="rounded-xl border border-border bg-muted/40 px-4 py-3 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-foreground">Surah Reflection</p>
                <p className="text-xs text-muted-foreground">Ponder every surah, in depth</p>
              </div>
              <span className="text-xs font-semibold text-muted-foreground bg-muted px-2 py-1 rounded-full uppercase tracking-wide shrink-0">
                Coming soon
              </span>
            </div>
          </div>

          {/* Close CTA */}
          <button
            onClick={onClose}
            className="w-full rounded-xl bg-primary text-primary-foreground py-3 text-sm font-semibold hover:opacity-90 transition-opacity active:scale-[0.98]"
          >
            Alhamdulillah
          </button>
        </div>
      </div>
    </>
  )
}
