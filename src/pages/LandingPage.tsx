import { Link } from 'react-router-dom'

function Hadith({ arabic, text, source }: { arabic?: string; text: string; source: string }) {
  return (
    <div className="border-l-2 border-accent pl-5 py-1 space-y-2">
      {arabic && (
        <p dir="rtl" lang="ar" className="text-lg text-foreground leading-loose">
          {arabic}
        </p>
      )}
      <p className="text-base text-foreground italic leading-relaxed">&ldquo;{text}&rdquo;</p>
      <p className="text-sm text-muted-foreground">{source}</p>
    </div>
  )
}

function Section({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <section className={`py-12 border-t border-border ${className}`}>
      {children}
    </section>
  )
}

export function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-2xl mx-auto px-6 pb-20">

        {/* Hero */}
        <div className="pt-16 pb-12 space-y-8">
          <div className="text-center space-y-3">
            <p dir="rtl" lang="ar" className="text-2xl text-muted-foreground">
              بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ
            </p>
            <div className="space-y-1">
              <h1 className="text-5xl font-bold tracking-tight text-foreground">Sabeel</h1>
              <p dir="rtl" lang="ar" className="text-xl text-muted-foreground">سبيل</p>
            </div>
            <p className="text-lg text-muted-foreground max-w-sm mx-auto leading-relaxed pt-2">
              A companion for those who want to make Ramadan count.
            </p>
          </div>

          <div className="flex justify-center">
            <Link
              to="/app"
              className="inline-block bg-primary text-primary-foreground px-8 py-3 rounded-lg text-base font-medium hover:opacity-90 transition-opacity"
            >
              Open Sabeel
            </Link>
          </div>
        </div>

        {/* What it is */}
        <Section>
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">What is Sabeel</h2>
            <p className="text-base text-muted-foreground leading-relaxed">
              Sabeel is a minimal Ramadan companion. It helps you read and track the Quran
              by juz, maintain your five daily prayers, and complete your morning, evening,
              and post-prayer adhkar.
            </p>
            <p className="text-base text-muted-foreground leading-relaxed">
              There are no accounts, no advertisements, no social feeds. It runs entirely
              on your device, works offline, and stores nothing outside your browser.
            </p>
            <div className="pt-2 space-y-2">
              {[
                'Quran reader with Uthmani script and juz-by-juz tracking',
                'Daily prayer log for all five salah',
                'Morning, evening, after-prayer, pre-sleep, and anxiety adhkar',
                'Ramadan progress tracker across 30 juz',
                'Works offline — no internet required after first load',
              ].map((item) => (
                <div key={item} className="flex gap-3 items-start">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-accent flex-shrink-0" />
                  <p className="text-base text-muted-foreground">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </Section>

        {/* Why it was built */}
        <Section>
          <div className="space-y-5">
            <h2 className="text-2xl font-semibold text-foreground">Why it was built</h2>
            <p className="text-base text-muted-foreground leading-relaxed">
              Ramadan after Ramadan passes with sincere intentions and little to show for
              them. The Quran sits untouched after the second week. The adhkar are remembered
              some mornings and forgotten most. The prayers are logged in the mind but not
              truly accounted for.
            </p>
            <p className="text-base text-muted-foreground leading-relaxed">
              Sabeel exists because accountability, even private accountability, changes
              behavior. Seeing that seven juz remain on day twenty creates urgency that
              good intentions alone do not. Seeing that morning adhkar has been completed
              twelve days running creates the momentum to complete it on the thirteenth.
            </p>
            <p className="text-base text-muted-foreground leading-relaxed">
              The scholars of the ummah have written at length about the virtue of structure
              in worship. The Companions did not approach Ramadan casually. They prepared
              months in advance. They completed the Quran multiple times. They gave every
              night its due. Sabeel is an attempt to make that level of structure accessible
              to an ordinary person with an ordinary life.
            </p>

            <div className="pt-2">
              <Hadith
                arabic="أَحَبُّ الأَعْمَالِ إِلَى اللَّهِ أَدْوَمُهَا وَإِنْ قَلَّ"
                text="The most beloved deeds to Allah are the most consistent, even if they are small."
                source="Sahih al-Bukhari 6465, narrated by Aisha (may Allah be pleased with her)"
              />
            </div>
          </div>
        </Section>

        {/* The Quran and Ramadan */}
        <Section>
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-foreground">The Quran and Ramadan</h2>
            <p className="text-base text-muted-foreground leading-relaxed">
              Ramadan is the month in which the Quran was revealed. The connection between
              this month and this book is not incidental. It is foundational. Every year,
              Jibreel (peace be upon him) would descend and review the entire Quran with
              the Prophet (ﷺ). In the final year of his life, they reviewed it twice.
            </p>

            <Hadith
              arabic="كَانَ جِبْرِيلُ يَلْقَى النَّبِيَّ ﷺ فِي كُلِّ لَيْلَةٍ مِنْ رَمَضَانَ، فَيُدَارِسُهُ الْقُرْآنَ"
              text="Jibreel used to meet the Prophet (peace be upon him) every night of Ramadan and study the Quran with him."
              source="Sahih al-Bukhari 3220, narrated by Ibn Abbas (may Allah be pleased with him)"
            />

            <p className="text-base text-muted-foreground leading-relaxed">
              The division of the Quran into thirty juz was established precisely to
              facilitate its completion during Ramadan — one juz per day over thirty days.
              This practice is among the most enduring traditions of the Muslim ummah and
              one that Sabeel is built around.
            </p>

            <Hadith
              arabic="مَنْ قَرَأَ حَرْفًا مِنْ كِتَابِ اللَّهِ فَلَهُ بِهِ حَسَنَةٌ وَالْحَسَنَةُ بِعَشْرِ أَمْثَالِهَا"
              text="Whoever reads one letter from the Book of Allah will receive one good deed, and that good deed will be multiplied by ten."
              source="Jami at-Tirmidhi 2910, narrated by Ibn Masud (may Allah be pleased with him)"
            />
          </div>
        </Section>

        {/* Prayer */}
        <Section>
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-foreground">The Five Prayers</h2>
            <p className="text-base text-muted-foreground leading-relaxed">
              Of all the pillars of Islam, the prayer is the one most frequently
              mentioned in the Quran and the one the Prophet (ﷺ) spoke about with
              the greatest urgency. It is the first matter that will be examined on
              the Day of Judgement. If it is sound, everything else will be sound.
              If it is corrupted, everything else will be corrupted.
            </p>

            <Hadith
              text="The first thing a person will be called to account for on the Day of Judgement is the prayer. If it is found to be sound and complete, the rest of his deeds will be sound and complete. If it is found to be deficient, the rest of his deeds will be deficient."
              source="Al-Tabarani and Al-Daraqutni, reported by Abu Hurayrah (may Allah be pleased with him)"
            />

            <p className="text-base text-muted-foreground leading-relaxed">
              Sabeel does not automate prayer or replace the act of standing before
              Allah. It simply provides a place to mark each prayer as it is completed,
              creating a daily record that is honest rather than assumed.
            </p>
          </div>
        </Section>

        {/* Adhkar */}
        <Section>
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-foreground">Remembrance of Allah</h2>
            <p className="text-base text-muted-foreground leading-relaxed">
              The adhkar prescribed by the Prophet (ﷺ) for morning, evening, after
              prayer, and before sleep are among the most powerful acts a Muslim can
              perform outside of formal worship. They are brief. They take minutes.
              And their rewards, as described in authentic narrations, are immense.
            </p>

            <Hadith
              arabic="أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ"
              text="Verily, in the remembrance of Allah do hearts find rest."
              source="Quran, Surah Ar-Ra'd 13:28"
            />

            <Hadith
              text="Shall I not tell you about the best of your deeds, the purest before your Lord, the highest in your ranks, better for you than giving gold and silver, and better for you than meeting your enemy and striking their necks and them striking yours? They said: Yes, O Messenger of Allah. He said: The remembrance of Allah."
              source="Jami at-Tirmidhi 3377, narrated by Abu al-Darda (may Allah be pleased with him)"
            />

            <p className="text-base text-muted-foreground leading-relaxed">
              The anxiety adhkar in Sabeel draw from the supplications the Prophet
              (ﷺ) taught specifically for moments of distress and hardship — because
              Ramadan, for many people, is also a month of difficulty, and Islam
              acknowledges that.
            </p>
          </div>
        </Section>

        {/* Closing */}
        <Section>
          <div className="space-y-5">
            <h2 className="text-2xl font-semibold text-foreground">A Path, Not a Product</h2>
            <p className="text-base text-muted-foreground leading-relaxed">
              The name Sabeel means path or way. It is used in the Quran to describe
              the way of Allah, the way of righteousness, the way that leads somewhere.
              This app is a small, imperfect tool in the hand of someone trying to walk
              that path with more intention.
            </p>
            <p className="text-base text-muted-foreground leading-relaxed">
              It will not make you more righteous. It will not replace knowledge, sincerity,
              or consistent effort. But it may help you see more clearly where you are,
              and what remains to be done before the month ends.
            </p>

            <div className="pt-2">
              <Hadith
                arabic="إِنَّ مَعَ الْعُسْرِ يُسْرًا"
                text="Verily, with every hardship comes ease."
                source="Quran, Surah Ash-Sharh 94:6"
              />
            </div>

            <div className="pt-4 flex justify-center">
              <Link
                to="/app"
                className="inline-block bg-primary text-primary-foreground px-8 py-3 rounded-lg text-base font-medium hover:opacity-90 transition-opacity"
              >
                Open Sabeel
              </Link>
            </div>
          </div>
        </Section>

        {/* Footer */}
        <div className="py-8 text-center">
          <p className="text-sm text-muted-foreground">
            Sabeel is free, open, and built with the intention of benefit.
          </p>
          <p dir="rtl" lang="ar" className="text-base text-muted-foreground mt-2">
            وَمَا تَوْفِيقِي إِلَّا بِاللَّهِ
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            My success is only through Allah — Quran 11:88
          </p>
        </div>

      </div>
    </div>
  )
}
