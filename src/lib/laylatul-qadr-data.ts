// All Islamic content for the Laylatul Qadr feature.
// Sources are cited inline. Content is read-only — no state here.

export interface LaylahDua {
  id: string
  arabic: string
  transliteration: string
  translation: string
  source: string
  isPrimary?: boolean
}

export interface LaylahHadith {
  id: string
  arabic?: string
  text: string
  source: string
}

export interface LaylahSurah {
  number: number
  name: string
  arabicName: string
  ayaatCount: number
  reason: string
  keyAyaat?: string
}

// ─── Primary Dua ────────────────────────────────────────────────────────────
// The single dua the Prophet (ﷺ) taught Aisha (RA) specifically for Laylatul Qadr.
// Tirmidhi 3513, Hasan Sahih.

export const PRIMARY_DUA: LaylahDua = {
  id: 'lq-primary',
  arabic: 'اللَّهُمَّ إِنَّكَ عَفُوٌّ تُحِبُّ الْعَفْوَ فَاعْفُ عَنِّي',
  transliteration: 'Allahumma innaka ʿAfuwwun tuḥibbul-ʿafwa faʿfu ʿannī',
  translation: 'O Allah, You are Pardoning, You love to pardon, so pardon me.',
  source: 'Jami at-Tirmidhi 3513 — Hasan Sahih, narrated by Aisha (may Allah be pleased with her)',
  isPrimary: true,
}

// ─── Additional Duas ─────────────────────────────────────────────────────────

export const LAYLAH_DUAS: LaylahDua[] = [
  PRIMARY_DUA,
  {
    id: 'lq-dua-rabbana',
    arabic: 'رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ',
    transliteration: 'Rabbanā ātinā fid-dunyā ḥasanatan wa fil-ākhirati ḥasanatan wa qinā ʿadhāban-nār',
    translation: 'Our Lord, give us good in this world and good in the Hereafter and protect us from the punishment of the Fire.',
    source: 'Quran — Surah Al-Baqarah 2:201',
  },
  {
    id: 'lq-dua-forgiveness-all',
    arabic: 'اللَّهُمَّ اغْفِرْ لِي ذَنْبِي كُلَّهُ، دِقَّهُ وَجِلَّهُ، وَأَوَّلَهُ وَآخِرَهُ، وَعَلاَنِيَتَهُ وَسِرَّهُ',
    transliteration: "Allāhummaghfir lī dhanbī kullahu, diqqahu wa jillahu, wa awwalahu wa ākhirahu, wa ʿalāniyatahu wa sirrahu",
    translation: 'O Allah, forgive me all of my sins — the small and the great, the first and the last, the open and the hidden.',
    source: 'Sahih Muslim 483',
  },
  {
    id: 'lq-dua-fire',
    arabic: 'اللَّهُمَّ أَجِرْنِي مِنَ النَّارِ',
    transliteration: 'Allāhumma ajirni minan-nār',
    translation: 'O Allah, save me from the Fire.',
    source: 'Abu Dawud 5079 — recite 7 times after Fajr and Maghrib',
  },
  {
    id: 'lq-dua-guidance',
    arabic: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ الْهُدَى وَالتُّقَى وَالْعَفَافَ وَالْغِنَى',
    transliteration: "Allāhumma innī asʾalukal-hudā wat-tuqā wal-ʿafāfa wal-ghinā",
    translation: 'O Allah, I ask You for guidance, piety, chastity, and contentment.',
    source: 'Sahih Muslim 2721',
  },
]

// ─── Hadiths ─────────────────────────────────────────────────────────────────

export const LAYLAH_HADITHS: LaylahHadith[] = [
  {
    id: 'lq-hadith-forgiveness',
    arabic: 'مَنْ قَامَ لَيْلَةَ الْقَدْرِ إِيمَانًا وَاحْتِسَابًا، غُفِرَ لَهُ مَا تَقَدَّمَ مِنْ ذَنْبِهِ',
    text: 'Whoever stands in prayer during Laylatul Qadr with faith and hoping for reward, all his previous sins will be forgiven.',
    source: 'Sahih al-Bukhari 2014, Sahih Muslim 760',
  },
  {
    id: 'lq-hadith-odd-nights',
    text: 'Seek it (Laylatul Qadr) in the odd nights of the last ten nights of Ramadan.',
    source: 'Sahih al-Bukhari 2017',
  },
  {
    id: 'lq-hadith-itikaf',
    text: 'The Prophet (ﷺ) used to observe Iʿtikaf in the last ten days of Ramadan until Allah took his soul, then his wives observed Iʿtikaf after him.',
    source: 'Sahih al-Bukhari 2026, Sahih Muslim 1172',
  },
  {
    id: 'lq-hadith-ihya',
    arabic: 'كَانَ النَّبِيُّ ﷺ إِذَا دَخَلَ الْعَشْرُ شَدَّ مِئْزَرَهُ، وَأَحْيَا لَيْلَهُ، وَأَيْقَظَ أَهْلَهُ',
    text: 'When the last ten days began, the Prophet (ﷺ) would tighten his waist-wrapper, stay up at night, and wake his family.',
    source: 'Sahih al-Bukhari 2024, Sahih Muslim 1174 — narrated by Aisha (may Allah be pleased with her)',
  },
  {
    id: 'lq-hadith-signs',
    text: 'The sign of Laylatul Qadr is that it is a serene, clear night — neither hot nor cold — and the sun rises the following morning faint and reddish, without rays.',
    source: 'Sahih Ibn Khuzaymah 2190, graded Hasan',
  },
]

// ─── Recommended Surahs ───────────────────────────────────────────────────────

export const LAYLAH_SURAHS: LaylahSurah[] = [
  {
    number: 97,
    name: "Al-Qadr",
    arabicName: "الْقَدْر",
    ayaatCount: 5,
    reason: "This surah IS about Laylatul Qadr — Allah Himself describes the night. Recite slowly, repeatedly, pondering every word.",
    keyAyaat: "The Night of Decree is better than a thousand months. (97:3)",
  },
  {
    number: 44,
    name: "Ad-Dukhan",
    arabicName: "الدُّخَان",
    ayaatCount: 59,
    reason: "Refers directly to Laylatul Qadr: \"Indeed, We sent it down during a blessed night.\" (44:3). The Quran's revelation on this night is the central event.",
    keyAyaat: "On that night is made distinct every precise matter. (44:4)",
  },
  {
    number: 73,
    name: "Al-Muzzammil",
    arabicName: "الْمُزَّمِّل",
    ayaatCount: 20,
    reason: "Allah commands standing in night prayer in this surah. \"Rise to pray the night, except for a little.\" (73:2). The foundation of Qiyam ul-Layl.",
  },
  {
    number: 67,
    name: "Al-Mulk",
    arabicName: "الْمُلْك",
    ayaatCount: 30,
    reason: "The Prophet (ﷺ) never slept until he had recited this surah. It intercedes for its reader until they are forgiven.",
    keyAyaat: "Blessed is He in Whose Hand is the dominion. (67:1)",
  },
  {
    number: 32,
    name: "As-Sajdah",
    arabicName: "السَّجْدَة",
    ayaatCount: 30,
    reason: "The Prophet (ﷺ) recited this in Qiyam during the last 10 nights. Contains a verse of prostration — deeply powerful in night prayer.",
  },
  {
    number: 76,
    name: "Al-Insan",
    arabicName: "الْإِنسَان",
    ayaatCount: 31,
    reason: "Paired with As-Sajdah for Qiyam. Describes the rewards of the righteous in Jannah — a reminder of what we are striving for.",
  },
  {
    number: 2,
    name: "Al-Baqarah",
    arabicName: "الْبَقَرَة",
    ayaatCount: 286,
    reason: "The greatest surah of the Quran. Contains Ayat al-Kursi, the dua of Ibrahim, and the closing duas. \"Recite Al-Baqarah, for taking it is a blessing.\" (Muslim 804)",
    keyAyaat: "Ayat al-Kursi (2:255), Amana Rasul (2:285-286)",
  },
  {
    number: 112,
    name: "Al-Ikhlas + Al-Falaq + An-Nas",
    arabicName: "الْإِخْلَاص وَالْمُعَوِّذَتَان",
    ayaatCount: 15,
    reason: "The Prophet (ﷺ) recited these three surahs three times after Fajr and Maghrib. Recite 3x before sleeping each odd night.",
  },
]

// ─── Qiyam ul-Layl Guide ─────────────────────────────────────────────────────

export const QIYAM_GUIDE = {
  what: "Standing in voluntary prayer after Isha, between the setting of the sun and the rising of Fajr. On Laylatul Qadr, the Prophet (ﷺ) said it causes all previous sins to be forgiven.",
  bestTime: "The last third of the night — from approximately 90 minutes before Fajr until the Adhan of Fajr. The exact time is calculated from: Fajr − (Fajr − Maghrib) ÷ 3.",
  rakats: [
    "The Prophet (ﷺ) prayed 11 rakats: 8 in pairs of 2, then 3 Witr.",
    "You may pray as few as 2 rakats — there is no upper limit.",
    "Quality and presence of heart matters more than quantity.",
    "Witr is Wajib (Hanafi) or Sunnah Mu'akkadah (others) — do not leave it.",
  ],
  recitation: [
    "Long surahs recited slowly with pondering are superior to rushing through short ones.",
    "Recommended: As-Sajdah + Al-Insan, Al-Muzzammil, Al-Mulk.",
    "In sujud (prostration): make long, heartfelt personal dua.",
  ],
  salatul_tasbih: "A special prayer of 4 rakats in which \"Subhanallahi wal-hamdu lillahi wa la ilaha illallahu wallahu akbar\" is recited 75 times per rakat (300 total). Highly recommended for these nights.",
}

// ─── Night Checklist Items ───────────────────────────────────────────────────

export interface ChecklistItem {
  key: string
  label: string
  description?: string
}

export const NIGHT_CHECKLIST_ITEMS: ChecklistItem[] = [
  { key: 'prayedQiyam', label: 'Prayed Qiyam ul-Layl', description: 'Night prayer after Isha' },
  { key: 'completedWitr', label: 'Completed Witr' },
  { key: 'readQuran', label: 'Read Quran', description: 'With pondering and reflection' },
  { key: 'madeDua', label: 'Made the Laylatul Qadr Dua', description: 'Allahumma innaka Afuwwun...' },
  { key: 'gaveSadaqah', label: 'Gave Sadaqah', description: 'Charity multiplied on these nights' },
]

export type NightChecklistState = Record<string, boolean>
