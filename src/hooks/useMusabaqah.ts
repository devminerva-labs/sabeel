// src/hooks/useMusabaqah.ts
import { useRef, useEffect, useState, useCallback } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import type { RealtimeChannel } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase/client'
import { useAuth } from '@/hooks/useAuth'
import { startSession, getResults, deleteSession } from '@/lib/api/musabaqah.api'
import type { SessionId, QuizMember, PlayerScore, QuizSession } from '@/types/musabaqah'

export type QuizView = 'landing' | 'lobby' | 'quiz' | 'results'

export function useMusabaqah() {
  const { user } = useAuth()
  const qc = useQueryClient()
  const channelRef = useRef<RealtimeChannel | null>(null)
  const hasEndedRef = useRef(false)

  const [view, setView] = useState<QuizView>('landing')
  const [sessionId, setSessionId] = useState<SessionId | null>(null)
  const [members, setMembers] = useState<QuizMember[]>([])
  const [endsAt, setEndsAt] = useState<number | null>(null)
  const [scores, setScores] = useState<PlayerScore[] | null>(null)

  // Fetch session details (for question_ids, invite_code, max_players, etc.)
  const { data: session } = useQuery({
    queryKey: ['musabaqah-session', sessionId],
    queryFn: async () => {
      if (!supabase || !sessionId) return null
      const { data } = await supabase
        .from('quiz_sessions')
        .select('*')
        .eq('id', sessionId)
        .single()
      return data as QuizSession | null   // cast so max_players is typed correctly
    },
    enabled: !!sessionId,
    staleTime: 30_000,
  })

  // Subscribe to Supabase Realtime (Presence + Broadcast) — multiplayer only
  useEffect(() => {
    if (!supabase || !sessionId || !user) return
    if (session === undefined) return          // still loading — wait for session to resolve
    if (session?.max_players === 1) return     // solo — no channel needed
    if (channelRef.current) return             // already subscribed

    const ch = supabase.channel(`musabaqah:${sessionId}`, {
      config: { presence: { key: user.id } },
    })

    ch
      .on('presence', { event: 'sync' }, () => {
        const state = ch.presenceState<{ user_id: string; nickname: string }>()
        const list = Object.values(state)
          .filter(entries => entries.length > 0)
          .map(entries => ({
            userId: entries[0]!.user_id,
            nickname: entries[0]!.nickname,
          }))
        setMembers(list)
      })
      .on('broadcast', { event: 'quiz_start' }, ({ payload }: { payload: { startedAt: number; endsAt: number } }) => {
        setEndsAt(payload.endsAt)
        setView('quiz')
      })
      .on('broadcast', { event: 'quiz_end' }, async () => {
        await fetchResultsRef.current()
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await ch.track({ user_id: user.id, nickname: user.email ?? 'Player' })
        }
      })

    channelRef.current = ch

    return () => {
      if (channelRef.current) {
        supabase!.removeChannel(channelRef.current)
        channelRef.current = null
      }
    }
  }, [sessionId, user?.id, session?.max_players]) // eslint-disable-line react-hooks/exhaustive-deps

  // Use a ref so the broadcast closure always sees the latest version
  const fetchResultsRef = useRef(async () => {})

  // Guard is here (not in handleTimerEnd) so both the timer path and the
  // broadcast-receive path are deduplicated by one ref.
  const fetchResults = useCallback(async () => {
    if (hasEndedRef.current) return
    hasEndedRef.current = true
    if (!sessionId || !user) return
    const { data } = await getResults(sessionId)
    if (!data) return
    const mapped: PlayerScore[] = data.map((row: { user_id: string; nickname: string; score: number }) => ({
      userId: row.user_id,
      nickname: row.nickname,
      score: Number(row.score),
      isMe: row.user_id === user.id,
    }))
    setScores(mapped)
    setView('results')
  }, [sessionId, user?.id]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    fetchResultsRef.current = fetchResults
  }, [fetchResults])

  // Host broadcasts quiz_start and updates DB (multiplayer only)
  const handleStartQuiz = useCallback(async () => {
    if (!sessionId || !channelRef.current) return
    const now = Date.now()
    const endsAtTs = now + 180_000 // 3 minutes
    await startSession(sessionId)
    channelRef.current.send({
      type: 'broadcast',
      event: 'quiz_start',
      payload: { startedAt: now, endsAt: endsAtTs },
    })
    setEndsAt(endsAtTs)
    setView('quiz')
  }, [sessionId])

  // Called when timer runs out — broadcast for other players, then fetch locally
  const handleTimerEnd = useCallback(async () => {
    if (channelRef.current) {
      channelRef.current.send({ type: 'broadcast', event: 'quiz_end', payload: { endedAt: Date.now() } })
    }
    await fetchResults()
  }, [fetchResults])

  // Session created — for solo (max_players=1): skip lobby, start immediately.
  // Uses `id` directly to avoid depending on sessionId state being set first.
  const handleSessionCreated = useCallback(async (id: SessionId, maxPlayers: 1 | 2 | 3 | 4) => {
    setSessionId(id)
    if (maxPlayers === 1) {
      const endsAtTs = Date.now() + 180_000
      await startSession(id)
      setEndsAt(endsAtTs)
      setView('quiz')
      return
    }
    setView('lobby')
  }, [])

  const handleSessionJoined = useCallback((id: SessionId) => {
    setSessionId(id)
    setView('lobby')
  }, [])

  const isHost = session?.host_id === user?.id

  const handleDismissResults = useCallback(async () => {
    if (sessionId && isHost) {
      await deleteSession(sessionId)
    }
    if (sessionId) {
      qc.removeQueries({ queryKey: ['musabaqah-session', sessionId] })
    }
    hasEndedRef.current = false   // reset so the next game's timer fires correctly
    setSessionId(null)
    setScores(null)
    setMembers([])
    setEndsAt(null)
    setView('landing')
  }, [sessionId, isHost, qc])

  return {
    view,
    session,
    sessionId,
    members,
    endsAt,
    scores,
    isHost,
    handleSessionCreated,
    handleSessionJoined,
    handleStartQuiz,
    handleTimerEnd,
    handleDismissResults,
  }
}
