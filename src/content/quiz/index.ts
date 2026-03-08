import type { QuizCategory, QuizQuestion } from '@/types/musabaqah'
import { GENERAL_ISLAM_QUESTIONS } from './general-islam-data'
import { PROPHET_STORIES_QUESTIONS } from './prophet-stories-data'

export const QUESTIONS_BY_CATEGORY: Record<QuizCategory, QuizQuestion[]> = {
  general: GENERAL_ISLAM_QUESTIONS,
  prophets: PROPHET_STORIES_QUESTIONS,
  // Post-MVP categories — add data files when ready:
  quran: [],
  history: [],
  sunnah: [],
  names: [],
}

/** Returns `count` randomly shuffled questions from the given category. */
export function selectQuizQuestions(category: QuizCategory, count: number): QuizQuestion[] {
  const bank = QUESTIONS_BY_CATEGORY[category]
  if (bank.length === 0) return []
  const shuffled = [...bank].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, Math.min(count, shuffled.length))
}

export { GENERAL_ISLAM_QUESTIONS, PROPHET_STORIES_QUESTIONS }
