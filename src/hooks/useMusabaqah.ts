// src/hooks/useMusabaqah.ts
import { useRef, useEffect, useState, useCallback } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import type { RealtimeChannel } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase/client'
import { useAuth } from '@/hooks/useAuth'
import { startSession, getResults, deleteSession } from '@/lib/api/musabaqah.api'
import type { SessionId, QuizMember, PlayerScore } from '@/types/musabaqah'

export type QuizView = 'landing' | 'lobby' | 'quiz' | 'results'

export function useMusabaqah() {
  const { user } = useAuth()
  const qc = useQueryClient()
  const channelRef = useRef<RealtimeChannel | null>(null)

  const [view, setView] = useState<QuizView>('landing')
  const [sessionId, setSessionId] = useState<SessionId | null>(null)
  const [members, setMembers] = useState<QuizMember[]>([])
  const [endsAt, setEndsAt] = useState<number | null>(null)
  const [scores, setScores] = useState<PlayerScore[] | null>(null)

  // Fetch session details (for question_ids, invite_code, etc.)
  const { data: session } = useQuery({
    queryKey: ['musabaqah-session', sessionId],
    queryFn: async () => {
      if (!supabase || !sessionId) return null
      const { data } = await supabase
        .from('quiz_sessions')
        .select('*')
        .eq('id', sessionId)
        .single()
      return data
    },
    enabled: !!sessionId,
    staleTime: 30_000,
  })

  // Subscribe to Supabase Realtime (Presence + Broadcast)
  useEffect(() => {
    if (!supabase || !sessionId || !user) return
    if (channelRef.current) return // already subscribed

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
  }, [sessionId, user?.id]) // eslint-disable-line react-hooks/exhaustive-deps

  // Use a ref so the broadcast closure always sees the latest version
  const fetchResultsRef = useRef(async () => {})

  const fetchResults = useCallback(async () => {
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

  // Host broadcasts quiz_start and updates DB
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

  // Called when timer runs out (both clients call independently)
  const handleTimerEnd = useCallback(async () => {
    if (!channelRef.current) return
    channelRef.current.send({ type: 'broadcast', event: 'quiz_end', payload: { endedAt: Date.now() } })
    await fetchResults()
  }, [fetchResults])

  const handleSessionCreated = useCallback((id: SessionId) => {
    setSessionId(id)
    setView('lobby')
  }, [])

  const handleSessionJoined = useCallback((id: SessionId) => {
    setSessionId(id)
    setView('lobby')
  }, [])

  const handleDismissResults = useCallback(async () => {
    if (sessionId) {
      await deleteSession(sessionId)
      qc.removeQueries({ queryKey: ['musabaqah-session', sessionId] })
    }
    setSessionId(null)
    setScores(null)
    setMembers([])
    setEndsAt(null)
    setView('landing')
  }, [sessionId, qc])

  return {
    view,
    session,
    sessionId,
    members,
    endsAt,
    scores,
    isHost: session?.host_id === user?.id,
    handleSessionCreated,
    handleSessionJoined,
    handleStartQuiz,
    handleTimerEnd,
    handleDismissResults,
  }
}
