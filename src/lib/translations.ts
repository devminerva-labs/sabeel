// Static translations — no i18n library needed for ~40 strings
const translations = {
  en: {
    appName: 'Sabeel',
    dashboard: 'Dashboard',
    tracker: 'Tracker',
    adhkar: 'Adhkar',
    settings: 'Settings',
    juz: 'Juz',
    progress: 'Progress',
    completed: 'Completed',
    inProgress: 'In Progress',
    notStarted: 'Not Started',
    catchUp: 'Catch-Up',
    onTrack: 'On Track',
    behind: 'Behind Schedule',
    morning: 'Morning',
    evening: 'Evening',
    afterPrayer: 'After Prayer',
    beforeSleep: 'Before Sleep',
    anxiety: 'Anxiety & Stress',
    darkMode: 'Dark Mode',
    lightMode: 'Light Mode',
    offline: 'Offline',
    syncing: 'Syncing...',
    synced: 'Synced',
    startTracking: 'Start tracking your Quran journey',
    startJourney: 'Start your journey',
    ramadanNotActive: 'Ramadan has not started yet',
  },
  ar: {
    appName: 'سبيل',
    dashboard: 'الرئيسية',
    tracker: 'المتابعة',
    adhkar: 'الأذكار',
    settings: 'الإعدادات',
    juz: 'جزء',
    progress: 'التقدم',
    completed: 'مكتمل',
    inProgress: 'جاري',
    notStarted: 'لم يبدأ',
    catchUp: 'اللحاق',
    onTrack: 'على المسار',
    behind: 'متأخر',
    morning: 'الصباح',
    evening: 'المساء',
    afterPrayer: 'بعد الصلاة',
    beforeSleep: 'قبل النوم',
    anxiety: 'القلق والتوتر',
    darkMode: 'الوضع الداكن',
    lightMode: 'الوضع الفاتح',
    offline: 'غير متصل',
    syncing: 'جاري المزامنة...',
    synced: 'تمت المزامنة',
    startTracking: 'ابدأ تتبع رحلتك مع القرآن',
    startJourney: 'ابدأ رحلتك',
    ramadanNotActive: 'لم يبدأ رمضان بعد',
  },
} as const

export type Language = keyof typeof translations
export type TranslationKey = keyof (typeof translations)['en']

export function t(key: TranslationKey, lang: Language = 'en'): string {
  return translations[lang][key]
}

export default translations
