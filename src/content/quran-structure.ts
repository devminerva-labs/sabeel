/**
 * Complete Quran Structure Data
 * 
 * Total Surahs: 114
 * Total Verses: 6,236 (Hafs narration)
 */

// Verse count for each of the 114 surahs
export const SURAH_VERSE_COUNTS: Record<number, number> = {
  1: 7,    // Al-Fatiha
  2: 286,  // Al-Baqarah
  3: 200,  // Aal-Imran
  4: 176,  // An-Nisa
  5: 120,  // Al-Ma'idah
  6: 165,  // Al-An'am
  7: 206,  // Al-A'raf
  8: 75,   // Al-Anfal
  9: 129,  // At-Tawbah
  10: 109, // Yunus
  11: 123, // Hud
  12: 111, // Yusuf
  13: 43,  // Ar-Ra'd
  14: 52,  // Ibrahim
  15: 99,  // Al-Hijr
  16: 128, // An-Nahl
  17: 111, // Al-Isra
  18: 110, // Al-Kahf
  19: 98,  // Maryam
  20: 135, // Ta-Ha
  21: 112, // Al-Anbiya
  22: 78,  // Al-Hajj
  23: 118, // Al-Mu'minun
  24: 64,  // An-Nur
  25: 77,  // Al-Furqan
  26: 227, // Ash-Shuara
  27: 93,  // An-Naml
  28: 88,  // Al-Qasas
  29: 69,  // Al-Ankabut
  30: 60,  // Ar-Rum
  31: 34,  // Luqman
  32: 30,  // As-Sajdah
  33: 73,  // Al-Ahzab
  34: 54,  // Saba
  35: 45,  // Fatir
  36: 83,  // Ya-Sin
  37: 182, // As-Saffat
  38: 88,  // Sad
  39: 75,  // Az-Zumar
  40: 85,  // Ghafir
  41: 54,  // Fussilat
  42: 53,  // Ash-Shura
  43: 89,  // Az-Zukhruf
  44: 59,  // Ad-Dukhan
  45: 37,  // Al-Jathiyah
  46: 35,  // Al-Ahqaf
  47: 38,  // Muhammad
  48: 29,  // Al-Fath
  49: 18,  // Al-Hujurat
  50: 45,  // Qaf
  51: 60,  // Adh-Dhariyat
  52: 49,  // At-Tur
  53: 62,  // An-Najm
  54: 55,  // Al-Qamar
  55: 78,  // Ar-Rahman
  56: 96,  // Al-Waqi'ah
  57: 29,  // Al-Hadid
  58: 22,  // Al-Mujadilah
  59: 24,  // Al-Hashr
  60: 13,  // Al-Mumtahanah
  61: 14,  // As-Saff
  62: 11,  // Al-Jumu'ah
  63: 11,  // Al-Munafiqun
  64: 18,  // At-Taghabun
  65: 12,  // At-Talaq
  66: 12,  // At-Tahrim
  67: 30,  // Al-Mulk
  68: 52,  // Al-Qalam
  69: 52,  // Al-Haqqah
  70: 44,  // Al-Ma'arij
  71: 28,  // Nuh
  72: 28,  // Al-Jinn
  73: 20,  // Al-Muzzammil
  74: 56,  // Al-Muddaththir
  75: 40,  // Al-Qiyamah
  76: 31,  // Al-Insan
  77: 50,  // Al-Mursalat
  78: 40,  // An-Naba
  79: 46,  // An-Nazi'at
  80: 42,  // Abasa
  81: 29,  // At-Takwir
  82: 19,  // Al-Infitar
  83: 36,  // Al-Mutaffifin
  84: 25,  // Al-Inshiqaq
  85: 22,  // Al-Buruj
  86: 17,  // At-Tariq
  87: 19,  // Al-A'la
  88: 26,  // Al-Ghashiyah
  89: 30,  // Al-Fajr
  90: 20,  // Al-Balad
  91: 15,  // Ash-Shams
  92: 21,  // Al-Layl
  93: 11,  // Ad-Duha
  94: 8,   // Ash-Sharh
  95: 8,   // At-Tin
  96: 19,  // Al-Alaq
  97: 5,   // Al-Qadr
  98: 8,   // Al-Bayyinah
  99: 8,   // Az-Zalzalah
  100: 11, // Al-Adiyat
  101: 11, // Al-Qari'ah
  102: 8,  // At-Takathur
  103: 3,  // Al-Asr
  104: 9,  // Al-Humazah
  105: 5,  // Al-Fil
  106: 4,  // Quraysh
  107: 7,  // Al-Ma'un
  108: 3,  // Al-Kawthar
  109: 6,  // Al-Kafirun
  110: 3,  // An-Nasr
  111: 5,  // Al-Masad
  112: 4,  // Al-Ikhlas
  113: 5,  // Al-Falaq
  114: 6,  // An-Nas
}

// Juz structure: which surahs (and verse counts) are in each juz
export interface JuzStructure {
  surahs: number[]           // Surah numbers in this juz
  verseCounts: Record<number, number>  // How many verses of each surah in this juz
  totalVerses: number
}

export const JUZ_STRUCTURE: Record<number, JuzStructure> = {
  // Juz 1: Al-Fatiha 1:1 - Al-Baqarah 2:141
  1: { surahs: [1, 2], verseCounts: { 1: 7, 2: 141 }, totalVerses: 148 },
  
  // Juz 2: Al-Baqarah 2:142 - 2:252
  2: { surahs: [2], verseCounts: { 2: 111 }, totalVerses: 111 },
  
  // Juz 3: Al-Baqarah 2:253 - Aal-Imran 3:92
  3: { surahs: [2, 3], verseCounts: { 2: 34, 3: 92 }, totalVerses: 126 },
  
  // Juz 4: Aal-Imran 3:93 - An-Nisa 4:23
  4: { surahs: [3, 4], verseCounts: { 3: 108, 4: 23 }, totalVerses: 131 },
  
  // Juz 5: An-Nisa 4:24 - 4:147
  5: { surahs: [4], verseCounts: { 4: 124 }, totalVerses: 124 },
  
  // Juz 6: An-Nisa 4:148 - Al-Ma'idah 5:81
  6: { surahs: [4, 5], verseCounts: { 4: 29, 5: 81 }, totalVerses: 110 },
  
  // Juz 7: Al-Ma'idah 5:82 - Al-An'am 6:110
  7: { surahs: [5, 6], verseCounts: { 5: 39, 6: 110 }, totalVerses: 149 },
  
  // Juz 8: Al-An'am 6:111 - Al-A'raf 7:87
  8: { surahs: [6, 7], verseCounts: { 6: 55, 7: 87 }, totalVerses: 142 },
  
  // Juz 9: Al-A'raf 7:88 - Al-Anfal 8:40
  9: { surahs: [7, 8], verseCounts: { 7: 119, 8: 40 }, totalVerses: 159 },
  
  // Juz 10: Al-Anfal 8:41 - At-Tawbah 9:92
  10: { surahs: [8, 9], verseCounts: { 8: 35, 9: 92 }, totalVerses: 127 },
  
  // Juz 11: At-Tawbah 9:93 - Hud 11:5
  11: { surahs: [9, 10, 11], verseCounts: { 9: 37, 10: 109, 11: 5 }, totalVerses: 151 },
  
  // Juz 12: Hud 11:6 - Yusuf 12:52
  12: { surahs: [11, 12], verseCounts: { 11: 118, 12: 52 }, totalVerses: 170 },
  
  // Juz 13: Yusuf 12:53 - Ibrahim 14:52
  13: { surahs: [12, 13, 14], verseCounts: { 12: 59, 13: 43, 14: 52 }, totalVerses: 154 },
  
  // Juz 14: Al-Hijr 15:1 - An-Nahl 16:128
  14: { surahs: [15, 16], verseCounts: { 15: 99, 16: 128 }, totalVerses: 227 },
  
  // Juz 15: Al-Isra 17:1 - Al-Kahf 18:74
  15: { surahs: [17, 18], verseCounts: { 17: 111, 18: 74 }, totalVerses: 185 },
  
  // Juz 16: Al-Kahf 18:75 - Ta-Ha 20:135
  16: { surahs: [18, 19, 20], verseCounts: { 18: 36, 19: 98, 20: 135 }, totalVerses: 269 },
  
  // Juz 17: Al-Anbiya 21:1 - Al-Hajj 22:78
  17: { surahs: [21, 22], verseCounts: { 21: 112, 22: 78 }, totalVerses: 190 },
  
  // Juz 18: Al-Mu'minun 23:1 - Al-Furqan 25:20
  18: { surahs: [23, 24, 25], verseCounts: { 23: 118, 24: 64, 25: 20 }, totalVerses: 202 },
  
  // Juz 19: Al-Furqan 25:21 - An-Naml 27:55
  19: { surahs: [25, 26, 27], verseCounts: { 25: 57, 26: 227, 27: 55 }, totalVerses: 339 },
  
  // Juz 20: An-Naml 27:56 - Al-Ankabut 29:45
  20: { surahs: [27, 28, 29], verseCounts: { 27: 38, 28: 88, 29: 45 }, totalVerses: 171 },
  
  // Juz 21: Al-Ankabut 29:46 - Al-Ahzab 33:30
  21: { surahs: [29, 30, 31, 32, 33], verseCounts: { 29: 24, 30: 60, 31: 34, 32: 30, 33: 30 }, totalVerses: 178 },
  
  // Juz 22: Al-Ahzab 33:31 - Ya-Sin 36:27
  22: { surahs: [33, 34, 35, 36], verseCounts: { 33: 43, 34: 54, 35: 45, 36: 27 }, totalVerses: 169 },
  
  // Juz 23: Ya-Sin 36:28 - Az-Zumar 39:31
  23: { surahs: [36, 37, 38, 39], verseCounts: { 36: 56, 37: 182, 38: 88, 39: 31 }, totalVerses: 357 },
  
  // Juz 24: Az-Zumar 39:32 - Fussilat 41:46
  24: { surahs: [39, 40, 41], verseCounts: { 39: 44, 40: 85, 41: 46 }, totalVerses: 175 },
  
  // Juz 25: Fussilat 41:47 - Al-Jathiyah 45:37
  25: { surahs: [41, 42, 43, 44, 45], verseCounts: { 41: 8, 42: 53, 43: 89, 44: 59, 45: 37 }, totalVerses: 246 },
  
  // Juz 26: Al-Ahqaf 46:1 - Adh-Dhariyat 51:30
  26: { surahs: [46, 47, 48, 49, 50, 51], verseCounts: { 46: 35, 47: 38, 48: 29, 49: 18, 50: 45, 51: 30 }, totalVerses: 195 },
  
  // Juz 27: Adh-Dhariyat 51:31 - Al-Hadid 57:29
  27: { surahs: [51, 52, 53, 54, 55, 56, 57], verseCounts: { 51: 30, 52: 49, 53: 62, 54: 55, 55: 78, 56: 96, 57: 29 }, totalVerses: 399 },
  
  // Juz 28: Al-Mujadilah 58:1 - At-Tahrim 66:12
  28: { surahs: [58, 59, 60, 61, 62, 63, 64, 65, 66], verseCounts: { 58: 22, 59: 24, 60: 13, 61: 14, 62: 11, 63: 11, 64: 18, 65: 12, 66: 12 }, totalVerses: 137 },
  
  // Juz 29: Al-Mulk 67:1 - Al-Mursalat 77:50
  29: { surahs: [67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77], verseCounts: { 67: 30, 68: 52, 69: 52, 70: 44, 71: 28, 72: 28, 73: 20, 74: 56, 75: 40, 76: 31, 77: 50 }, totalVerses: 431 },
  
  // Juz 30: An-Naba 78:1 - An-Nas 114:6 (Juz Amma - all complete surahs)
  30: { 
    surahs: [78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114], 
    verseCounts: { 78: 40, 79: 46, 80: 42, 81: 29, 82: 19, 83: 36, 84: 25, 85: 22, 86: 17, 87: 19, 88: 26, 89: 30, 90: 20, 91: 15, 92: 21, 93: 11, 94: 8, 95: 8, 96: 19, 97: 5, 98: 8, 99: 8, 100: 11, 101: 11, 102: 8, 103: 3, 104: 9, 105: 5, 106: 4, 107: 7, 108: 3, 109: 6, 110: 3, 111: 5, 112: 4, 113: 5, 114: 6 }, 
    totalVerses: 564 
  },
}

// Helper: Get which juz a surah starts in
export function getJuzForSurah(surahNumber: number): number {
  for (let juz = 1; juz <= 30; juz++) {
    const structure = JUZ_STRUCTURE[juz]
    if (!structure) continue
    if (structure.surahs.includes(surahNumber)) {
      // Check if this is the first occurrence of this surah
      const firstInJuz = structure.surahs[0]
      if (firstInJuz === surahNumber) {
        return juz
      }
    }
  }
  return 1 // Default
}

// Helper: Get total verses for a surah
export function getSurahVerseCount(surahNumber: number): number {
  return SURAH_VERSE_COUNTS[surahNumber] ?? 0
}

// Helper: Get total verses in a juz
export function getJuzVerseCount(juzNumber: number): number {
  return JUZ_STRUCTURE[juzNumber]?.totalVerses ?? 0
}
