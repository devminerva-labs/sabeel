export interface ProphetStory {
  id: string
  name: string
  nameAr: string
  title: string
  summary: string
  sections: {
    heading: string
    body: string
    arabic?: string
    source?: string
  }[]
  ramadanLesson: string
}

export const PROPHET_STORIES: ProphetStory[] = [
  {
    id: 'adam',
    name: 'Adam',
    nameAr: 'آدم عليه السلام',
    title: 'The First Human and the First Repentance',
    summary: 'Adam was the first of creation, honoured above the angels in knowledge — and the first to experience forgiveness.',
    sections: [
      {
        heading: 'Honoured Above the Angels',
        body: "Allah created Adam with His own hands, breathed into him from His spirit, and taught him the names of all things. When He commanded the angels to prostrate to Adam, they all obeyed — except Iblis, who refused out of arrogance. From that moment, Iblis became the open enemy of the children of Adam.",
        arabic: 'وَعَلَّمَ آدَمَ الْأَسْمَاءَ كُلَّهَا',
        source: 'Al-Baqarah 2:31',
      },
      {
        heading: 'The Test in the Garden',
        body: "Adam and his wife Hawwa were placed in the Garden and permitted to enjoy everything within it, except one tree. Iblis whispered to them — promising that the tree would grant them eternal life and a kingdom that would never decay. They were deceived, ate from the tree, and were descended to the earth.",
      },
      {
        heading: 'The First Repentance',
        body: "What distinguished Adam was not that he did not sin — it was how he responded to sin. He did not make excuses. He did not blame Hawwa. He turned to Allah with complete humility and accepted full responsibility.",
        arabic: 'رَبَّنَا ظَلَمْنَا أَنفُسَنَا وَإِن لَّمْ تَغْفِرْ لَنَا وَتَرْحَمْنَا لَنَكُونَنَّ مِنَ الْخَاسِرِينَ',
        source: 'Al-Araf 7:23 — "Our Lord, we have wronged ourselves. If You do not forgive us and have mercy upon us, we will surely be among the losers."',
      },
      {
        heading: 'Forgiven and Chosen',
        body: "Allah forgave Adam completely. Then He chose him, guided him, and made him a prophet. The Quran says: Then his Lord chose him, accepted his repentance, and guided him. (Ta-Ha 20:122). Sin does not disqualify a person from closeness to Allah — sincere repentance restores it.",
      },
    ],
    ramadanLesson: 'Ramadan is the month of tawbah — returning to Allah. Adam teaches us that no sin is too great for Allah\'s forgiveness when we return with sincerity. Do not let shame keep you from the door that is always open.',
  },

  {
    id: 'ibrahim',
    name: 'Ibrahim',
    nameAr: 'إبراهيم عليه السلام',
    title: 'Khalilullah — The Friend of Allah',
    summary: 'Ibrahim was tested more than any other prophet. He passed every test. His life is a study in complete surrender to Allah.',
    sections: [
      {
        heading: 'Born Into Idolatry',
        body: "Ibrahim was born in a society where his own father carved the idols that people worshipped. From his youth, he refused to accept what his people inherited blindly. He looked at the stars, the moon, and the sun — and concluded: these set, they disappear, they are created. They cannot be God. He arrived at tawhid through his own sound reasoning.",
        arabic: 'إِنِّي وَجَّهْتُ وَجْهِيَ لِلَّذِي فَطَرَ السَّمَاوَاتِ وَالْأَرْضَ حَنِيفًا وَمَا أَنَا مِنَ الْمُشْرِكِينَ',
        source: 'Al-Anam 6:79 — "I have turned my face toward He who created the heavens and the earth, as a true believer, and I am not of those who associate partners with Allah."',
      },
      {
        heading: 'Thrown Into the Fire',
        body: "When Ibrahim openly smashed the idols of his people and refused to recant, they sentenced him to be burned. They gathered wood for days and lit the largest fire they could build. Ibrahim was bound and thrown into it. Allah commanded: O fire, be coolness and safety upon Ibrahim. (Al-Anbiya 21:69). The fire did not harm him.",
      },
      {
        heading: 'The Command to Sacrifice His Son',
        body: "After a lifetime of tests, Ibrahim received the most personal one: a vision commanding him to sacrifice his son Ismail. He told Ismail openly. Ismail's response was: Do what you have been commanded. You will find me, if Allah wills, among the patient. (As-Saffat 37:102). As Ibrahim laid his son down and prepared to carry out the command, Allah called to him and redeemed his son with a great sacrifice. They had both passed.",
      },
      {
        heading: 'Building the Ka\'bah',
        body: "Ibrahim and Ismail built the Ka\'bah — the first house established for mankind. As they raised its foundations, they made a du\'a that every believer can make their own: Our Lord, accept this from us. You are the All-Hearing, the All-Knowing. (Al-Baqarah 2:127).",
      },
    ],
    ramadanLesson: "Ibrahim's entire life was an act of worship. He did not worship Allah only in the masjid or at prescribed times — he brought Allah into every decision, every sacrifice, every relationship. This is the spirit of Ramadan: not just more prayer, but a deepening of consciousness of Allah in every moment.",
  },

  {
    id: 'yusuf',
    name: 'Yusuf',
    nameAr: 'يوسف عليه السلام',
    title: 'Patience, Purity, and the Plan of Allah',
    summary: 'The story of Yusuf is the most beautiful story in the Quran. It contains every human trial — betrayal, temptation, imprisonment, and eventual triumph.',
    sections: [
      {
        heading: 'Betrayed by His Brothers',
        body: "Yusuf was the most beloved of his father Yaqub's sons. His brothers, consumed by envy, threw him into a well and told their father a wolf had eaten him. Yusuf was a child. He had done nothing wrong. Yet Allah had a plan that none of them could see.",
      },
      {
        heading: 'Sold Into Slavery',
        body: "A passing caravan pulled Yusuf from the well and sold him as a slave in Egypt. He was bought by a nobleman, al-Aziz, and grew up in his household. In every condition — as a slave, as a prisoner — Yusuf maintained his character. The Quran does not record him complaining once.",
      },
      {
        heading: 'Tested With Temptation',
        body: "The wife of al-Aziz pursued him. She locked the doors. Yusuf said the words that became eternal: He said, I seek refuge in Allah. Indeed, my master has made good my residence. Indeed, wrongdoers will not succeed. (Yusuf 12:23). He chose prison over sin. He sought refuge in Allah directly.",
        arabic: 'قَالَ مَعَاذَ اللَّهِ إِنَّهُ رَبِّي أَحْسَنَ مَثْوَايَ إِنَّهُ لَا يُفْلِحُ الظَّالِمُونَ',
        source: 'Yusuf 12:23',
      },
      {
        heading: 'Years in Prison',
        body: "Despite his innocence being confirmed, Yusuf spent years in prison. When a companion about to be released offered to mention him to the king, Yusuf asked him to speak on his behalf — and the man forgot. Allah allowed this delay. Yusuf's path had to go through prison for the plan to unfold as it needed to.",
      },
      {
        heading: 'The Reunion and the Forgiveness',
        body: "When Yusuf was finally reunited with his brothers — the same brothers who had thrown him into the well — he had become the most powerful man in Egypt. He wept. And then he said: He said, no blame will there be upon you today. Allah will forgive you, and He is the most merciful of the merciful. (Yusuf 12:92). Not a trace of bitterness. Only mercy.",
        arabic: 'قَالَ لَا تَثْرِيبَ عَلَيْكُمُ الْيَوْمَ يَغْفِرُ اللَّهُ لَكُمْ وَهُوَ أَرْحَمُ الرَّاحِمِينَ',
        source: 'Yusuf 12:92',
      },
    ],
    ramadanLesson: "The story of Yusuf was revealed to the Prophet ﷺ during the Year of Grief, after he lost his wife Khadijah and his uncle Abu Talib. Allah sent this story as a reminder: after every hardship comes ease. The trials you are enduring right now are part of a plan you cannot yet see.",
  },

  {
    id: 'musa',
    name: 'Musa',
    nameAr: 'موسى عليه السلام',
    title: 'The One Who Spoke Directly with Allah',
    summary: 'Musa is the prophet mentioned most in the Quran. His life is a story of divine rescue, deep trust, and the liberation of a people who had forgotten their dignity.',
    sections: [
      {
        heading: 'Saved as a Newborn',
        body: "Pharaoh was killing every newborn Israelite boy. Allah inspired the mother of Musa: Place him in the chest and cast it into the river. She was terrified — but she obeyed. The chest carried the infant Musa down the Nile and into the palace of Pharaoh himself. His own enemy would raise him. The plan of Allah cannot be thwarted by any human power.",
        arabic: 'وَأَوْحَيْنَا إِلَىٰ أُمِّ مُوسَىٰ أَنْ أَرْضِعِيهِ',
        source: 'Al-Qasas 28:7',
      },
      {
        heading: 'Forty Nights at the Mountain',
        body: "After leading the Israelites out of Egypt and crossing the sea, Musa was summoned by Allah to Mount Sinai for forty nights. During this time, he received the Torah. He spoke directly with his Lord — Kalimullah, the one spoken to by Allah. When he asked to see Allah, he was told: You will never see Me. But look at the mountain. When the divine manifestation touched it, the mountain crumbled to dust and Musa fell unconscious.",
      },
      {
        heading: 'The Test of the Golden Calf',
        body: "While Musa was on the mountain, his people — despite everything they had witnessed — made a golden calf and began to worship it. Musa returned and was overcome with grief. He dropped the tablets he was carrying. He seized his brother's head and pulled him toward himself. Then he turned back to Allah in du'a for his people. He never gave up on them.",
      },
      {
        heading: 'His Du\'a for Ease',
        body: "Before standing before Pharaoh, Musa asked Allah for something that every believer needs: an expanded chest, ease in his affairs, and the loosening of his tongue so his message could be understood. Allah answered him. When you face a task that overwhelms you, make this du\'a of Musa.",
        arabic: 'رَبِّ اشْرَحْ لِي صَدْرِي وَيَسِّرْ لِي أَمْرِي',
        source: 'Ta-Ha 20:25–26',
      },
    ],
    ramadanLesson: "Musa's story is one of total dependence on Allah. He did not have armies or weapons when he faced Pharaoh — he had a staff and a command from Allah. In Ramadan, strip away every false sense of security and place your need entirely before Allah. That is where the help comes from.",
  },

  {
    id: 'isa',
    name: 'Isa',
    nameAr: 'عيسى عليه السلام',
    title: 'The Word of Allah and a Spirit from Him',
    summary: "Isa ibn Maryam is one of the greatest of the messengers. His birth was a miracle. His life was a proof. His second coming is one of the major signs of the Last Day.",
    sections: [
      {
        heading: 'Born Without a Father',
        body: "When Maryam was told she would have a son, she said: My Lord, how will I have a child when no man has touched me? The angel replied: Such is Allah. He creates what He wills. When He decrees a matter, He only says to it, 'Be,' and it is. (Aal Imran 3:47). The creation of Isa without a father is comparable in the Quran to the creation of Adam without parents — both are from the command of Allah.",
        arabic: 'قَالَتْ رَبِّ أَنَّىٰ يَكُونُ لِي وَلَدٌ وَلَمْ يَمْسَسْنِي بَشَرٌ',
        source: "Aal Imran 3:47",
      },
      {
        heading: 'A Life of Signs',
        body: "Isa spoke in the cradle as an infant — declaring his prophethood before he could walk. He healed the blind and the leper. He raised the dead. Every miracle was by the permission of Allah, as he always made clear: I heal, but the healing belongs to Allah. He never claimed divinity. He called people to worship the one God alone.",
      },
      {
        heading: 'Raised, Not Crucified',
        body: "When his enemies plotted to kill him, Allah raised Isa to Himself. The Quran is unambiguous: They did not kill him, nor did they crucify him, but it was made to appear so to them. (An-Nisa 4:157). Isa is alive. He will return before the Last Day, break the cross, kill the swine, establish justice, and die a natural death — and the Muslims will pray over him.",
        arabic: 'وَمَا قَتَلُوهُ وَمَا صَلَبُوهُ وَلَٰكِن شُبِّهَ لَهُمْ',
        source: 'An-Nisa 4:157',
      },
      {
        heading: 'His Own Words',
        body: "The Quran records Isa as saying: And indeed Allah is my Lord and your Lord, so worship Him. This is the straight path. (Aal Imran 3:51). He directed every question, every miracle, every moment of his life toward the same destination — Allah alone.",
      },
    ],
    ramadanLesson: "Isa was given the Injeel — his scripture was guidance and light. In Ramadan, as you engage with the Quran, remember that it is the final book sent to confirm and complete what came before. Reading it in Ramadan carries a special honour — this is the month in which it was revealed.",
  },

  {
    id: 'muhammad',
    name: 'Muhammad',
    nameAr: 'محمد صلى الله عليه وسلم',
    title: 'The Final Messenger and His Ramadan',
    summary: "The Prophet ﷺ was the seal of all the prophets. His relationship with Ramadan was unlike any other month. In it he was at his most generous, his most devoted, and his most present with Allah.",
    sections: [
      {
        heading: 'The First Revelation',
        body: "The Quran was revealed in Ramadan. The Prophet ﷺ was alone in the Cave of Hira, in worship, when Jibril came to him and said: Read. He said: I cannot read. Jibril embraced him tightly, then released him, then said again: Read. This happened three times. Then came the first words: Read in the name of your Lord who created. Created man from a clinging substance. Read, and your Lord is the most Generous. (Al-Alaq 96:1–3). The Quran entered the world in this month.",
        arabic: 'اقْرَأْ بِاسْمِ رَبِّكَ الَّذِي خَلَقَ',
        source: 'Al-Alaq 96:1',
      },
      {
        heading: 'More Generous Than the Wind',
        body: "Ibn Abbas reported: The Prophet ﷺ was the most generous of people, and he was most generous in Ramadan when Jibril would meet him. Jibril would meet him every night in Ramadan and review the Quran with him. The Prophet ﷺ when Jibril met him was more generous in goodness than the blowing wind. (Al-Bukhari 3220). His generosity in Ramadan was not just in charity — it was in time, in presence, in forgiveness, in kindness.",
      },
      {
        heading: 'The Last Ten Nights',
        body: "When the last ten nights of Ramadan entered, the Prophet ﷺ would tighten his belt, spend the nights in prayer, and wake his family. (Al-Bukhari 2024). This was not a formality. This was striving. The Prophet ﷺ sought Laylat al-Qadr with full effort — the night that is better than a thousand months.",
      },
      {
        heading: 'I\'tikaf — Complete Withdrawal',
        body: "The Prophet ﷺ would make i\'tikaf in the masjid during the last ten days of Ramadan every year until he died. After his death, his wives continued the practice. I\'tikaf is a retreat — withdrawing from the world to be completely with Allah. In these days, the world shrinks and only the relationship with Allah remains.",
      },
      {
        heading: 'His Du\'a for Laylat al-Qadr',
        body: "Aisha asked: O Messenger of Allah, if I find Laylat al-Qadr, what should I say? He said: Say:",
        arabic: 'اللَّهُمَّ إِنَّكَ عَفُوٌّ تُحِبُّ الْعَفْوَ فَاعْفُ عَنِّي',
        source: 'At-Tirmidhi 3513 — "O Allah, You are the Pardoner, You love to pardon, so pardon me."',
      },
    ],
    ramadanLesson: "Follow the Prophet ﷺ. Not just in the obligatory acts, but in the spirit he brought to Ramadan — in generosity, in devotion, in seeking Laylat al-Qadr with the last breath of the month. The Quran was revealed in this month. Make it the month you return to the Quran.",
  },
]
