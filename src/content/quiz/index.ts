import type { QuizCategory, QuizQuestion } from '@/types/musabaqah'
import { GENERAL_ISLAM_QUESTIONS } from './general-islam-data'
import { PROPHET_STORIES_QUESTIONS } from './prophet-stories-data'
import { QURAN_QUESTIONS } from './quran-data'
import { SUNNAH_QUESTIONS } from './sunnah-data'
import { HISTORY_QUESTIONS } from './history-data'

export const QUESTIONS_BY_CATEGORY: Record<QuizCategory, QuizQuestion[]> = {
  general: GENERAL_ISLAM_QUESTIONS,
  prophets: PROPHET_STORIES_QUESTIONS,
  quran: QURAN_QUESTIONS,
  sunnah: SUNNAH_QUESTIONS,
  history: HISTORY_QUESTIONS,
  names: [],
}

/** Returns `count` randomly shuffled questions from the given category. */
export function selectQuizQuestions(category: QuizCategory, count: number): QuizQuestion[] {
  const bank = QUESTIONS_BY_CATEGORY[category]
  if (bank.length === 0) return []
  const shuffled = [...bank].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, Math.min(count, shuffled.length))
}

export { GENERAL_ISLAM_QUESTIONS, PROPHET_STORIES_QUESTIONS, QURAN_QUESTIONS, SUNNAH_QUESTIONS, HISTORY_QUESTIONS }
