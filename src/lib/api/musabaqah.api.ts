// src/lib/api/musabaqah.api.ts
import { supabase } from '@/lib/supabase/client'
import { SessionId } from '@/types/musabaqah'
import type { QuizCategory } from '@/types/musabaqah'

// Create a new session (host calls this after picking category + selecting questions)
export async function createSession(category: QuizCategory, questionIds: string[], nickname: string, maxPlayers: 1 | 2 | 3 | 4 = 2) {
  if (!supabase) return { data: null, error: new Error('No connection') }
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { data: null, error: new Error('Not authenticated') }

  // Insert session
  const { data: session, error: sessionError } = await supabase
    .from('quiz_sessions')
    .insert({ category, question_ids: questionIds, host_id: user.id, max_players: maxPlayers })
    .select()
    .single()
  if (sessionError || !session) return { data: null, error: sessionError }

  // Insert host as first member
  const { error: memberError } = await supabase
    .from('quiz_session_members')
    .insert({ session_id: session.id, user_id: user.id, nickname })
  if (memberError) return { data: null, error: memberError }

  return { data: { ...session, id: SessionId(session.id) }, error: null }
}

// Join by invite code — single atomic RPC: lookup + capacity check + insert in one transaction.
// The DB uses FOR UPDATE on the session row to prevent concurrent over-joining (TOCTOU fix).
export async function joinByCode(code: string, nickname: string) {
  if (!supabase) return { data: null, error: new Error('No connection') }

  const { data, error } = await supabase.rpc('join_quiz_session', {
    p_invite_code: code.trim().toUpperCase(),
    p_nickname:    nickname,
  })

  if (error) {
    // Map DB error messages to user-friendly strings
    const msg = error.message ?? ''
    if (msg.includes('session_full'))                      return { data: null, error: new Error(error.hint ?? 'This game is full') }
    if (msg.includes('Code not found') || msg.includes('P0002')) return { data: null, error: new Error('Code not found or game already started') }
    return { data: null, error }
  }

  const session = Array.isArray(data) ? data[0] : data
  if (!session) return { data: null, error: new Error('Code not found or game already started') }

  return { data: { ...session, id: SessionId(session.id) }, error: null }
}

// Host starts the quiz
export async function startSession(sessionId: SessionId) {
  if (!supabase) return { error: new Error('No connection') }
  const { error } = await supabase
    .from('quiz_sessions')
    .update({ status: 'active', started_at: new Date().toISOString() })
    .eq('id', sessionId)
  return { error }
}

// Submit one answer — userId is passed in to avoid a getUser() network call per question
export async function submitAnswer(
  sessionId: SessionId,
  userId: string,
  questionIdx: number,
  answer: 'A' | 'B' | 'C' | 'D',
  isCorrect: boolean,
) {
  if (!supabase) return { error: new Error('No connection') }
  const { error } = await supabase
    .from('quiz_answers')
    .upsert(
      { session_id: sessionId, user_id: userId, question_idx: questionIdx, answer, is_correct: isCorrect },
      { onConflict: 'session_id,user_id,question_idx' },
    )
  return { error }
}

// Fetch results (called by both players when timer ends)
export async function getResults(sessionId: SessionId) {
  if (!supabase) return { data: null, error: new Error('No connection') }
  const { data, error } = await supabase.rpc('get_quiz_results', { p_session_id: sessionId })
  return { data, error }
}

// Delete session after results shown
export async function deleteSession(sessionId: SessionId) {
  if (!supabase) return
  await supabase.rpc('delete_quiz_session', { p_session_id: sessionId })
}
