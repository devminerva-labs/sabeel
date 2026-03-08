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
  // Ref guard prevents double-start if host taps "Start Quiz" twice (bug 015)
  const startingRef = useRef(false)
  // Store the player's chosen nickname so presence shows it (not email) (bug 009)
  const nicknameRef = useRef<string>('Player')

  const [view, setView] = useState<QuizView>('landing')
  const [sessionId, setSessionId] = useState<SessionId | null>(null)
  const [members, setMembers] = useState<QuizMember[]>([])
  const [endsAt, setEndsAt] = useState<number | null>(null)
  const [scores, setScores] = useState<PlayerScore[] | null>(null)
  const [isStarting, setIsStarting] = useState(false)

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
      return data as QuizSession | null
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
          // Track with the player's chosen nickname — not their email (bug 009)
          await ch.track({ user_id: user.id, nickname: nicknameRef.current })
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
    if (!sessionId || !channelRef.current || startingRef.current) return
    startingRef.current = true
    setIsStarting(true)
    try {
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
    } finally {
      startingRef.current = false
      setIsStarting(false)
    }
  }, [sessionId])

  // Called when timer runs out — wait briefly for any in-flight answer writes, then fetch (bug 011)
  const handleTimerEnd = useCallback(async () => {
    if (channelRef.current) {
      channelRef.current.send({ type: 'broadcast', event: 'quiz_end', payload: { endedAt: Date.now() } })
    }
    // Small delay to let any fire-and-forget submitAnswer calls finish persisting (bug 011)
    await new Promise(r => setTimeout(r, 1500))
    await fetchResults()
  }, [fetchResults])

  // Session created — accept nickname to store for lobby presence (bug 009)
  // For solo (max_players=1): skip lobby, start immediately.
  const handleSessionCreated = useCallback(async (id: SessionId, maxPlayers: 1 | 2 | 3 | 4, nickname: string) => {
    nicknameRef.current = nickname
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

  // Session joined — store nickname for presence (bug 009)
  const handleSessionJoined = useCallback((id: SessionId, nickname: string) => {
    nicknameRef.current = nickname
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
    startingRef.current = false
    setSessionId(null)
    setScores(null)
    setMembers([])
    setEndsAt(null)
    setIsStarting(false)
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
    isStarting,
    handleSessionCreated,
    handleSessionJoined,
    handleStartQuiz,
    handleTimerEnd,
    handleDismissResults,
  }
}
