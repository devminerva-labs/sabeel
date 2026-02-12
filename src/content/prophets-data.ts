export interface ProphetStory {
  id: string
  name: string
  nameAr: string
  title: string
  summary: string
  surahs: { name: string; number: number; note: string }[]
  sections: {
    heading: string
    body: string
    arabic?: string
    source?: string
  }[]
  ramadanLesson: string
}

export const PROPHET_STORIES: ProphetStory[] = [
  // ── 1. Adam ──────────────────────────────────────────────────
  {
    id: 'adam',
    name: 'Adam',
    nameAr: 'آدم عليه السلام',
    title: 'The First Human and the First Tawbah',
    summary: 'Allah created Adam with His own two hands, breathed into him from His spirit, and taught him what no angel knew. His story is the story of every human being — creation, test, error, and return.',
    surahs: [
      { name: 'Al-Baqarah', number: 2, note: 'Creation, the garden, and the descent (2:30–39)' },
      { name: "Al-A'raf", number: 7, note: 'Full account of creation and Iblis (7:11–27)' },
      { name: 'Ta-Ha', number: 20, note: "Adam's repentance and guidance (20:115–122)" },
      { name: "Al-Hijr", number: 15, note: "Iblis's arrogance (15:26–42)" },
      { name: 'Sad', number: 38, note: "Iblis's defiance and his vow (38:71–85)" },
    ],
    sections: [
      {
        heading: 'Created by the Hands of Allah',
        body: "Allah said to Iblis: 'What prevented you from prostrating to what I created with My own two hands?' (Sad 38:75). No other creature in the Quran is described this way. Adam was fashioned from clay, then Allah breathed into him from His spirit — the moment a lifeless body became a living, thinking, feeling human being. Then Allah taught Adam the names of all things — the capacity for language, knowledge, and reasoning — and tested the angels with this knowledge. They could not answer. Allah said: 'I know what you do not know.' (Al-Baqarah 2:30).",
        arabic: 'وَعَلَّمَ آدَمَ الْأَسْمَاءَ كُلَّهَا ثُمَّ عَرَضَهُمْ عَلَى الْمَلَائِكَةِ',
        source: 'Al-Baqarah 2:31',
      },
      {
        heading: "Iblis's Arrogance — The Root of All Evil",
        body: "When Allah commanded the angels to prostrate to Adam, all obeyed. Iblis refused. He said: 'I am better than him — You created me from fire and created him from clay.' (Al-Araf 7:12). This was the first act of arrogance in creation. Mufti Menk emphasises: Iblis was not punished for making a mistake — he was punished for his pride. He refused to admit fault. He refused to repent. He then asked only to be given time to misguide humanity. His entire goal became revenge against Adam's descendants.",
      },
      {
        heading: 'The Test in the Garden',
        body: "Adam and Hawwa were placed in Jannah and given complete freedom — except one tree. Iblis whispered to them, swearing by Allah that he was sincere, promising eternal life if they ate. They were deceived. They ate. The moment they did, their garments were stripped and they felt shame for the first time. The Quran says they began to cover themselves with leaves from the garden.",
      },
      {
        heading: 'The First and Most Important Repentance',
        body: "Adam did not make excuses. He did not blame Iblis, or Hawwa, or the circumstances. He turned to Allah with his whole heart and said words that Allah Himself taught him. This is the power of true tawbah — it is never too late, and no sin is too great. Allah accepted Adam's repentance, then chose him, guided him, and made him a prophet.",
        arabic: 'رَبَّنَا ظَلَمْنَا أَنفُسَنَا وَإِن لَّمْ تَغْفِرْ لَنَا وَتَرْحَمْنَا لَنَكُونَنَّ مِنَ الْخَاسِرِينَ',
        source: "Al-A'raf 7:23 — Our Lord, we have wronged ourselves. If You do not forgive us and have mercy upon us, we will surely be among the losers.",
      },
    ],
    ramadanLesson: "The story of Adam begins in Ramadan's spirit. Every night in Ramadan, the gates of heaven are open and the gates of hell are locked. Allah descends and calls: Is there anyone seeking forgiveness? Make the du'a of Adam. Acknowledge your wrongs without making excuses. Allah is more ready to forgive than you are to ask.",
  },

  // ── 2. Idris ─────────────────────────────────────────────────
  {
    id: 'idris',
    name: 'Idris',
    nameAr: 'إدريس عليه السلام',
    title: 'The Patient Scholar Raised to a High Station',
    summary: "Idris is one of the earliest prophets, praised in the Quran as truthful and patient. He was raised to a high station — a distinction only given to him among all creation.",
    surahs: [
      { name: 'Maryam', number: 19, note: 'Praised as truthful and a prophet (19:56–57)' },
      { name: "Al-Anbiya", number: 21, note: 'Listed among the patient and righteous (21:85–86)' },
    ],
    sections: [
      {
        heading: "A Man of Truth and Patience",
        body: "The Quran says about Idris: 'Mention in the Book Idris. Indeed he was a man of truth and a prophet. And We raised him to a high station.' (Maryam 19:56–57). He is mentioned alongside Ibrahim, Ismail, and Ishaq as among those whom Allah blessed and chose. The hadith literature describes him as the first person to write with a pen, and he was known for his deep knowledge and constant worship.",
        arabic: 'وَاذْكُرْ فِي الْكِتَابِ إِدْرِيسَ إِنَّهُ كَانَ صِدِّيقًا نَّبِيًّا وَرَفَعْنَاهُ مَكَانًا عَلِيًّا',
        source: 'Maryam 19:56–57',
      },
      {
        heading: "Raised to a High Station",
        body: "On the Night of Isra wal-Miraj, the Prophet Muhammad ﷺ passed by Idris in the fourth heaven. Idris greeted him and said: 'Welcome, O righteous brother and righteous prophet.' (Bukhari, Muslim). This is the highest station described for any of the early prophets — raised by Allah due to his worship, knowledge, and sincerity.",
      },
      {
        heading: "The Lesson of Perseverance",
        body: "The Quran places Idris in Surah Al-Anbiya among the prophets who were patient — alongside Ismail, Dhul-Kifl, Ayyub, and Yunus. Patience in obedience, in knowledge, and in worship is what defines their rank. Idris was not given armies or kingdoms. He was given depth of character and elevation before Allah.",
      },
    ],
    ramadanLesson: "Idris is the prophet of consistent, daily worship. The best deeds to Allah are those done consistently, even if they are small. In Ramadan, set practices you can maintain every single day — even after the month ends. Consistency is the mark of the righteous.",
  },

  // ── 3. Nuh ───────────────────────────────────────────────────
  {
    id: 'nuh',
    name: 'Nuh',
    nameAr: 'نوح عليه السلام',
    title: '950 Years of Calling — and Then the Flood',
    summary: "Nuh called his people for 950 years. He tried every method — public and private, day and night. He was one of the five ulul-azm (the firmest in resolve) among the prophets.",
    surahs: [
      { name: 'Nuh', number: 71, note: 'Dedicated surah — his full da\'wah and du\'a' },
      { name: 'Hud', number: 11, note: 'Building the ark, the flood, his son (11:25–49)' },
      { name: "Al-A'raf", number: 7, note: "His people's rejection (7:59–64)" },
      { name: 'Ash-Shuara', number: 26, note: 'The dialogue with his people (26:105–122)' },
      { name: 'Al-Muminun', number: 23, note: 'His prophethood and the ark (23:23–30)' },
      { name: 'Al-Qamar', number: 54, note: 'His people called him mad (54:9–17)' },
    ],
    sections: [
      {
        heading: '950 Years of Da\'wah',
        body: "The Quran tells us Nuh remained among his people for 950 years (Al-Ankabut 29:14). He called them publicly and privately, during the day and at night, using speech, warnings, and reminders of Allah's blessings. Yet the majority refused. The wealthy and powerful said they would only listen if he sent away the poor and weak who followed him. Nuh refused.",
        arabic: 'فَلَبِثَ فِيهِمْ أَلْفَ سَنَةٍ إِلَّا خَمْسِينَ عَامًا',
        source: 'Al-Ankabut 29:14',
      },
      {
        heading: 'Building the Ark',
        body: "After centuries of da\'wah, Allah revealed to Nuh: 'None of your people will believe except those who have already believed, so do not be distressed by what they have been doing.' (Hud 11:36). Then came the command to build the ark. The people mocked him — he was building a huge ship in the middle of the land, far from any sea. He told them: 'You mock us, but we will mock you just as you mock.' (Hud 11:38).",
      },
      {
        heading: 'His Son Who Refused',
        body: "Among the most painful moments in the Quran: Nuh called out to his own son to board the ark. His son replied: 'I will take refuge on a mountain to protect me from the water.' Nuh said: 'There is no protector today from the decree of Allah.' A wave came between them and his son drowned. Nuh then cried out to Allah: 'My Lord, my son is of my family.' Allah replied: 'He is not of your family — indeed, he was of unrighteous conduct.' (Hud 11:45–46). Faith, not blood, defines family before Allah.",
        arabic: 'وَنَادَىٰ نُوحٌ رَّبَّهُ فَقَالَ رَبِّ إِنَّ ابْنِي مِنْ أَهْلِي',
        source: 'Hud 11:45',
      },
      {
        heading: 'His Final Du\'a — for All Believers',
        body: "In Surah Nuh, after 950 years, Nuh finally made du\'a against his people: 'My Lord, do not leave upon the earth any inhabitant from among the disbelievers.' But before that, he made a beautiful du\'a for every believer — past and future: 'My Lord, forgive me and my parents and whoever enters my house as a believer, and the believing men and the believing women.' (Nuh 71:28). This du\'a is for all of us.",
        arabic: 'رَّبِّ اغْفِرْ لِي وَلِوَالِدَيَّ وَلِمَن دَخَلَ بَيْتِيَ مُؤْمِنًا وَلِلْمُؤْمِنِينَ وَالْمُؤْمِنَاتِ',
        source: 'Nuh 71:28',
      },
    ],
    ramadanLesson: "Nuh teaches that our job is da\'wah — the result belongs to Allah. After 950 years, only a small number believed. But Nuh never gave up, and he never compromised. In Ramadan, make du\'a for your family, your children, and every believer — as Nuh did. The du\'a that includes others is the most generous du\'a.",
  },

  // ── 4. Hud ───────────────────────────────────────────────────
  {
    id: 'hud',
    name: 'Hud',
    nameAr: 'هود عليه السلام',
    title: 'The Prophet of the People of Aad',
    summary: "Hud was sent to the people of Aad — a powerful civilization in the Arabian Peninsula. They were the tallest and strongest people of their time. They worshipped idols and rejected Allah's messenger.",
    surahs: [
      { name: 'Hud', number: 11, note: 'Core account of Hud and Aad (11:50–60)' },
      { name: "Al-A'raf", number: 7, note: "His call and their rejection (7:65–72)" },
      { name: 'Ash-Shuara', number: 26, note: 'Dialogue with the people of Aad (26:123–140)' },
      { name: 'Al-Ahqaf', number: 46, note: 'The punishment — the wind (46:21–26)' },
      { name: 'Al-Haqqah', number: 69, note: 'The destruction described (69:6–8)' },
    ],
    sections: [
      {
        heading: "A Mighty People Who Became Arrogant",
        body: "The people of Aad were given great physical power and built tall structures. They said: 'Who is greater than us in strength?' (Fussilat 41:15). Hud called them to worship Allah alone and to abandon their arrogance. He reminded them of their blessings — livestock, children, gardens, springs — and asked them to seek Allah's forgiveness. They refused and mocked him.",
        arabic: 'وَتَتَّخِذُونَ مَصَانِعَ لَعَلَّكُمْ تَخْلُدُونَ',
        source: 'Ash-Shuara 26:129 — You build monuments as if you will live forever.',
      },
      {
        heading: "Hud's Unshakeable Trust",
        body: "When his people threatened to harm him with their idols, Hud said one of the most powerful statements of tawakkul in the Quran: 'Indeed, I call upon Allah to be witness, and you be witnesses, that I am free from that which you associate with Allah. So plot against me all together — then do not give me respite. Indeed, I have relied upon Allah, my Lord and your Lord.' (Hud 11:54–56). He had zero fear because his trust was complete.",
        arabic: 'إِنِّي تَوَكَّلْتُ عَلَى اللَّهِ رَبِّي وَرَبِّكُم',
        source: 'Hud 11:56',
      },
      {
        heading: 'Destroyed by a Fierce Wind',
        body: "Allah sent against the people of Aad a violent wind for seven nights and eight days — a cold, howling wind that destroyed everything. The Quran says: 'You could see the people fallen as if they were hollow trunks of palm trees.' (Al-Haqqah 69:7). Hud and those who believed with him were saved. The ruins of their civilization — Al-Ahqaf — still exist in southern Arabia.",
      },
    ],
    ramadanLesson: "The people of Aad refused to acknowledge their blessings and became arrogant. In Ramadan, practice shukr — genuine gratitude. Go through the blessings of your health, your family, your sight, your mind. Aad had all of these and more, and still chose ingratitude. Gratitude is what distinguishes the believer.",
  },

  // ── 5. Salih ─────────────────────────────────────────────────
  {
    id: 'salih',
    name: 'Salih',
    nameAr: 'صالح عليه السلام',
    title: 'The She-Camel as a Sign',
    summary: "Salih was sent to the Thamud — a civilization that carved its homes directly into mountains. They asked Allah for a miracle as proof. The miracle was given. They destroyed it anyway.",
    surahs: [
      { name: 'Hud', number: 11, note: 'The she-camel and the warning (11:61–68)' },
      { name: "Al-A'raf", number: 7, note: "Salih's call to the Thamud (7:73–79)" },
      { name: 'Ash-Shuara', number: 26, note: 'The Thamud reject Salih (26:141–159)' },
      { name: 'An-Naml', number: 27, note: 'Nine men plot against Salih (27:45–53)' },
      { name: 'Ash-Shams', number: 91, note: 'They hamstrung the she-camel (91:11–15)' },
      { name: 'Al-Qamar', number: 54, note: 'The punishment of Thamud (54:23–31)' },
    ],
    sections: [
      {
        heading: 'A People Who Carved Mountains',
        body: "The Thamud were an advanced civilization who built their homes directly into rock mountains. They had power, resources, and skill. Salih came from among them — they knew him as a trustworthy young man before his prophethood. He called them to worship Allah alone and to be grateful. They asked him: if you are truly a prophet, produce from this rock a she-camel, pregnant, and already born.",
      },
      {
        heading: 'The Miracle Granted — and the Warning',
        body: "Allah gave them what they asked: a she-camel emerged from the rock. Salih told them: 'This is the she-camel of Allah — leave her to graze in Allah\'s land, and do not touch her with harm, lest a painful punishment seize you.' (Hud 11:64). The camel had water rights — on her day, no one else could use the water source. She was to live freely among them as a sign.",
        arabic: 'هَٰذِهِ نَاقَةُ اللَّهِ لَكُمْ آيَةً فَذَرُوهَا تَأْكُلْ فِي أَرْضِ اللَّهِ',
        source: 'Hud 11:64',
      },
      {
        heading: 'Three Days Remaining',
        body: "Nine men in the city plotted to kill the she-camel and Salih himself. They hamstrung her. Salih said: 'Enjoy yourselves in your home for three days — that is a promise not to be denied.' (Hud 11:65). Three days to repent. They did not. On the fourth day, a thunderous blast destroyed them all. Salih and the believers had already left.",
      },
    ],
    ramadanLesson: "The Thamud asked for a miracle and received it — then destroyed it out of arrogance. In Ramadan, reflect on the miracles Allah has already placed in your life. The Quran itself is the greatest miracle. Your heart that still beats, your breath, your capacity to fast. Do not ignore the signs that are already there.",
  },

  // ── 6. Ibrahim ───────────────────────────────────────────────
  {
    id: 'ibrahim',
    name: 'Ibrahim',
    nameAr: 'إبراهيم عليه السلام',
    title: 'Khalilullah — The Friend of Allah',
    summary: "Ibrahim was tested more than any prophet. He passed every test. He left his son in the desert, smashed the idols, was thrown into fire, and was commanded to sacrifice his son. At every point, he chose Allah.",
    surahs: [
      { name: 'Al-Baqarah', number: 2, note: "Building the Ka'bah with Ismail (2:124–129)" },
      { name: "Al-An'am", number: 6, note: 'His journey to tawhid (6:74–83)' },
      { name: 'Ibrahim', number: 14, note: 'Dedicated surah — his du\'as and legacy' },
      { name: 'Al-Anbiya', number: 21, note: 'Smashing the idols (21:51–73)' },
      { name: 'As-Saffat', number: 37, note: 'The sacrifice of Ismail (37:99–113)' },
      { name: "Al-Hajj", number: 22, note: "His call to mankind (22:26–27)" },
      { name: "Al-Mumtahanah", number: 60, note: 'The uswa (example) of Ibrahim (60:4)' },
    ],
    sections: [
      {
        heading: 'He Found Allah Through Reason',
        body: "Ibrahim was raised in a family of idol-worshippers. From his youth he rejected what his people inherited without proof. He observed the stars — beautiful, but they set. The moon — bright, but it disappeared. The sun — magnificent, but it too faded. He concluded: 'I have turned my face toward He who created the heavens and the earth, as a hanif — a natural monotheist.' (Al-Anam 6:79). His tawhid came through observation, reflection, and reason.",
        arabic: 'إِنِّي وَجَّهْتُ وَجْهِيَ لِلَّذِي فَطَرَ السَّمَاوَاتِ وَالْأَرْضَ حَنِيفًا',
        source: "Al-An'am 6:79",
      },
      {
        heading: 'Thrown Into the Fire',
        body: "Ibrahim smashed the idols of his people and left only the largest one intact — so they would have to admit the idols could not defend themselves. When brought before the king, he dismantled their arguments. They sentenced him to be burned. They gathered wood for days. Allah commanded: 'O fire, be coolness and safety upon Ibrahim.' (Al-Anbiya 21:69). The fire did not harm him. Iblis could not even approach him.",
        arabic: 'قُلْنَا يَا نَارُ كُونِي بَرْدًا وَسَلَامًا عَلَىٰ إِبْرَاهِيمَ',
        source: 'Al-Anbiya 21:69',
      },
      {
        heading: 'Leaving His Family in the Desert',
        body: "By Allah\'s command, Ibrahim took his wife Hajar and his infant son Ismail to a barren valley — no water, no people, no vegetation. He left them there and began to walk away. Hajar called out: 'O Ibrahim, where are you going? Are you leaving us here?' He did not answer. She asked: 'Has Allah commanded you with this?' He said yes. She said: 'Then He will not abandon us.' Her trust in Allah was immediate and complete. She began to run between Safa and Marwa — and Allah caused Zamzam to spring from the earth.",
      },
      {
        heading: 'The Sacrifice of Ismail',
        body: "After all of this, Ibrahim received the most personal test: a vision commanding him to sacrifice his own son. He told Ismail openly. Ismail — who had been tested himself his whole life — said: 'O my father, do what you are commanded. You will find me, if Allah wills, among the patient.' (As-Saffat 37:102). As Ibrahim prepared to carry out the command, Allah called out that he had fulfilled the vision, and redeemed Ismail with a great sacrifice. Ibrahim had passed.",
        arabic: 'يَا أَبَتِ افْعَلْ مَا تُؤْمَرُ سَتَجِدُنِي إِن شَاءَ اللَّهُ مِنَ الصَّابِرِينَ',
        source: 'As-Saffat 37:102',
      },
    ],
    ramadanLesson: "Ibrahim's life was worship — not just acts of worship, but a life in which every decision reflected his relationship with Allah. This is the spirit of Ramadan: bring Allah into your conversations, your choices, your sacrifices. The Prophet ﷺ said Ibrahim is the best of all the prophets after Muhammad ﷺ. Recite salawat upon Ibrahim every day — it is part of every prayer.",
  },

  // ── 7. Lut ───────────────────────────────────────────────────
  {
    id: 'lut',
    name: 'Lut',
    nameAr: 'لوط عليه السلام',
    title: 'A Lone Prophet in a City of Corruption',
    summary: "Lut was sent to a people who had fallen into a sin no nation before them had committed. He called them for years. They rejected him. When the angels came, his own wife betrayed them.",
    surahs: [
      { name: 'Hud', number: 11, note: 'The angels visit Lut and the destruction (11:77–83)' },
      { name: "Al-A'raf", number: 7, note: "His message and their response (7:80–84)" },
      { name: "Al-Hijr", number: 15, note: "The angels reassure Lut (15:57–77)" },
      { name: 'Ash-Shuara', number: 26, note: "Lut's call to his people (26:160–175)" },
      { name: "An-Naml", number: 27, note: "Lut saved, his wife destroyed (27:54–58)" },
    ],
    sections: [
      {
        heading: 'A Sin No Nation Had Done Before',
        body: "The Quran states: 'Do you commit a lewdness which no one in all the worlds has preceded you in?' (Al-Araf 7:80). Lut was sent specifically to address a moral collapse. He was a minority of one in his community, with only a handful of believers. His wife, who appeared to be with him, was actually an informant for the people and was not a believer.",
      },
      {
        heading: 'The Night the Angels Came',
        body: "Three angels came to Lut in the form of handsome young men. Lut was distressed — he knew his people and feared for his guests. He said: 'This is a distressful day.' (Hud 11:77). He pleaded with his people at the door to protect his guests. They ignored him and pushed forward. The angels told Lut to leave at night with his family and not look back. His wife looked back and was destroyed.",
      },
      {
        heading: "Allah's Justice and Mercy",
        body: "The cities of Sodom were turned upside down — raised into the sky and brought crashing to the earth. Brimstone rained down upon them. The Quran says the ruins of these cities were left as a sign on a road that people still travel. The message is clear: no civilization is safe when it normalises what Allah has forbidden. But the mercy is also clear — Lut and his believing family were saved before the destruction came.",
      },
    ],
    ramadanLesson: "Lut shows the test of being a believer in an environment that has normalised wrong. He never abandoned his message or his character, even when he was isolated. In Ramadan, evaluate your environment. Do not let surroundings define what is normal for you. Your standard is what pleases Allah.",
  },

  // ── 8. Ismail ────────────────────────────────────────────────
  {
    id: 'ismail',
    name: 'Ismail',
    nameAr: 'إسماعيل عليه السلام',
    title: 'The Obedient Son and Father of the Arabs',
    summary: "Ismail was left as an infant in a barren valley, grew up to help his father build the Ka'bah, and willingly submitted to being sacrificed. His entire life was a lesson in submission to Allah.",
    surahs: [
      { name: 'Al-Baqarah', number: 2, note: "Building the Ka'bah with Ibrahim (2:127–129)" },
      { name: 'Maryam', number: 19, note: 'Praised as truthful to his promise (19:54–55)' },
      { name: 'Al-Anbiya', number: 21, note: 'Among the righteous and patient (21:85)' },
      { name: 'As-Saffat', number: 37, note: 'The sacrifice — his submission (37:100–107)' },
    ],
    sections: [
      {
        heading: 'Left in the Valley — and Zamzam',
        body: "As an infant, Ismail was left with his mother Hajar in the valley of Makkah by his father Ibrahim, under Allah\'s command. Hajar ran between Safa and Marwa seven times searching for water. Allah caused the spring of Zamzam to burst from beneath Ismail\'s feet. This water has never run dry in over four thousand years. Pilgrims drink it to this day.",
      },
      {
        heading: "Truthful to His Promise",
        body: "The Quran specifically praises Ismail for being truthful to his promise: 'He used to enjoin on his people prayer and zakah, and was pleasing to his Lord.' (Maryam 19:55). Ismail is known as the one who said what he meant and did what he said. He is also one of the six prophets specifically praised in Surah Al-Anam.",
        arabic: 'وَاذْكُرْ فِي الْكِتَابِ إِسْمَاعِيلَ إِنَّهُ كَانَ صَادِقَ الْوَعْدِ وَكَانَ رَسُولًا نَّبِيًّا',
        source: 'Maryam 19:54',
      },
      {
        heading: "Building the House of Allah",
        body: "When Ismail was older, Ibrahim returned to him. Together, they raised the foundations of the Ka\'bah — the first house established for the worship of Allah. As they built, they made a du\'a that has echoed through every generation: 'Our Lord, accept this from us. You are the All-Hearing, the All-Knowing. Our Lord, make us Muslims, submitting to You, and from our descendants a Muslim nation, and show us our rites of worship, and accept our repentance.' (Al-Baqarah 2:127–128).",
        arabic: 'رَبَّنَا تَقَبَّلْ مِنَّا إِنَّكَ أَنتَ السَّمِيعُ الْعَلِيمُ',
        source: 'Al-Baqarah 2:127',
      },
    ],
    ramadanLesson: "Ismail is the prophet of total submission — Islam in its truest sense. When his father said: Allah has commanded me to sacrifice you, his immediate response was: do it. No hesitation. No negotiation. This is the rank of submission that Ramadan trains us toward. Every fast is a practice of: Allah said do it, so I do it.",
  },

  // ── 9. Ishaq ─────────────────────────────────────────────────
  {
    id: 'ishaq',
    name: 'Ishaq',
    nameAr: 'إسحاق عليه السلام',
    title: 'The Gift Announced by Angels',
    summary: "Ishaq was born as a divine gift to Ibrahim and his wife Sara, announced by angels when she was elderly. He became a prophet and the father of Yaqub — the continuation of the prophetic line.",
    surahs: [
      { name: 'Hud', number: 11, note: 'Angels announce his birth to Sara (11:71–73)' },
      { name: 'As-Saffat', number: 37, note: 'Given as a glad tiding (37:112–113)' },
      { name: "Al-An'am", number: 6, note: "Among the prophets Allah guided (6:84)" },
      { name: 'Al-Anbiya', number: 21, note: 'Made righteous and a prophet (21:72)' },
    ],
    sections: [
      {
        heading: "Born to an Elderly Woman",
        body: "When the angels came to Ibrahim before going to the people of Lut, they gave him glad tidings of a son named Ishaq. Ibrahim\'s wife Sara laughed in astonishment — she was elderly and barren. The angels said: 'Do you wonder at the decree of Allah? The mercy of Allah and His blessings are upon you, people of the house. Indeed, He is Praiseworthy and Honorable.' (Hud 11:73). Nothing is impossible for Allah.",
        arabic: 'فَبَشَّرْنَاهُ بِإِسْحَاقَ نَبِيًّا مِّنَ الصَّالِحِينَ',
        source: 'As-Saffat 37:112 — We gave him glad tidings of Ishaq as a prophet among the righteous.',
      },
      {
        heading: 'A Continuation of the Prophetic Line',
        body: "The Quran says Allah gave Ibrahim both Ishaq and Yaqub as further gifts: 'And We gave him Ishaq and Yaqub in addition, and all of them We made righteous.' (Al-Anbiya 21:72). Ishaq is the father of Yaqub, who is the father of Yusuf and all the sons of Israel. The entire prophetic lineage of Bani Israel — Musa, Harun, Dawud, Sulayman, Zakariyya, Yahya, Isa — traces back to Ishaq.",
      },
    ],
    ramadanLesson: "Ishaq teaches that du\'a is answered — even when circumstances seem impossible. Ibrahim had been making du\'a for righteous offspring his entire life. The answer came when he was old, through an elderly wife no one thought could conceive. Make your du\'as in Ramadan even for the things that seem impossible. Allah hears.",
  },

  // ── 10. Yaqub ────────────────────────────────────────────────
  {
    id: 'yaqub',
    name: 'Yaqub',
    nameAr: 'يعقوب عليه السلام',
    title: 'A Father\'s Grief and a Prophet\'s Patience',
    summary: "Yaqub is the father of Yusuf and eleven other sons. He endured the loss of his most beloved son for decades, went blind from grief, yet never lost hope in Allah.",
    surahs: [
      { name: 'Yusuf', number: 12, note: 'His grief, his patience, and his reunion (12:4–101)' },
      { name: 'Al-Baqarah', number: 2, note: 'His bequest to his sons (2:132–133)' },
      { name: 'Al-Anbiya', number: 21, note: 'Given endurance and insight (21:72)' },
    ],
    sections: [
      {
        heading: 'Beautiful Patience',
        body: "When Yusuf\'s brothers brought his shirt stained with false blood, Yaqub recognised the deception immediately. He said: 'Your souls have enticed you into something. So patience is most fitting. And Allah is the one sought for help against what you describe.' (Yusuf 12:18). He did not accuse. He did not collapse. He chose sabrun jameel — beautiful patience.",
        arabic: 'فَصَبْرٌ جَمِيلٌ وَاللَّهُ الْمُسْتَعَانُ عَلَىٰ مَا تَصِفُونَ',
        source: 'Yusuf 12:18',
      },
      {
        heading: 'Never Losing Hope',
        body: "Years passed. Yaqub wept for Yusuf until his eyes turned white from grief. His sons said: 'By Allah, you will not stop remembering Yusuf until you become fatally ill or become of those who perish.' He said: 'I only complain of my suffering and my grief to Allah, and I know from Allah that which you do not know.' (Yusuf 12:86). Even in the depth of grief, his hope in Allah never wavered.",
        arabic: 'إِنَّمَا أَشْكُو بَثِّي وَحُزْنِي إِلَى اللَّهِ وَأَعْلَمُ مِنَ اللَّهِ مَا لَا تَعْلَمُونَ',
        source: 'Yusuf 12:86',
      },
      {
        heading: "Sight Restored",
        body: "When Yusuf sent his shirt from Egypt to Yaqub, the Quran says: 'And when the bearer of good news arrived, he cast it over his face and his eyesight returned.' (Yusuf 12:96). The reunion of father and son in the Quran is one of the most moving scenes in all of revelation. Yaqub said to his sons: 'Did I not tell you that I know from Allah what you do not know?'",
      },
    ],
    ramadanLesson: "Yaqub shows that a prophet can grieve deeply and still have perfect faith. Ramadan is a time to bring your grief and pain to Allah directly — as Yaqub did. He did not complain to people; he complained to Allah. That is the highest form of reliance. Whatever you are carrying, bring it to Allah in this month.",
  },

  // ── 11. Yusuf ────────────────────────────────────────────────
  {
    id: 'yusuf',
    name: 'Yusuf',
    nameAr: 'يوسف عليه السلام',
    title: 'Patience, Purity, and the Plan of Allah',
    summary: "The Quran calls Surah Yusuf the most beautiful of stories. In it is every human trial — jealousy, betrayal, temptation, false accusation, imprisonment, and ultimate triumph through faith.",
    surahs: [
      { name: 'Yusuf', number: 12, note: "Entire surah — the 'best of stories'" },
      { name: "Al-An'am", number: 6, note: 'Mentioned among the guided prophets (6:84)' },
      { name: 'Ghafir', number: 40, note: "Reference to Yusuf's mission in Egypt (40:34)" },
    ],
    sections: [
      {
        heading: 'Betrayed by Brothers, Rescued by Allah',
        body: "Yusuf was his father\'s most beloved son. His brothers threw him into a well and told their father a wolf had eaten him. He was then sold into slavery in Egypt. Yet the Quran says: 'And Allah was predominant over His affair, but most people do not know.' (Yusuf 12:21). What looked like the worst moment was the beginning of the plan.",
      },
      {
        heading: "He Chose Prison Over Sin",
        body: "The wife of the nobleman who owned him pursued him. She locked the doors. Yusuf fled. His innocence was confirmed. Yet he was still imprisoned — because the powerful chose to protect their reputation. From prison, Yusuf told his cellmates: 'Do you prefer diverse lords, or Allah the One, the Prevailing?' Even in prison, he was da\'wah.",
        arabic: 'قَالَ مَعَاذَ اللَّهِ إِنَّهُ رَبِّي أَحْسَنَ مَثْوَايَ إِنَّهُ لَا يُفْلِحُ الظَّالِمُونَ',
        source: 'Yusuf 12:23',
      },
      {
        heading: 'Dreams, Interpretation, and Power',
        body: "Yusuf interpreted the king\'s dream about seven fat cows and seven thin ones — seven years of abundance followed by seven years of drought. He was so trusted that he asked to be placed in charge of Egypt\'s storehouses. He managed the crisis so well that neighbouring lands came to Egypt for food — including his brothers.",
      },
      {
        heading: 'Forgiveness Without Bitterness',
        body: "When Yusuf finally revealed himself to his brothers — the same brothers who had thrown him in a well — he was the most powerful man in Egypt. His response is one of the most generous moments in the Quran: 'He said: No blame will there be upon you today. Allah will forgive you, and He is the most merciful of the merciful.' (Yusuf 12:92). Not a trace of revenge.",
        arabic: 'قَالَ لَا تَثْرِيبَ عَلَيْكُمُ الْيَوْمَ يَغْفِرُ اللَّهُ لَكُمْ وَهُوَ أَرْحَمُ الرَّاحِمِينَ',
        source: 'Yusuf 12:92',
      },
    ],
    ramadanLesson: "Surah Yusuf was revealed to the Prophet ﷺ in the Year of Grief — when he lost Khadijah and Abu Talib. Allah sent this story as a direct consolation: your trial has a plan inside it. In Ramadan, read Surah Yusuf fully. Let it speak to wherever you are hurting. The plan of Allah is always moving, even when you cannot see it.",
  },

  // ── 12. Ayyub ────────────────────────────────────────────────
  {
    id: 'ayyub',
    name: 'Ayyub',
    nameAr: 'أيوب عليه السلام',
    title: 'The Prophet Who Endured Everything',
    summary: "Ayyub was tested with the loss of his wealth, his children, and his health — all at once. He endured with patience for years. His name in every language has become a symbol of profound patience.",
    surahs: [
      { name: 'Al-Anbiya', number: 21, note: 'His affliction and relief (21:83–84)' },
      { name: 'Sad', number: 38, note: 'Full account of his test and recovery (38:41–44)' },
      { name: "Al-An'am", number: 6, note: 'Among the guided prophets (6:84)' },
    ],
    sections: [
      {
        heading: 'A Prophet Tested to His Limits',
        body: "Ayyub was wealthy, had many children, and was in good health — then he lost everything. He lost his wealth, his children died, and he was afflicted with severe illness for a long time. Some narrations mention 18 years. Yet the Quran says he was 'best of servants' — his rank was not diminished by his trial. It was revealed through it.",
      },
      {
        heading: "His Du'a — Acknowledged Without Complaint",
        body: "Ayyub did not rail against Allah or demand explanation. His du\'a in the Quran is remarkably restrained: 'Harm has touched me, and you are the Most Merciful of the merciful.' (Al-Anbiya 21:83). He did not say: I deserve better. He did not say: how could You. He simply acknowledged his state and reminded Allah of His attribute of mercy. Allah responded immediately.",
        arabic: 'رَبَّهُ أَنِّي مَسَّنِيَ الضُّرُّ وَأَنتَ أَرْحَمُ الرَّاحِمِينَ',
        source: 'Al-Anbiya 21:83',
      },
      {
        heading: 'Restored and Doubled',
        body: "Allah answered Ayyub\'s du\'a: 'We responded to him and removed what afflicted him of adversity. And We gave him back his family and the like thereof with them as mercy from Us.' (Al-Anbiya 21:84). The Quran says Allah gave him his family back — and the like thereof with them. Everything was restored. In Surah Sad, Allah told him to strike the ground with his foot — a spring appeared and he was told to wash with it and drink, and his illness would be healed.",
        arabic: 'فَاسْتَجَبْنَا لَهُ فَكَشَفْنَا مَا بِهِ مِن ضُرٍّ وَآتَيْنَاهُ أَهْلَهُ وَمِثْلَهُم مَّعَهُمْ',
        source: 'Al-Anbiya 21:84',
      },
    ],
    ramadanLesson: "Ayyub teaches that trial does not mean abandonment. It may mean elevation. Every prophet in the Quran was tested in proportion to their rank. If you are going through difficulty right now, make the du\'a of Ayyub. It is one of the most effective du\'as in the Quran — Allah says He responded immediately.",
  },

  // ── 13. Shuayb ───────────────────────────────────────────────
  {
    id: 'shuayb',
    name: "Shu'ayb",
    nameAr: 'شعيب عليه السلام',
    title: "The Prophet of Business Ethics",
    summary: "Shu'ayb was sent to the people of Madyan who cheated in their weights and measurements. He is known as the most eloquent of the prophets. Economic justice, for him, was an act of worship.",
    surahs: [
      { name: 'Hud', number: 11, note: "Full account of Shu'ayb and Madyan (11:84–95)" },
      { name: "Al-A'raf", number: 7, note: "His call and their rejection (7:85–93)" },
      { name: 'Ash-Shuara', number: 26, note: "His dialogue with the people (26:176–191)" },
    ],
    sections: [
      {
        heading: "A People Who Cheated in Business",
        body: "The people of Madyan were notoriously dishonest in trade — giving short measure, praising their goods beyond their worth, and hiding defects. Shu\'ayb\'s message was not separate from their daily life. He said: 'Give full measure and do not be among the losers. And weigh with an even balance. Do not deprive people of their due.' (Ash-Shuara 26:181–183). His call to tawhid and his call to honest trade were inseparable.",
        arabic: 'أَوْفُوا الْكَيْلَ وَلَا تَكُونُوا مِنَ الْمُخْسِرِينَ وَزِنُوا بِالْقِسْطَاسِ الْمُسْتَقِيمِ',
        source: 'Ash-Shuara 26:181–182',
      },
      {
        heading: 'His Response to Their Mockery',
        body: "His people said: 'O Shu\'ayb, we do not understand much of what you say, and indeed we see you as weak among us.' He responded: 'O my people, is my clan more respected by you than Allah? And you put Him behind your backs?' (Hud 11:91–92). They threatened to stone him. He reminded them that Allah was watching everything.",
      },
      {
        heading: "Destroyed by Darkness",
        body: "The people of Madyan were struck by a screaming blast and a scorching cloud that descended upon them. The Quran says they became as if they had never lived there — the same destruction that came to Aad and Thamud. Shu\'ayb departed saying: 'O my people, I have certainly conveyed to you the messages of my Lord and advised you, so how could I grieve for a disbelieving people?' (Al-Araf 7:93).",
      },
    ],
    ramadanLesson: "Shu'ayb reminds us that Islam is not a religion limited to the masjid. Honest business, fair dealing, and protecting the rights of others are acts of worship. In Ramadan, audit your dealings. Are you giving full measure in your work, your commitments, your time with family? Justice in daily life is a form of ibadah.",
  },

  // ── 14. Musa ─────────────────────────────────────────────────
  {
    id: 'musa',
    name: 'Musa',
    nameAr: 'موسى عليه السلام',
    title: 'Kalimullah — The One Who Spoke Directly with Allah',
    summary: "Musa is the most mentioned prophet in the Quran — appearing in more than 70 surahs. He was rescued as a newborn, raised by his own enemy, fled as a fugitive, and returned to lead his people out of slavery.",
    surahs: [
      { name: 'Al-Qasas', number: 28, note: "Full biography — birth to prophethood (28:1–48)" },
      { name: 'Ta-Ha', number: 20, note: "The burning bush, the staff, and Pharaoh (20:9–98)" },
      { name: "Al-A'raf", number: 7, note: 'His signs before Pharaoh (7:103–162)' },
      { name: 'Ash-Shuara', number: 26, note: 'The confrontation with Pharaoh (26:10–66)' },
      { name: 'Al-Baqarah', number: 2, note: 'Bani Israel after Pharaoh (2:49–73)' },
      { name: 'Yunus', number: 10, note: "Pharaoh's last moment of faith (10:90)" },
    ],
    sections: [
      {
        heading: "Saved From the Water, Returned to His Mother",
        body: "Pharaoh was killing every Israelite male infant. Allah inspired the mother of Musa to place him in a chest and cast him into the river. The chest came to rest at the bank of Pharaoh\'s palace. Pharaoh\'s wife saw him and felt love immediately. She said: 'Do not kill him — perhaps he will benefit us.' (Al-Qasas 28:9). His own sister followed the chest and offered to find a nursing woman. His mother was brought — and nursed her own son, inside the palace of the man trying to kill him.",
        arabic: 'وَأَوْحَيْنَا إِلَىٰ أُمِّ مُوسَىٰ أَنْ أَرْضِعِيهِ',
        source: 'Al-Qasas 28:7',
      },
      {
        heading: 'The Burning Bush',
        body: "Musa had fled Egypt after accidentally killing a man and lived in Madyan for ten years, marrying the daughter of Shu\'ayb. One night, he saw a fire in the distance and went toward it. Allah called out from the right side of the valley in the blessed spot of the bush: 'O Musa, indeed I am Allah, Lord of the worlds.' (Al-Qasas 28:30). He was commanded to take off his sandals — he was in a holy valley — and given the mission to return to Pharaoh.",
      },
      {
        heading: "His Du'a for Ease",
        body: "Before facing Pharaoh, Musa asked Allah for something every believer needs: an expanded chest, ease in his affairs, and the loosening of his tongue so his message could be understood. He also asked for his brother Harun as a helper. Allah granted all of it immediately: 'You have been granted your request, O Musa.' (Ta-Ha 20:36). This du\'a is for every difficult task.",
        arabic: 'رَبِّ اشْرَحْ لِي صَدْرِي وَيَسِّرْ لِي أَمْرِي',
        source: 'Ta-Ha 20:25–26',
      },
      {
        heading: "Crossing the Sea",
        body: "After Pharaoh refused to release Bani Israel through ten plagues, Musa led his people out at night. Pharaoh pursued them with his army. The sea was in front of them and Pharaoh behind. The people said: 'We are overtaken.' Musa said: 'No! Indeed, with me is my Lord; He will guide me.' (Ash-Shuara 26:62). Allah commanded him to strike the sea with his staff. It split into twelve dry paths. Pharaoh followed — and was drowned. As he drowned, he said: I believe.",
        arabic: 'كَلَّا إِنَّ مَعِيَ رَبِّي سَيَهْدِينِ',
        source: 'Ash-Shuara 26:62',
      },
    ],
    ramadanLesson: "Musa was fasting when he received the Torah — he fasted for forty nights at Mount Sinai. The connection between fasting and divine revelation is deep. In Ramadan, as you fast, know that you are engaged in an act that prophets used to draw close to Allah. The Quran was also revealed in Ramadan. This month is the month of revelation.",
  },

  // ── 15. Harun ────────────────────────────────────────────────
  {
    id: 'harun',
    name: 'Harun',
    nameAr: 'هارون عليه السلام',
    title: "Musa's Brother and the Power of Brotherly Support",
    summary: "Harun was given as a prophet to support his brother Musa. His story teaches that great missions are carried together, and that a helper in the right cause is a gift from Allah.",
    surahs: [
      { name: 'Ta-Ha', number: 20, note: 'Harun given as helper to Musa (20:29–36)' },
      { name: "Al-A'raf", number: 7, note: 'The golden calf — Harun tried to stop them (7:150)' },
      { name: 'Al-Anbiya', number: 21, note: 'Both sent to Pharaoh as mercy (21:48)' },
      { name: 'As-Saffat', number: 37, note: "Praised alongside Musa (37:114–122)" },
    ],
    sections: [
      {
        heading: 'Musa Asked for His Brother',
        body: "When Musa received his mission, he immediately asked Allah to give him his brother Harun as a helper: 'And appoint for me a minister from my family — Harun, my brother. Increase my strength through him and let him share my task.' (Ta-Ha 20:29–32). Allah granted this immediately. The lesson from Mufti Menk: there is nothing wrong with asking for help, even from Allah directly, when the task is for His sake.",
        arabic: 'وَاجْعَل لِّي وَزِيرًا مِّنْ أَهْلِي هَارُونَ أَخِي',
        source: 'Ta-Ha 20:29–30',
      },
      {
        heading: 'Left in Charge — and Betrayed',
        body: "When Musa went to Mount Sinai for forty nights, he left Harun in charge of Bani Israel. In his absence, a man named as-Samiri fashioned a golden calf and led the people astray. Harun tried to stop them — he warned them, rebuked them, told them they were being tested. They refused to listen. When Musa returned in grief, he seized Harun\'s head. Harun said: 'O son of my mother, the people overpowered me.' (Al-Araf 7:150). He had tried his best.",
      },
      {
        heading: 'Died Together on the Mountain',
        body: "In authentic narrations, Harun died before Musa — on the mountain, peacefully, without experiencing the punishment of the people. Both are praised in the Quran as a mercy to their people, as helpers to each other, and as examples of brotherhood in service to Allah. The Prophet ﷺ said: 'I am to Ali as Musa was to Harun.' (Bukhari, Muslim).",
      },
    ],
    ramadanLesson: "Harun teaches the value of righteous companionship. Every great mission is carried better with someone beside you. In Ramadan, find your Harun — a friend, spouse, or family member who will fast with you, pray with you, remind you. The Prophet ﷺ said: a man is upon the religion of his close friend.",
  },

  // ── 16. Dhul-Kifl ────────────────────────────────────────────
  {
    id: 'dhulkifl',
    name: 'Dhul-Kifl',
    nameAr: 'ذو الكفل عليه السلام',
    title: 'The Prophet of Steadfast Commitment',
    summary: "Dhul-Kifl is one of the prophets mentioned in the Quran but with the fewest details. He is praised for his patience, his steadfastness, and being among the righteous.",
    surahs: [
      { name: 'Al-Anbiya', number: 21, note: 'Listed among the patient and righteous (21:85–86)' },
      { name: 'Sad', number: 38, note: 'Praised as among the good (38:48)' },
    ],
    sections: [
      {
        heading: "His Name and Its Meaning",
        body: "Dhul-Kifl means 'the one of the pledge' or 'the one of the portion.' Some scholars say he received this name because he pledged to judge with justice, fast every day, spend every night in prayer, and never become angry in service of Allah — and he fulfilled every commitment. Whether this account is from authentic narrations or scholarly inference, the Quran praises him explicitly for his patience and ranks him among the righteous.",
      },
      {
        heading: 'Praised Without Lengthy Story',
        body: "The Quran mentions Dhul-Kifl briefly but directly: 'And Ismail, Idris, and Dhul-Kifl — all were of the patient. And We admitted them into Our mercy. Indeed, they were of the righteous.' (Al-Anbiya 21:85–86). Sometimes the highest praise is in a few words. His name, placed in this list of prophets, is his honour.",
        arabic: 'وَإِسْمَاعِيلَ وَإِدْرِيسَ وَذَا الْكِفْلِ كُلٌّ مِّنَ الصَّابِرِينَ',
        source: 'Al-Anbiya 21:85',
      },
    ],
    ramadanLesson: "Dhul-Kifl is the prophet of commitments kept. In Ramadan, make a pledge to Allah — and fulfill it. Whether it is reading a portion of the Quran each day, praying Tarawih, or giving in charity. The value of Ramadan is not just in what you do during it, but in the habits it leaves behind when it ends.",
  },

  // ── 17. Dawud ────────────────────────────────────────────────
  {
    id: 'dawud',
    name: 'Dawud',
    nameAr: 'داود عليه السلام',
    title: 'The King, the Warrior, and the Man of Constant Worship',
    summary: "Dawud was a young shepherd who killed Goliath, became a king, received the Zabur, and was given the ability to shape iron with his bare hands. He was known for fasting half his life.",
    surahs: [
      { name: 'Al-Baqarah', number: 2, note: 'Dawud kills Goliath (2:251)' },
      { name: 'Al-Anbiya', number: 21, note: 'Mountains and birds glorified with him (21:78–80)' },
      { name: "An-Naml", number: 27, note: 'Given knowledge and speech of birds (27:15)' },
      { name: 'Sad', number: 38, note: 'His judgment and his repentance (38:17–26)' },
    ],
    sections: [
      {
        heading: "A Shepherd Who Defeated a Giant",
        body: "When Bani Israel faced the army of Goliath (Jalut), Dawud was a young man. He was not among the soldiers — he was a shepherd who had come with food for his brothers. When the Israelites wavered, Dawud went forward and killed Goliath. The Quran says: 'And Allah gave him the kingship and prophethood and taught him from that which He willed.' (Al-Baqarah 2:251).",
        arabic: 'وَقَتَلَ دَاوُودُ جَالُوتَ وَآتَاهُ اللَّهُ الْمُلْكَ وَالْحِكْمَةَ',
        source: 'Al-Baqarah 2:251',
      },
      {
        heading: 'Mountains and Birds Glorified with Him',
        body: "Allah gave Dawud an extraordinary gift: when he recited the Zabur (Psalms), the mountains and birds would join in his glorification of Allah. The Quran says: 'And We subjected the mountains to exalt Allah with him, as well as the birds.' (Al-Anbiya 21:79). His voice in worship was so beautiful and powerful that creation itself responded.",
      },
      {
        heading: 'His Fast — The Best of Fasts',
        body: "The Prophet Muhammad ﷺ said: 'The most beloved fasting to Allah was the fasting of Dawud — he used to fast one day and not fast one day.' (Bukhari 3420). Dawud alternated fasting and eating throughout his life. The Prophet ﷺ also described his night prayer — he would sleep half the night, stand in prayer for a third, and sleep for the remaining sixth.",
      },
    ],
    ramadanLesson: "Dawud shows that constant worship — made a permanent feature of daily life — is more beloved to Allah than bursts of intense devotion. Ramadan is a training ground. The goal is not just to worship intensely for 30 days, but to leave Ramadan with permanent habits: a portion of Quran daily, consistent tahajjud, regular sadaqah.",
  },

  // ── 18. Sulayman ─────────────────────────────────────────────
  {
    id: 'sulayman',
    name: 'Sulayman',
    nameAr: 'سليمان عليه السلام',
    title: "A Kingdom Given — and Used for Allah",
    summary: "Sulayman was given a kingdom unlike any before or after him — command over humans, jinn, wind, and animals. He used every gift for the worship and service of Allah.",
    surahs: [
      { name: "An-Naml", number: 27, note: "The Queen of Sheba, birds, ants (27:15–44)" },
      { name: 'Al-Anbiya', number: 21, note: 'Wind and devils subjected to him (21:81–82)' },
      { name: 'Sad', number: 38, note: "His prayer of gratitude over horses (38:30–40)" },
      { name: 'Al-Baqarah', number: 2, note: 'Sorcery falsely attributed to him (2:102)' },
    ],
    sections: [
      {
        heading: 'The Speech of Birds and the Hoopoe',
        body: "Sulayman was given the ability to understand the speech of animals. He was reviewing his army of humans, jinn, and birds — and noticed the hoopoe (hudhud) was missing. The hoopoe returned with news: he had found a queen in Yemen — Bilqis, Queen of Sheba — who ruled a great kingdom and worshipped the sun. Sulayman sent her a letter. She came to him, and ultimately submitted to Allah.",
        arabic: 'عُلِّمْنَا مَنطِقَ الطَّيْرِ وَأُوتِينَا مِن كُلِّ شَيْءٍ',
        source: "An-Naml 27:16 — We have been taught the language of birds and have been given of all things.",
      },
      {
        heading: "His Du'a — Never Forget Gratitude",
        body: "When Sulayman saw the throne of the Queen of Sheba brought to him in an instant — by someone who had knowledge of the Book — he said: 'This is from the favour of my Lord to test me whether I will be grateful or ungrateful.' (An-Naml 27:40). A man with power over wind, jinn, and animals — and his first response to each gift was gratitude.",
        arabic: 'هَٰذَا مِن فَضْلِ رَبِّي لِيَبْلُوَنِي أَأَشْكُرُ أَمْ أَكْفُرُ',
        source: 'An-Naml 27:40',
      },
      {
        heading: "His Du'a for an Extraordinary Kingdom",
        body: "Sulayman made a du\'a that the Prophet ﷺ instructed us to learn: 'My Lord, forgive me and grant me a kingdom such as will not belong to anyone after me. Indeed, You are the Bestower.' (Sad 38:35). Allah gave him exactly that. The Prophet ﷺ said this du\'a was specific to Sulayman — but reciting salawat upon him as a prophet earns its own reward.",
        arabic: 'رَبِّ اغْفِرْ لِي وَهَبْ لِي مُلْكًا لَّا يَنبَغِي لِأَحَدٍ مِّن بَعْدِي إِنَّكَ أَنتَ الْوَهَّابُ',
        source: 'Sad 38:35',
      },
    ],
    ramadanLesson: "Sulayman was given everything — and he still said 'this is a test of gratitude.' In Ramadan, gratitude is a daily practice. After breaking your fast, before sleeping, after Fajr — count one blessing Allah has given you and thank Him for it by name. Sulayman had everything and was still grateful. How much more should we be.",
  },

  // ── 19. Ilyas ────────────────────────────────────────────────
  {
    id: 'ilyas',
    name: 'Ilyas',
    nameAr: 'إلياس عليه السلام',
    title: 'Standing Alone Against the Worship of Ba\'l',
    summary: "Ilyas was sent to a people who had abandoned Allah and turned to worshipping an idol called Ba'l. He stood firm alone, was rejected, yet is praised in the Quran for eternity.",
    surahs: [
      { name: 'As-Saffat', number: 37, note: "His call and the eternal salutation (37:123–132)" },
      { name: "Al-An'am", number: 6, note: 'Among the guided prophets (6:85)' },
    ],
    sections: [
      {
        heading: "Called to Reject Ba'l",
        body: "Ilyas was sent to a people who had abandoned the worship of Allah and taken an idol called Ba\'l as their god. He called out: 'Will you call upon Ba\'l and leave the best of creators — Allah, your Lord and the Lord of your first forefathers?' (As-Saffat 37:125–126). They called him a liar. They rejected him. Yet he did not abandon his mission.",
        arabic: 'أَتَدْعُونَ بَعْلًا وَتَذَرُونَ أَحْسَنَ الْخَالِقِينَ اللَّهَ رَبَّكُمْ وَرَبَّ آبَائِكُمُ الْأَوَّلِينَ',
        source: 'As-Saffat 37:125–126',
      },
      {
        heading: 'Praised in Eternity',
        body: "The Quran says about Ilyas: 'And We left for him among later generations: Peace upon Ilyas. Indeed, We thus reward the doers of good. Indeed, he was of Our believing servants.' (As-Saffat 37:129–132). His memory is kept alive — praised in the Book of Allah — long after the people who rejected him have been forgotten. This is what da\'wah for Allah\'s sake earns: eternal honour.",
        arabic: 'سَلَامٌ عَلَىٰ إِلْ يَاسِينَ إِنَّا كَذَٰلِكَ نَجْزِي الْمُحْسِنِينَ',
        source: 'As-Saffat 37:129–130',
      },
    ],
    ramadanLesson: "Ilyas stood alone against an entire people. Sometimes following the truth means being the minority. Ramadan is a time to renew your identity as a believer — not what the culture around you normalises, but what Allah has commanded. The reward is not in people's approval; it is with Allah.",
  },

  // ── 20. Al-Yasa ──────────────────────────────────────────────
  {
    id: 'alyasa',
    name: "Al-Yasa'",
    nameAr: "اليسع عليه السلام",
    title: 'The Chosen Successor',
    summary: "Al-Yasa' is the prophet who succeeded Ilyas. He is mentioned twice in the Quran — briefly but with honour, placed among the greatest of prophets.",
    surahs: [
      { name: "Al-An'am", number: 6, note: "Among the guided prophets — listed with Ismail, Yunus, Lut (6:86)" },
      { name: 'Sad', number: 38, note: 'Praised among the best (38:48)' },
    ],
    sections: [
      {
        heading: 'Honoured Among the Prophets',
        body: "The Quran places Al-Yasa\' in a distinguished list in Surah Al-An\'am: 'And Ismail and Al-Yasa\' and Yunus and Lut — all of them We preferred over the worlds.' (Al-An\'am 6:86). To be listed alongside Ismail, Yunus, and Lut — in a verse that begins with Dawud and Sulayman and Ayyub — is itself a mark of extraordinary honour.",
        arabic: 'وَإِسْمَاعِيلَ وَالْيَسَعَ وَيُونُسَ وَلُوطًا وَكُلًّا فَضَّلْنَا عَلَى الْعَالَمِينَ',
        source: "Al-An'am 6:86",
      },
      {
        heading: 'Singled Out as Excellent',
        body: "In Surah Sad, Al-Yasa\' is mentioned alongside Dhul-Kifl with the words: 'Remember Our servants Ismail, Al-Yasa\', and Dhul-Kifl — all are among the best.' (Sad 38:48). These brief mentions are significant: Allah chose to preserve their names in His Book forever. That is what matters — not the length of their mention, but the quality of what they did.",
        arabic: 'وَاذْكُرْ إِسْمَاعِيلَ وَالْيَسَعَ وَذَا الْكِفْلِ وَكُلٌّ مِّنَ الْأَخْيَارِ',
        source: 'Sad 38:48',
      },
    ],
    ramadanLesson: "Al-Yasa' teaches that Allah knows those who serve Him faithfully even when the world does not. You do not need public recognition for your worship. Pray your night prayers quietly, fast your optional fasts privately, give your sadaqah without announcement. Allah preserved the name of Al-Yasa' in the Quran — He sees what others do not.",
  },

  // ── 21. Yunus ────────────────────────────────────────────────
  {
    id: 'yunus',
    name: 'Yunus',
    nameAr: 'يونس عليه السلام',
    title: 'Dhul-Nun — The One Who Called from the Darkness',
    summary: "Yunus left his people without permission from Allah, was swallowed by a whale, and called upon Allah from three layers of darkness. His du'a from inside the whale is one of the most powerful in all of Islam.",
    surahs: [
      { name: 'Yunus', number: 10, note: "His people were saved when they believed (10:98)" },
      { name: 'Al-Anbiya', number: 21, note: "His du'a and rescue from the whale (21:87–88)" },
      { name: 'As-Saffat', number: 37, note: "Full account — the lot, the whale, the tree (37:139–148)" },
      { name: 'Al-Qalam', number: 68, note: 'The Prophet ﷺ told not to be like Yunus (68:48–50)' },
    ],
    sections: [
      {
        heading: "He Left Without Permission",
        body: "Yunus called his people in Nineveh for years. They rejected him. In frustration and anger, he left — without waiting for Allah\'s permission to depart. The Quran says he 'went in anger' (Al-Anbiya 21:87). He boarded a ship. A storm struck. They cast lots to see who should be thrown overboard — the lot fell on Yunus three times. He was thrown into the sea and swallowed by a great fish.",
      },
      {
        heading: "Three Darknesses — One Du'a",
        body: "Inside the whale, in the darkness of the deep ocean, Yunus called out in complete acknowledgement of his wrongdoing — without excuse, without blame, with full ownership: 'There is no deity except You; exalted are You. Indeed, I have been of the wrongdoers.' (Al-Anbiya 21:87). The Prophet ﷺ said: 'No Muslim calls upon Allah with these words for anything, except that Allah answers him.' (At-Tirmidhi 3505).",
        arabic: 'لَّا إِلَٰهَ إِلَّا أَنتَ سُبْحَانَكَ إِنِّي كُنتُ مِنَ الظَّالِمِينَ',
        source: 'Al-Anbiya 21:87 — the most powerful du\'a for any difficulty',
      },
      {
        heading: "Rescued and Returned",
        body: "Allah says: 'Had he not been one of those who glorify Allah, he would have remained in its belly until the Day of Resurrection.' (As-Saffat 37:143–144). He was cast onto the shore, weak and sick. Allah caused a gourd tree to grow over him for shade and nourishment. He recovered, and Allah sent him back to his people — 100,000 of them — and they all believed. The only people in the Quran described as having believed as a whole nation.",
        arabic: 'فَاسْتَجَبْنَا لَهُ وَنَجَّيْنَاهُ مِنَ الْغَمِّ وَكَذَٰلِكَ نُنجِي الْمُؤْمِنِينَ',
        source: 'Al-Anbiya 21:88 — We responded to him and saved him from distress, and thus do We save the believers.',
      },
    ],
    ramadanLesson: "The du'a of Yunus is the most universal du'a for difficulty in the Quran. 'La ilaha illa anta subhanaka inni kuntu mina al-zalimin.' In Ramadan, use this du'a in every sujud, every night in the last third. The Prophet ﷺ guaranteed its answer. There is no circumstance too deep, no darkness too thick for Allah to reach.",
  },

  // ── 22. Zakariyya ────────────────────────────────────────────
  {
    id: 'zakariyya',
    name: 'Zakariyya',
    nameAr: 'زكريا عليه السلام',
    title: "A Quiet Du'a Answered by the Lord of the Worlds",
    summary: "Zakariyya was an elderly man with a barren wife. He made a quiet du'a to Allah in the sanctuary — and Allah answered with the gift of Yahya. His story is about private supplication and the certainty that Allah hears.",
    surahs: [
      { name: 'Maryam', number: 19, note: "His du'a and the birth of Yahya (19:2–11)" },
      { name: 'Aal Imran', number: 3, note: "His du'a seeing how Maryam was provided for (3:37–41)" },
      { name: 'Al-Anbiya', number: 21, note: "His du'a answered (21:89–90)" },
    ],
    sections: [
      {
        heading: "Inspired by Maryam",
        body: "Zakariyya was the guardian of Maryam. Every time he entered her sanctuary, he found provision with her. He asked: 'O Maryam, where is this from?' She said: 'It is from Allah. Indeed, Allah provides for whom He wills without account.' (Aal Imran 3:37). This direct provision, out of nothing, inspired Zakariyya. If Allah could do this for Maryam, He could do anything. He turned immediately to du\'a.",
      },
      {
        heading: "A Secret Cry",
        body: "The Quran describes Zakariyya\'s du\'a with an extraordinary phrase: 'When he called to his Lord a secret calling.' (Maryam 19:3). He did not call out publicly. He whispered his deepest wish to Allah alone, in the silence of the sanctuary. He said: 'My Lord, indeed my bones have weakened and my head has filled with white, and never have I been in my supplication to you, my Lord, unhappy.' (Maryam 19:4).",
        arabic: 'إِذْ نَادَىٰ رَبَّهُ نِدَاءً خَفِيًّا',
        source: 'Maryam 19:3 — When he called his Lord with a secret call.',
      },
      {
        heading: "Yahya — A Name With No Precedent",
        body: "Allah answered: 'O Zakariyya, We give you glad tidings of a boy whose name is Yahya — We have not made for him anyone previously bearing that name.' (Maryam 19:7). A new name, a new child, from an elderly barren couple. Zakariyya asked for a sign. He was told: your sign is that you will not speak to people for three days except by gesture.",
      },
    ],
    ramadanLesson: "Zakariyya made a private du'a — not public, not announced, not for show. The most sincere du'a is between you and Allah alone, at night, in tears, when no one is watching. In the last ten nights of Ramadan, make time for this: sit alone in the dark, and speak to Allah quietly. That is where the greatest answers come.",
  },

  // ── 23. Yahya ────────────────────────────────────────────────
  {
    id: 'yahya',
    name: 'Yahya',
    nameAr: 'يحيى عليه السلام',
    title: 'Given Wisdom as a Child, and Praised in Life and Death',
    summary: "Yahya was born as a miraculous answer to his father's du'a. He was given wisdom as a boy, was gentle-hearted, and is praised in the Quran on the day of his birth, his death, and his resurrection.",
    surahs: [
      { name: 'Maryam', number: 19, note: 'Birth, wisdom, and the threefold salutation (19:12–15)' },
      { name: 'Aal Imran', number: 3, note: "Announced to Zakariyya by angels (3:39)" },
      { name: 'Al-Anbiya', number: 21, note: 'Both Zakariyya and Yahya praised (21:89–90)' },
    ],
    sections: [
      {
        heading: 'Given Wisdom as a Child',
        body: "The Quran says about Yahya: 'O Yahya, take the Book with strength.' And We gave him wisdom while yet a child. (Maryam 19:12). Allah personally commanded him to hold the scripture firmly. Before he was even fully grown, he was given judgment, understanding, and depth. This was not schooling — it was a divine gift.",
        arabic: 'يَا يَحْيَىٰ خُذِ الْكِتَابَ بِقُوَّةٍ وَآتَيْنَاهُ الْحُكْمَ صَبِيًّا',
        source: 'Maryam 19:12',
      },
      {
        heading: 'Praised on Three Days',
        body: "The Quran says: 'And peace be upon him the day he was born, and the day he dies, and the day he is raised alive.' (Maryam 19:15). This same phrasing is used for Isa in the very next passage. It is a mark of immense honour — peace from Allah upon the three most vulnerable and consequential moments of a person\'s existence.",
        arabic: 'وَسَلَامٌ عَلَيْهِ يَوْمَ وُلِدَ وَيَوْمَ يَمُوتُ وَيَوْمَ يُبْعَثُ حَيًّا',
        source: 'Maryam 19:15',
      },
      {
        heading: 'Gentle, Pure, and Righteous',
        body: "The Quran describes Yahya with rare qualities: 'And compassion from Us, and purity, and he was righteous. And dutiful to his parents, and he was not arrogant or disobedient.' (Maryam 19:13–14). Gentle-hearted. Pure. Dutiful. Not arrogant. These are the qualities Allah chose to record about him forever.",
      },
    ],
    ramadanLesson: "Yahya was given wisdom as a child and remained humble his entire life. Knowledge without humility leads to arrogance — and arrogance is the sin of Iblis. In Ramadan, as you increase in knowledge of the Quran, let it increase your humility, your gentleness with people, your compassion. That is the mark of real understanding.",
  },

  // ── 24. Isa ──────────────────────────────────────────────────
  {
    id: 'isa',
    name: 'Isa',
    nameAr: 'عيسى عليه السلام',
    title: "Kalimatullah — The Word of Allah and a Spirit from Him",
    summary: "Isa ibn Maryam was born without a father, spoke in the cradle, healed the blind and the leper, raised the dead, and was raised to Allah before they could crucify him. He will return before the Last Day.",
    surahs: [
      { name: 'Maryam', number: 19, note: "The birth of Isa and his speech in the cradle (19:16–37)" },
      { name: 'Aal Imran', number: 3, note: "His birth announced to Maryam (3:42–57)" },
      { name: "Al-Ma'idah", number: 5, note: "His miracles and the table from heaven (5:110–120)" },
      { name: "An-Nisa'", number: 4, note: 'He was not crucified — he was raised (4:157–159)' },
      { name: 'As-Saff', number: 61, note: "Isa foretells the coming of Ahmad (Muhammad ﷺ) (61:6)" },
    ],
    sections: [
      {
        heading: "Born of a Virgin — A Sign for the Worlds",
        body: "Maryam was the most devoted woman of her era. She had consecrated herself to worship in the sanctuary. When the angel Jibril came to her in the form of a man and told her she would have a son, she said: 'How can I have a boy when no man has touched me?' He said: 'Such is Allah — He creates what He wills. When He decrees a matter, He only says to it: Be, and it is.' (Aal Imran 3:47). The creation of Isa without a father is, in the Quran, compared directly to the creation of Adam — both are from the direct command of Allah.",
        arabic: 'إِنَّ مَثَلَ عِيسَىٰ عِندَ اللَّهِ كَمَثَلِ آدَمَ خَلَقَهُ مِن تُرَابٍ ثُمَّ قَالَ لَهُ كُن فَيَكُونُ',
        source: 'Aal Imran 3:59 — Indeed, the example of Isa to Allah is like that of Adam.',
      },
      {
        heading: 'He Spoke in the Cradle',
        body: "When Maryam returned to her people carrying the infant, they accused her. She pointed to him. They said: 'How can we speak to one who is in the cradle, a child?' Isa spoke: 'Indeed, I am the servant of Allah. He has given me the Scripture and made me a prophet. And He has made me blessed wherever I am and has enjoined upon me prayer and zakah as long as I remain alive.' (Maryam 19:30–31). His first words as a newborn were a declaration that he was a servant of Allah.",
        arabic: 'قَالَ إِنِّي عَبْدُ اللَّهِ آتَانِيَ الْكِتَابَ وَجَعَلَنِي نَبِيًّا',
        source: 'Maryam 19:30',
      },
      {
        heading: "He Was Not Crucified",
        body: "When the enemies of Isa conspired to kill him, Allah intervened. The Quran is direct: 'And they did not kill him, nor did they crucify him, but it was made to appear so to them.' (An-Nisa 4:157). Isa was raised to Allah before they could harm him. He is alive today. The Prophet ﷺ taught that Isa will descend near Damascus before the Last Day, break the cross as a symbol, establish justice, and then die a natural death.",
        arabic: 'وَمَا قَتَلُوهُ وَمَا صَلَبُوهُ وَلَٰكِن شُبِّهَ لَهُمْ',
        source: "An-Nisa' 4:157",
      },
      {
        heading: "He Foretold the Coming of Muhammad ﷺ",
        body: "The Quran records Isa saying: 'And giving good tidings of a messenger to come after me whose name is Ahmad.' (As-Saff 61:6). In every tradition, Isa always directed the people toward the One God. He never claimed divinity. He never asked to be worshipped. His mission and the mission of Muhammad ﷺ were one and the same: worship Allah alone.",
      },
    ],
    ramadanLesson: "The Quran was revealed in Ramadan — the month in which Isa received the Injeel according to some scholars. Every scripture from Allah pointed to the same truth: Islam. In Ramadan, when you recite the Quran, know that you are holding the final preserved message that completes and confirms all that came before it. Guard it.",
  },

  // ── 25. Muhammad ﷺ ─────────────────────────────────────────
  {
    id: 'muhammad',
    name: 'Muhammad',
    nameAr: 'محمد صلى الله عليه وسلم',
    title: 'The Seal of All Prophets and His Ramadan',
    summary: "Muhammad ﷺ is the final messenger — sent to all of humanity until the Last Day. He was the most generous, the most patient, and the most devoted to Allah. In Ramadan, his devotion intensified beyond any other month.",
    surahs: [
      { name: "Al-Ahzab", number: 33, note: 'Seal of the prophets (33:40)' },
      { name: "Al-Anbiya'", number: 21, note: 'Sent as a mercy to the worlds (21:107)' },
      { name: 'Muhammad', number: 47, note: 'Dedicated surah — his mission and the believers' },
      { name: 'Al-Fath', number: 48, note: 'The victory and his character (48:29)' },
      { name: "Al-Qalam", number: 68, note: 'You are upon an exalted standard of character (68:4)' },
      { name: "Al-Muzzammil", number: 73, note: 'The first revelation — rise and pray the night' },
      { name: 'Ash-Sharh', number: 94, note: 'For every hardship, there is ease (94:5–6)' },
    ],
    sections: [
      {
        heading: "The First Revelation — in Ramadan",
        body: "The Prophet ﷺ would spend time in the Cave of Hira in devotion. In the month of Ramadan, the angel Jibril came and embraced him tightly: 'Read.' He said: 'I cannot read.' Three times. Then came the first words of the Quran: 'Read in the name of your Lord who created. Created man from a clinging substance. Read, and your Lord is the most Generous.' (Al-Alaq 96:1–3). The Quran entered the world in Ramadan. This is why the night of Qadr — the night of the first revelation — falls in this month.",
        arabic: 'اقْرَأْ بِاسْمِ رَبِّكَ الَّذِي خَلَقَ',
        source: 'Al-Alaq 96:1 — the first words of revelation',
      },
      {
        heading: 'More Generous Than the Wind',
        body: "Ibn Abbas reported: 'The Prophet ﷺ was the most generous of people, and he was most generous in Ramadan when Jibril would meet him. Jibril would meet him every night and they would review the Quran together. The Prophet ﷺ when Jibril met him was more generous in goodness than the blowing wind.' (Bukhari 3220). The review of the entire Quran with Jibril every Ramadan night — this is the Ramadan of the Prophet ﷺ.",
      },
      {
        heading: 'The Last Ten Nights',
        body: "Aisha reported: 'When the last ten nights entered, the Prophet ﷺ would tighten his belt, stay awake all night, and wake his family.' (Bukhari 2024). This is the Prophet ﷺ who already prayed all night regularly — yet he intensified further in the last ten. When the companions asked what to say on Laylat al-Qadr, he gave the most beautiful du\'a of three words: Allahumma innaka Afuwwun tuhibbul-afwa fa\'fu anni.",
        arabic: 'اللَّهُمَّ إِنَّكَ عَفُوٌّ تُحِبُّ الْعَفْوَ فَاعْفُ عَنِّي',
        source: "At-Tirmidhi 3513 — O Allah, You are the Pardoner, You love to pardon, so pardon me.",
      },
      {
        heading: 'His Character Was the Quran',
        body: "Aisha was asked about his character. She said: 'His character was the Quran.' (Muslim 746). The Quran describes him: 'And indeed, you are of a great moral character.' (Al-Qalam 68:4). He was the living embodiment of every command in the Book. In how he treated his family, his companions, his enemies, strangers, and animals — every interaction was an act of worship.",
        arabic: 'وَإِنَّكَ لَعَلَىٰ خُلُقٍ عَظِيمٍ',
        source: 'Al-Qalam 68:4',
      },
      {
        heading: "He Was Sent as Mercy",
        body: "Allah says about him: 'And We have not sent you except as a mercy to the worlds.' (Al-Anbiya 21:107). Not just to the Muslims. Not just to humans. To the worlds — all of creation. This is the Prophet ﷺ. The mercy that Allah sent to rescue humanity. To love him ﷺ is part of faith. To follow him ﷺ is the path to Allah.",
        arabic: 'وَمَا أَرْسَلْنَاكَ إِلَّا رَحْمَةً لِّلْعَالَمِينَ',
        source: "Al-Anbiya' 21:107",
      },
    ],
    ramadanLesson: "The Prophet ﷺ said: 'Whoever fasts Ramadan out of faith and seeking reward, his previous sins are forgiven.' (Bukhari 38). The entire month is a gift from the One who sent Muhammad ﷺ as a mercy. Follow his Sunnah this Ramadan: review the Quran, give generously, spend the last ten nights awake, and end every night with the du'a of Laylat al-Qadr. May Allah send His peace and blessings upon him in every moment of this blessed month.",
  },
]
