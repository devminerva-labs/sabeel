// src/types/musabaqah.ts

export type SessionId = string & { readonly _brand: 'SessionId' }
export const SessionId = (id: string): SessionId => id as SessionId

export type QuizCategory = 'general' | 'prophets' | 'quran' | 'history' | 'sunnah' | 'names'

export interface QuizQuestion {
  id: string
  category: QuizCategory
  question: string
  options: { A: string; B: string; C: string; D: string }
  correct: 'A' | 'B' | 'C' | 'D'
  explanation?: string
}

export interface QuizSession {
  id: SessionId
  invite_code: string
  category: QuizCategory
  status: 'lobby' | 'active' | 'finished'
  host_id: string
  question_ids: string[]
}

export interface QuizMember {
  userId: string
  nickname: string
}

export interface PlayerScore {
  userId: string
  nickname: string
  score: number   // out of 30
  isMe: boolean
}

export type QuizWinner = 'me' | 'opponent' | 'draw'

// All broadcast events on channel `musabaqah:{sessionId}`
export type QuizEvent =
  | { event: 'quiz_start'; payload: { startedAt: number; endsAt: number } }
  | { event: 'quiz_end';   payload: { endedAt: number } }
