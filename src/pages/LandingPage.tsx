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
          <div className="text-center space-y-4">
            <p dir="rtl" lang="ar" className="text-2xl text-muted-foreground">
              بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ
            </p>
            <div className="space-y-2">
              <p dir="rtl" lang="ar" className="text-5xl text-foreground leading-loose">
                لَيْلَةُ الْقَدْرِ
              </p>
              <h1 className="text-2xl font-bold tracking-tight text-foreground">The Night of Power</h1>
            </div>
            <p className="text-lg text-muted-foreground max-w-sm mx-auto leading-relaxed pt-1">
              Better than a thousand months. The greatest opportunity of the year begins at Maghrib.
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

        {/* The Night — Surah Al-Qadr */}
        <Section>
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-foreground">The Night Allah Described</h2>
            <p className="text-base text-muted-foreground leading-relaxed">
              Allah did not leave us to guess at the importance of this night. He revealed an entire
              surah about it — five ayaat that have been recited by every generation of Muslims since
              the first revelation in Makkah. These are among the most weight-bearing words in the Quran.
            </p>

            <Hadith
              arabic="إِنَّا أَنزَلْنَاهُ فِي لَيْلَةِ الْقَدْرِ ۝ وَمَا أَدْرَاكَ مَا لَيْلَةُ الْقَدْرِ ۝ لَيْلَةُ الْقَدْرِ خَيْرٌ مِّنْ أَلْفِ شَهْرٍ ۝ تَنَزَّلُ الْمَلَائِكَةُ وَالرُّوحُ فِيهَا بِإِذْنِ رَبِّهِم مِّن كُلِّ أَمْرٍ ۝ سَلَامٌ هِيَ حَتَّىٰ مَطْلَعِ الْفَجْرِ"
              text="Indeed, We sent the Quran down during the Night of Decree. And what can make you know what is the Night of Decree? The Night of Decree is better than a thousand months. The angels and the Spirit descend therein by permission of their Lord for every matter. Peace it is until the emergence of dawn."
              source="Quran — Surah Al-Qadr, 97:1-5"
            />

            <p className="text-base text-muted-foreground leading-relaxed">
              A thousand months is eighty-three years and four months. A single night of sincere
              worship outweighs a lifetime of ordinary days. The Quran does not say &ldquo;approximately&rdquo;
              or &ldquo;perhaps.&rdquo; It says: better than a thousand months.
            </p>
          </div>
        </Section>

        {/* What it is */}
        <Section>
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-foreground">What Laylatul Qadr Is</h2>
            <p className="text-base text-muted-foreground leading-relaxed">
              Laylatul Qadr — the Night of Decree or Night of Power — is the night on which the Quran
              was first revealed to the Prophet Muhammad (ﷺ) through Jibreel (peace be upon him).
              It falls within the last ten nights of Ramadan, and the Prophet (ﷺ) taught us to seek
              it specifically in the odd nights: the 21st, 23rd, 25th, 27th, and 29th.
            </p>

            <Hadith
              text="Seek it (Laylatul Qadr) in the odd nights of the last ten nights of Ramadan."
              source="Sahih al-Bukhari 2017"
            />

            <p className="text-base text-muted-foreground leading-relaxed">
              The exact night is hidden. This is by design. The concealment is a mercy — it compels
              the believer to give every one of the ten nights its full due, rather than treating nine
              of them as ordinary. The Prophet (ﷺ) himself intensified his worship across all ten,
              not just the one.
            </p>

            <Hadith
              arabic="كَانَ النَّبِيُّ ﷺ إِذَا دَخَلَ الْعَشْرُ شَدَّ مِئْزَرَهُ، وَأَحْيَا لَيْلَهُ، وَأَيْقَظَ أَهْلَهُ"
              text="When the last ten days began, the Prophet (ﷺ) would tighten his waist-wrapper, stay up at night, and wake his family."
              source="Sahih al-Bukhari 2024, Sahih Muslim 1174 — narrated by Aisha (may Allah be pleased with her)"
            />
          </div>
        </Section>

        {/* The Promise */}
        <Section>
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-foreground">The Promise</h2>
            <p className="text-base text-muted-foreground leading-relaxed">
              The Prophet (ﷺ) did not describe Laylatul Qadr in vague or qualified terms. He gave
              a direct, unconditional promise to anyone who stands in prayer on this night with
              sincere belief and hoping for reward from Allah alone.
            </p>

            <Hadith
              arabic="مَنْ قَامَ لَيْلَةَ الْقَدْرِ إِيمَانًا وَاحْتِسَابًا، غُفِرَ لَهُ مَا تَقَدَّمَ مِنْ ذَنْبِهِ"
              text="Whoever stands in prayer during Laylatul Qadr with faith and hoping for reward, all his previous sins will be forgiven."
              source="Sahih al-Bukhari 2014, Sahih Muslim 760"
            />

            <p className="text-base text-muted-foreground leading-relaxed">
              All previous sins. Not some. Not the minor ones. All of them — forgiven in a single
              night between Maghrib and Fajr. This is the magnitude of what Allah has made available
              to every Muslim who is alive during these nights.
            </p>

            <Hadith
              text="The sign of Laylatul Qadr is that it is a serene, clear night — neither hot nor cold — and the sun rises the following morning faint and reddish, without rays."
              source="Sahih Ibn Khuzaymah 2190, graded Hasan"
            />
          </div>
        </Section>

        {/* The Dua */}
        <Section>
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-foreground">The One Dua</h2>
            <p className="text-base text-muted-foreground leading-relaxed">
              Aisha (may Allah be pleased with her) — the wife of the Prophet (ﷺ) who knew him
              most intimately — asked him a direct question: if she knew which night was Laylatul
              Qadr, what should she say? He did not give her a long list. He taught her one dua.
              That answer is still the answer for every Muslim who asks the same question today.
            </p>

            <div className="rounded-xl border border-accent/40 bg-accent/5 p-6 space-y-4 text-center">
              <p dir="rtl" lang="ar" className="text-2xl text-foreground leading-loose">
                اللَّهُمَّ إِنَّكَ عَفُوٌّ تُحِبُّ الْعَفْوَ فَاعْفُ عَنِّي
              </p>
              <p className="text-base text-muted-foreground italic">
                Allāhumma innaka ʿAfuwwun tuḥibbul-ʿafwa faʿfu ʿannī
              </p>
              <p className="text-base text-foreground">
                &ldquo;O Allah, You are Pardoning, You love to pardon, so pardon me.&rdquo;
              </p>
              <p className="text-sm text-muted-foreground">
                Jami at-Tirmidhi 3513 — Hasan Sahih, narrated by Aisha (may Allah be pleased with her)
              </p>
            </div>

            <p className="text-base text-muted-foreground leading-relaxed">
              Repeat it throughout the night. In sujud. Between rakats. After every prayer. In the
              last third before Fajr, when Allah descends to the lowest heaven and asks: is there
              anyone seeking forgiveness that I may forgive them?
            </p>

            <Hadith
              text="Our Lord, Blessed and Most High, descends every night to the lowest heaven when the last third of the night remains, and He says: Who is calling upon Me that I may answer him? Who is asking from Me that I may give him? Who is seeking My forgiveness that I may forgive him?"
              source="Sahih al-Bukhari 1145, Sahih Muslim 758"
            />
          </div>
        </Section>

        {/* What to do */}
        <Section>
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-foreground">What to Do These Nights</h2>
            <p className="text-base text-muted-foreground leading-relaxed">
              The Prophet (ﷺ) did not spend the last ten nights passively hoping. He structured
              them. He intensified. He stayed up. He woke his family. There is a pattern in how
              the righteous have approached these nights across every generation, and it is not
              complicated.
            </p>

            <div className="space-y-4">
              {[
                {
                  title: 'Qiyam ul-Layl — Night Prayer',
                  body: 'Stand in prayer after Isha and before Fajr. Even two rakats in the last third of the night, prayed with presence and sincerity, carry enormous weight. The Prophet (ﷺ) prayed in sets of two, ending with Witr.',
                },
                {
                  title: 'The Dua of These Nights',
                  body: 'Repeat the dua Aisha (RA) was taught — Allāhumma innaka ʿAfuwwun — throughout the night. In sujud, between tashahhud and tasleem, in the last third. Ask for pardon directly and persistently.',
                },
                {
                  title: 'Dhikr and Istighfar',
                  body: 'Fill the time between prayers with remembrance. SubhanAllah. Alhamdulillah. Allahu Akbar. Astaghfirullah. La ilaha illallah. These are light on the tongue and heavy on the scale.',
                },
                {
                  title: 'Recitation of the Quran',
                  body: 'Read slowly and with reflection. Surah Al-Qadr (97) about this very night. Surah Al-Mulk (67), which the Prophet (ﷺ) never slept without. Surah Al-Muzzammil (73) on night prayer. Whatever opens your heart.',
                },
                {
                  title: "Iʿtikaf — Seclusion in the Masjid",
                  body: "The Prophet (ﷺ) observed Iʿtikaf in the last ten days of Ramadan every year until he passed, then his wives continued after him. If possible, even a few hours of intentional seclusion and worship carries the spirit of it.",
                },
              ].map((item) => (
                <div key={item.title} className="space-y-1">
                  <p className="text-base font-semibold text-foreground">{item.title}</p>
                  <p className="text-base text-muted-foreground leading-relaxed">{item.body}</p>
                </div>
              ))}
            </div>

            <Hadith
              arabic="أَحَبُّ الأَعْمَالِ إِلَى اللَّهِ أَدْوَمُهَا وَإِنْ قَلَّ"
              text="The most beloved deeds to Allah are the most consistent, even if they are small."
              source="Sahih al-Bukhari 6465, narrated by Aisha (may Allah be pleased with her)"
            />
          </div>
        </Section>

        {/* The Quran's connection */}
        <Section>
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-foreground">The Quran and This Night</h2>
            <p className="text-base text-muted-foreground leading-relaxed">
              The Quran was not revealed over years on ordinary nights. It began on Laylatul Qadr.
              The connection between this book and this night is not incidental — it is the origin
              of everything that followed. Every year, Jibreel (peace be upon him) would descend
              and review the entire Quran with the Prophet (ﷺ). In the final year of his life,
              they reviewed it twice.
            </p>

            <Hadith
              arabic="كَانَ جِبْرِيلُ يَلْقَى النَّبِيَّ ﷺ فِي كُلِّ لَيْلَةٍ مِنْ رَمَضَانَ، فَيُدَارِسُهُ الْقُرْآنَ"
              text="Jibreel used to meet the Prophet (peace be upon him) every night of Ramadan and study the Quran with him."
              source="Sahih al-Bukhari 3220, narrated by Ibn Abbas (may Allah be pleased with him)"
            />

            <p className="text-base text-muted-foreground leading-relaxed">
              To recite the Quran on Laylatul Qadr is to touch the night with the very words
              that were born on it. Every letter carries its ten-fold reward — and on this night,
              that reward is multiplied by what Allah alone knows.
            </p>

            <Hadith
              arabic="مَنْ قَرَأَ حَرْفًا مِنْ كِتَابِ اللَّهِ فَلَهُ بِهِ حَسَنَةٌ وَالْحَسَنَةُ بِعَشْرِ أَمْثَالِهَا"
              text="Whoever reads one letter from the Book of Allah will receive one good deed, and that good deed will be multiplied by ten."
              source="Jami at-Tirmidhi 2910, narrated by Ibn Masud (may Allah be pleased with him)"
            />
          </div>
        </Section>

        {/* Sabeel */}
        <Section>
          <div className="space-y-5">
            <h2 className="text-2xl font-semibold text-foreground">Sabeel — A Companion for These Nights</h2>
            <p className="text-base text-muted-foreground leading-relaxed">
              Sabeel (سبيل — meaning path or way) is a minimal, offline-first app built to help
              a Muslim get the most from Ramadan — and especially from the last ten nights.
              No accounts. No advertisements. No social feeds. Everything runs on your device
              and stores nothing outside your browser.
            </p>

            <div className="pt-1 space-y-2">
              {[
                'Laylatul Qadr guide — duas, hadiths, recommended surahs, and a night checklist',
                'Laylatul Qadr adhkar — dhikr counter for the specific remembrances of these nights',
                'Quran reader with Uthmani script and juz-by-juz progress tracking',
                'Daily prayer log for all five salah',
                'Morning, evening, after-prayer, pre-sleep, and anxiety adhkar',
                'Works offline — no internet required after first load',
              ].map((item) => (
                <div key={item} className="flex gap-3 items-start">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-accent flex-shrink-0" />
                  <p className="text-base text-muted-foreground">{item}</p>
                </div>
              ))}
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
