import type { AdhkarCategory } from '@/types'

export interface Dhikr {
  id: string
  category: AdhkarCategory
  order: number
  arabic: string
  transliteration: string
  translation: string
  source: { text: string; grading: string }
  repetitions: number
  virtue: string
}

export const ADHKAR_DATA: Dhikr[] = [
  // ============================================================
  // MORNING ADHKAR (أذكار الصباح)
  // ============================================================
  {
    id: 'morning-01',
    category: 'morning',
    order: 1,
    arabic: 'أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لاَ إِلَـهَ إِلاَّ اللهُ وَحْدَهُ لاَ شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ',
    transliteration: "Asbahnā wa asbahal-mulku lillāh, walhamdu lillāh, lā ilāha illallāhu wahdahu lā sharīka lah, lahul-mulku wa lahul-hamd, wa huwa 'alā kulli shay'in qadīr",
    translation: 'We have entered a new day and with it all dominion belongs to Allah. Praise is to Allah. None has the right to be worshipped but Allah alone, with no partner. To Him belongs the dominion, and to Him is the praise, and He is Able to do all things.',
    source: { text: 'Muslim 2723', grading: 'Sahih' },
    repetitions: 1,
    virtue: 'Starting the day with remembrance of Allah',
  },
  {
    id: 'morning-02',
    category: 'morning',
    order: 2,
    arabic: 'اللَّهُمَّ بِكَ أَصْبَحْنَا، وَبِكَ أَمْسَيْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ وَإِلَيْكَ النُّشُورُ',
    transliteration: 'Allāhumma bika aṣbaḥnā, wa bika amsaynā, wa bika naḥyā, wa bika namūtu wa ilaykan-nushūr',
    translation: 'O Allah, by You we enter the morning, and by You we enter the evening, by You we live and by You we die, and to You is the resurrection.',
    source: { text: 'At-Tirmidhi 3391', grading: 'Sahih' },
    repetitions: 1,
    virtue: 'Acknowledging Allah as the source of life and death',
  },
  {
    id: 'morning-03',
    category: 'morning',
    order: 3,
    arabic: 'سُبْحَانَ اللهِ وَبِحَمْدِهِ',
    transliteration: 'Subḥānallāhi wa biḥamdih',
    translation: 'Glory is to Allah and praise is to Him.',
    source: { text: 'Muslim 2692', grading: 'Sahih' },
    repetitions: 100,
    virtue: 'Sins forgiven even if they are like the foam of the sea',
  },
  {
    id: 'morning-04',
    category: 'morning',
    order: 4,
    arabic: 'لاَ إِلَـهَ إِلاَّ اللهُ وَحْدَهُ لاَ شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ',
    transliteration: 'Lā ilāha illallāhu waḥdahu lā sharīka lah, lahul-mulku wa lahul-ḥamd, wa huwa ʿalā kulli shayʾin qadīr',
    translation: 'None has the right to be worshipped but Allah alone, with no partner. To Him belongs the dominion, and to Him is the praise, and He is Able to do all things.',
    source: { text: 'Al-Bukhari 3293, Muslim 2691', grading: 'Sahih' },
    repetitions: 10,
    virtue: 'Equal to freeing four slaves from the children of Ismail',
  },
  {
    id: 'morning-05',
    category: 'morning',
    order: 5,
    arabic: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ الْعَافِيَةَ فِي الدُّنْيَا وَالآخِرَةِ، اللَّهُمَّ إِنِّي أَسْأَلُكَ الْعَفْوَ وَالْعَافِيَةَ فِي دِينِي وَدُنْيَايَ وَأَهْلِي وَمَالِي',
    transliteration: "Allāhumma innī as'alukal-'āfiyata fid-dunyā wal-ākhirah. Allāhumma innī as'alukal-'afwa wal-'āfiyata fī dīnī wa dunyāya wa ahlī wa mālī",
    translation: "O Allah, I ask You for well-being in this world and the next. O Allah, I ask You for forgiveness and well-being in my religion, my worldly affairs, my family and my wealth.",
    source: { text: 'Abu Dawud 5074', grading: 'Sahih' },
    repetitions: 1,
    virtue: 'Comprehensive protection for all aspects of life',
  },
  {
    id: 'morning-06',
    category: 'morning',
    order: 6,
    arabic: 'بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ',
    transliteration: "Bismillāhilladhī lā yaḍurru ma'asmihi shay'un fil-arḍi wa lā fis-samā'i wa huwas-samī'ul-'alīm",
    translation: 'In the Name of Allah, with Whose Name nothing on earth or in heaven can cause harm, and He is the All-Hearing, the All-Knowing.',
    source: { text: 'At-Tirmidhi 3388', grading: 'Sahih' },
    repetitions: 3,
    virtue: 'Nothing will harm you that day',
  },

  // ============================================================
  // EVENING ADHKAR (أذكار المساء)
  // ============================================================
  {
    id: 'evening-01',
    category: 'evening',
    order: 1,
    arabic: 'أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لاَ إِلَـهَ إِلاَّ اللهُ وَحْدَهُ لاَ شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ',
    transliteration: "Amsaynā wa amsal-mulku lillāh, walḥamdu lillāh, lā ilāha illallāhu waḥdahu lā sharīka lah, lahul-mulku wa lahul-ḥamd, wa huwa 'alā kulli shay'in qadīr",
    translation: 'We have ended another day and with it all dominion belongs to Allah. Praise is to Allah. None has the right to be worshipped but Allah alone, with no partner.',
    source: { text: 'Muslim 2723', grading: 'Sahih' },
    repetitions: 1,
    virtue: 'Ending the day with remembrance of Allah',
  },
  {
    id: 'evening-02',
    category: 'evening',
    order: 2,
    arabic: 'اللَّهُمَّ بِكَ أَمْسَيْنَا، وَبِكَ أَصْبَحْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ وَإِلَيْكَ الْمَصِيرُ',
    transliteration: 'Allāhumma bika amsaynā, wa bika aṣbaḥnā, wa bika naḥyā, wa bika namūtu wa ilaykal-maṣīr',
    translation: 'O Allah, by You we enter the evening, and by You we enter the morning, by You we live and by You we die, and to You is the final return.',
    source: { text: 'At-Tirmidhi 3391', grading: 'Sahih' },
    repetitions: 1,
    virtue: 'Placing trust in Allah at the end of the day',
  },
  {
    id: 'evening-03',
    category: 'evening',
    order: 3,
    arabic: 'أَعُوذُ بِكَلِمَاتِ اللهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ',
    transliteration: "A'ūdhu bikalimātillāhit-tāmmāti min sharri mā khalaq",
    translation: 'I seek refuge in the Perfect Words of Allah from the evil of what He has created.',
    source: { text: 'Muslim 2708', grading: 'Sahih' },
    repetitions: 3,
    virtue: 'Protection from harm during the night',
  },
  {
    id: 'evening-04',
    category: 'evening',
    order: 4,
    arabic: 'سُبْحَانَ اللهِ وَبِحَمْدِهِ',
    transliteration: 'Subḥānallāhi wa biḥamdih',
    translation: 'Glory is to Allah and praise is to Him.',
    source: { text: 'Muslim 2692', grading: 'Sahih' },
    repetitions: 100,
    virtue: 'Sins forgiven even if they are like the foam of the sea',
  },
  {
    id: 'evening-05',
    category: 'evening',
    order: 5,
    arabic: 'بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ',
    transliteration: "Bismillāhilladhī lā yaḍurru ma'asmihi shay'un fil-arḍi wa lā fis-samā'i wa huwas-samī'ul-'alīm",
    translation: 'In the Name of Allah, with Whose Name nothing on earth or in heaven can cause harm, and He is the All-Hearing, the All-Knowing.',
    source: { text: 'At-Tirmidhi 3388', grading: 'Sahih' },
    repetitions: 3,
    virtue: 'Nothing will harm you that night',
  },

  // ============================================================
  // AFTER PRAYER ADHKAR (أذكار بعد الصلاة)
  // ============================================================
  {
    id: 'after_prayer-01',
    category: 'after_prayer',
    order: 1,
    arabic: 'أَسْتَغْفِرُ اللَّهَ',
    transliteration: 'Astaghfirullāh',
    translation: 'I seek the forgiveness of Allah.',
    source: { text: 'Muslim 591', grading: 'Sahih' },
    repetitions: 3,
    virtue: 'Seeking forgiveness immediately after prayer',
  },
  {
    id: 'after_prayer-02',
    category: 'after_prayer',
    order: 2,
    arabic: 'اللَّهُمَّ أَنْتَ السَّلاَمُ، وَمِنْكَ السَّلاَمُ، تَبَارَكْتَ يَا ذَا الْجَلاَلِ وَالإِكْرَامِ',
    transliteration: "Allāhumma antas-salām, wa minkas-salām, tabārakta yā dhal-jalāli wal-ikrām",
    translation: 'O Allah, You are Peace and from You comes peace. Blessed are You, O Owner of Majesty and Honour.',
    source: { text: 'Muslim 591', grading: 'Sahih' },
    repetitions: 1,
    virtue: 'The Prophet would say this before turning to face the people',
  },
  {
    id: 'after_prayer-03',
    category: 'after_prayer',
    order: 3,
    arabic: 'سُبْحَانَ اللهِ',
    transliteration: 'Subḥānallāh',
    translation: 'Glory is to Allah.',
    source: { text: 'Muslim 595', grading: 'Sahih' },
    repetitions: 33,
    virtue: 'Part of the tasbih after prayer',
  },
  {
    id: 'after_prayer-04',
    category: 'after_prayer',
    order: 4,
    arabic: 'الْحَمْدُ لِلَّهِ',
    transliteration: 'Alḥamdulillāh',
    translation: 'Praise is to Allah.',
    source: { text: 'Muslim 595', grading: 'Sahih' },
    repetitions: 33,
    virtue: 'Part of the tasbih after prayer',
  },
  {
    id: 'after_prayer-05',
    category: 'after_prayer',
    order: 5,
    arabic: 'اللهُ أَكْبَرُ',
    transliteration: 'Allāhu Akbar',
    translation: 'Allah is the Greatest.',
    source: { text: 'Muslim 595', grading: 'Sahih' },
    repetitions: 33,
    virtue: 'Part of the tasbih after prayer',
  },
  {
    id: 'after_prayer-06',
    category: 'after_prayer',
    order: 6,
    arabic: 'لاَ إِلَـهَ إِلاَّ اللهُ وَحْدَهُ لاَ شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ',
    transliteration: "Lā ilāha illallāhu waḥdahu lā sharīka lah, lahul-mulku wa lahul-ḥamd, wa huwa 'alā kulli shay'in qadīr",
    translation: 'None has the right to be worshipped but Allah alone, with no partner. To Him belongs the dominion, and to Him is the praise, and He is Able to do all things.',
    source: { text: 'Muslim 593', grading: 'Sahih' },
    repetitions: 1,
    virtue: 'Said after completing the tasbih to reach 100',
  },

  // ============================================================
  // BEFORE SLEEP ADHKAR (أذكار النوم)
  // ============================================================
  {
    id: 'before_sleep-01',
    category: 'before_sleep',
    order: 1,
    arabic: 'بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا',
    transliteration: 'Bismikallāhumma amūtu wa aḥyā',
    translation: 'In Your Name, O Allah, I die and I live.',
    source: { text: 'Al-Bukhari 6324', grading: 'Sahih' },
    repetitions: 1,
    virtue: 'The Prophet would say this when going to bed',
  },
  {
    id: 'before_sleep-02',
    category: 'before_sleep',
    order: 2,
    arabic: 'سُبْحَانَ اللهِ',
    transliteration: 'Subḥānallāh',
    translation: 'Glory is to Allah.',
    source: { text: 'Al-Bukhari 5362, Muslim 2727', grading: 'Sahih' },
    repetitions: 33,
    virtue: 'The Prophet advised Ali and Fatimah to say this before sleep',
  },
  {
    id: 'before_sleep-03',
    category: 'before_sleep',
    order: 3,
    arabic: 'الْحَمْدُ لِلَّهِ',
    transliteration: 'Alḥamdulillāh',
    translation: 'Praise is to Allah.',
    source: { text: 'Al-Bukhari 5362, Muslim 2727', grading: 'Sahih' },
    repetitions: 33,
    virtue: 'Better than having a servant to help you',
  },
  {
    id: 'before_sleep-04',
    category: 'before_sleep',
    order: 4,
    arabic: 'اللهُ أَكْبَرُ',
    transliteration: 'Allāhu Akbar',
    translation: 'Allah is the Greatest.',
    source: { text: 'Al-Bukhari 5362, Muslim 2727', grading: 'Sahih' },
    repetitions: 34,
    virtue: 'Complete the count of 100 with this',
  },
  {
    id: 'before_sleep-05',
    category: 'before_sleep',
    order: 5,
    arabic: 'اللَّهُمَّ قِنِي عَذَابَكَ يَوْمَ تَبْعَثُ عِبَادَكَ',
    transliteration: "Allāhumma qinī 'adhābaka yawma tab'athu 'ibādak",
    translation: "O Allah, save me from Your punishment on the Day when You resurrect Your servants.",
    source: { text: 'Abu Dawud 5045', grading: 'Sahih' },
    repetitions: 1,
    virtue: 'Protection from punishment on the Day of Judgment',
  },

  // ============================================================
  // ANXIETY & STRESS ADHKAR (أذكار القلق والتوتر)
  // ============================================================
  {
    id: 'anxiety-01',
    category: 'anxiety',
    order: 1,
    arabic: 'لاَ إِلَهَ إِلاَّ اللهُ الْعَظِيمُ الْحَلِيمُ، لاَ إِلَهَ إِلاَّ اللهُ رَبُّ الْعَرْشِ الْعَظِيمِ، لاَ إِلَهَ إِلاَّ اللهُ رَبُّ السَّمَوَاتِ وَرَبُّ الأَرْضِ وَرَبُّ الْعَرْشِ الْكَرِيمِ',
    transliteration: "Lā ilāha illallāhul-'aẓīmul-ḥalīm. Lā ilāha illallāhu rabbul-'arshil-'aẓīm. Lā ilāha illallāhu rabbus-samāwāti wa rabbul-arḍi wa rabbul-'arshil-karīm",
    translation: 'There is no deity but Allah, the Magnificent, the Tolerant. There is no deity but Allah, Lord of the Magnificent Throne. There is no deity but Allah, Lord of the heavens, Lord of the earth, and Lord of the Noble Throne.',
    source: { text: 'Al-Bukhari 6346, Muslim 2730', grading: 'Sahih' },
    repetitions: 1,
    virtue: "The Prophet's supplication in times of distress",
  },
  {
    id: 'anxiety-02',
    category: 'anxiety',
    order: 2,
    arabic: 'اللَّهُمَّ رَحْمَتَكَ أَرْجُو فَلاَ تَكِلْنِي إِلَى نَفْسِي طَرْفَةَ عَيْنٍ، وَأَصْلِحْ لِي شَأْنِي كُلَّهُ، لاَ إِلَهَ إِلاَّ أَنْتَ',
    transliteration: "Allāhumma raḥmataka arjū, falā takilnī ilā nafsī ṭarfata 'ayn, wa aṣliḥ lī sha'nī kullah, lā ilāha illā ant",
    translation: 'O Allah, it is Your mercy that I hope for, so do not leave me in charge of my affairs even for the blink of an eye, and rectify all of my affairs. There is no deity but You.',
    source: { text: 'Abu Dawud 5090', grading: 'Hasan' },
    repetitions: 1,
    virtue: 'Asking Allah to handle your affairs when overwhelmed',
  },
  {
    id: 'anxiety-03',
    category: 'anxiety',
    order: 3,
    arabic: 'لاَ إِلَهَ إِلاَّ أَنْتَ سُبْحَانَكَ إِنِّي كُنْتُ مِنَ الظَّالِمِينَ',
    transliteration: 'Lā ilāha illā anta subḥānaka innī kuntu minaẓ-ẓālimīn',
    translation: 'There is no deity but You. Glory is to You. Indeed, I have been of the wrongdoers.',
    source: { text: "Al-Anbiya' 21:87, At-Tirmidhi 3505", grading: 'Sahih' },
    repetitions: 1,
    virtue: "The supplication of Prophet Yunus — no Muslim makes this du'a for anything except that Allah answers it",
  },
  {
    id: 'anxiety-04',
    category: 'anxiety',
    order: 4,
    arabic: 'حَسْبُنَا اللهُ وَنِعْمَ الْوَكِيلُ',
    transliteration: "Ḥasbunallāhu wa ni'mal-wakīl",
    translation: 'Allah is sufficient for us and He is the best Disposer of affairs.',
    source: { text: 'Al-Bukhari 4563', grading: 'Sahih' },
    repetitions: 7,
    virtue: 'Said by Ibrahim when thrown into the fire, and by the Prophet when told of the enemy gathering',
  },
  {
    id: 'anxiety-05',
    category: 'anxiety',
    order: 5,
    arabic: 'اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ، وَأَعُوذُ بِكَ مِنَ الْعَجْزِ وَالْكَسَلِ، وَأَعُوذُ بِكَ مِنَ الْجُبْنِ وَالْبُخْلِ، وَأَعُوذُ بِكَ مِن غَلَبَةِ الدَّيْنِ وَقَهْرِ الرِّجَالِ',
    transliteration: "Allāhumma innī a'ūdhu bika minal-hammi wal-ḥazan, wa a'ūdhu bika minal-'ajzi wal-kasal, wa a'ūdhu bika minal-jubni wal-bukhl, wa a'ūdhu bika min ghalabatid-dayni wa qahrir-rijāl",
    translation: "O Allah, I seek refuge in You from worry and grief, from weakness and laziness, from cowardice and miserliness, from being overcome by debt and overpowered by men.",
    source: { text: 'Al-Bukhari 6369', grading: 'Sahih' },
    repetitions: 1,
    virtue: 'Comprehensive protection against anxiety, weakness, and oppression',
  },
]

export function getAdhkarByCategory(category: AdhkarCategory): Dhikr[] {
  return ADHKAR_DATA.filter((d) => d.category === category).sort((a, b) => a.order - b.order)
}

export const CATEGORIES: { id: AdhkarCategory; label: string; labelAr: string; icon: string }[] = [
  { id: 'morning', label: 'Morning', labelAr: 'أذكار الصباح', icon: '🌅' },
  { id: 'evening', label: 'Evening', labelAr: 'أذكار المساء', icon: '🌙' },
  { id: 'after_prayer', label: 'After Prayer', labelAr: 'أذكار بعد الصلاة', icon: '🕌' },
  { id: 'before_sleep', label: 'Before Sleep', labelAr: 'أذكار النوم', icon: '😴' },
  { id: 'anxiety', label: 'Anxiety & Stress', labelAr: 'أذكار القلق والتوتر', icon: '🤲' },
]
