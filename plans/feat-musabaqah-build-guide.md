# Musabaqah — Step-by-Step Build Guide

Everything is designed. The question bank is ready. This is the exact build order.

**Reference plan:** `plans/feat-multiplayer-islamic-quiz.md`
**Question bank:** `src/content/quiz/` (300 questions, ready)

---

## Build Order

```
Step 1 → Types
Step 2 → DB Migration
Step 3 → API module
Step 4 → Hook
Step 5 → Components (Lobby → Quiz → Results)
Step 6 → Page
Step 7 → Router + Dashboard card
Step 8 → Apply migration to Supabase
```

---

## Step 1 — Types `src/types/musabaqah.ts`

Create this file first. Everything else imports from it.

```typescript
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
  inviteCode: string
  category: QuizCategory
  status: 'lobby' | 'active' | 'finished'
  hostId: string
  questionIds: string[]
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
```

---

## Step 2 — DB Migration `supabase/migrations/012_musabaqah.sql`

```sql
-- quiz_sessions: one row per game session
CREATE TABLE quiz_sessions (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  invite_code  text NOT NULL UNIQUE
               DEFAULT upper(substring(md5(random()::text), 1, 6)),
  category     text NOT NULL
               CHECK (category IN ('general','prophets','quran','history','sunnah','names')),
  question_ids text[] NOT NULL,
  status       text NOT NULL DEFAULT 'lobby'
               CHECK (status IN ('lobby','active','finished')),
  host_id      uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  started_at   timestamptz,
  ended_at     timestamptz,
  created_at   timestamptz DEFAULT now()
);

-- quiz_session_members: who is in the session (max 2)
CREATE TABLE quiz_session_members (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid NOT NULL REFERENCES quiz_sessions(id) ON DELETE CASCADE,
  user_id    uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  nickname   text NOT NULL,
  joined_at  timestamptz DEFAULT now(),
  UNIQUE (session_id, user_id)
);

-- quiz_answers: one row per question per player
CREATE TABLE quiz_answers (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id   uuid NOT NULL REFERENCES quiz_sessions(id) ON DELETE CASCADE,
  user_id      uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  question_idx int NOT NULL CHECK (question_idx BETWEEN 0 AND 29),
  answer       text NOT NULL CHECK (answer IN ('A','B','C','D')),
  is_correct   boolean NOT NULL,
  UNIQUE (session_id, user_id, question_idx)
);

-- Indexes
CREATE INDEX idx_quiz_sessions_invite      ON quiz_sessions(invite_code);
CREATE INDEX idx_quiz_members_session      ON quiz_session_members(session_id);
CREATE INDEX idx_quiz_members_user         ON quiz_session_members(user_id);
CREATE INDEX idx_quiz_answers_session_user ON quiz_answers(session_id, user_id);

-- RLS
ALTER TABLE quiz_sessions        ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_session_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_answers         ENABLE ROW LEVEL SECURITY;

-- SECURITY DEFINER helper (avoids RLS recursion — same as is_halaqah_member pattern)
CREATE OR REPLACE FUNCTION is_quiz_member(p_session_id uuid, p_user_id uuid)
RETURNS boolean LANGUAGE sql SECURITY DEFINER STABLE SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM quiz_session_members
    WHERE session_id = p_session_id AND user_id = p_user_id
  );
$$;

-- quiz_sessions policies
CREATE POLICY "members_can_read_session"
  ON quiz_sessions FOR SELECT
  USING (is_quiz_member(id, auth.uid()));

CREATE POLICY "lobby_lookup_for_join"
  ON quiz_sessions FOR SELECT
  USING (auth.uid() IS NOT NULL AND status = 'lobby');

CREATE POLICY "host_can_create"
  ON quiz_sessions FOR INSERT
  WITH CHECK (host_id = auth.uid());

CREATE POLICY "host_can_update"
  ON quiz_sessions FOR UPDATE
  USING (host_id = auth.uid());

-- quiz_session_members policies
CREATE POLICY "members_can_read_members"
  ON quiz_session_members FOR SELECT
  USING (is_quiz_member(session_id, auth.uid()));

CREATE POLICY "user_can_join"
  ON quiz_session_members FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- quiz_answers policies
CREATE POLICY "members_can_read_answers"
  ON quiz_answers FOR SELECT
  USING (is_quiz_member(session_id, auth.uid()));

CREATE POLICY "user_submits_own_answers"
  ON quiz_answers FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- RPC: fetch both players' scores after the quiz
CREATE OR REPLACE FUNCTION get_quiz_results(p_session_id uuid)
RETURNS TABLE (user_id uuid, nickname text, score bigint)
LANGUAGE sql SECURITY DEFINER SET search_path = public AS $$
  SELECT m.user_id, m.nickname,
    COUNT(a.id) FILTER (WHERE a.is_correct = true) AS score
  FROM quiz_session_members m
  LEFT JOIN quiz_answers a
    ON a.session_id = m.session_id AND a.user_id = m.user_id
  WHERE m.session_id = p_session_id
  GROUP BY m.user_id, m.nickname;
$$;

-- RPC: delete session after results are shown (data cleanup)
CREATE OR REPLACE FUNCTION delete_quiz_session(p_session_id uuid)
RETURNS void LANGUAGE sql SECURITY DEFINER SET search_path = public AS $$
  DELETE FROM quiz_sessions
  WHERE id = p_session_id
    AND is_quiz_member(p_session_id, auth.uid());
$$;

GRANT EXECUTE ON FUNCTION is_quiz_member(uuid, uuid)    TO authenticated;
GRANT EXECUTE ON FUNCTION get_quiz_results(uuid)         TO authenticated;
GRANT EXECUTE ON FUNCTION delete_quiz_session(uuid)      TO authenticated;
```

---

## Step 3 — API Module `src/lib/api/musabaqah.api.ts`

Pattern: mirrors `halaqah.api.ts`. Every function starts with `if (!supabase) return`.

```typescript
// src/lib/api/musabaqah.api.ts
import { supabase } from '@/lib/supabase/client'
import { SessionId } from '@/types/musabaqah'
import type { QuizCategory } from '@/types/musabaqah'

// Create a new session (host calls this after picking category + selecting questions)
export async function createSession(category: QuizCategory, questionIds: string[], nickname: string) {
  if (!supabase) return { data: null, error: new Error('No connection') }
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { data: null, error: new Error('Not authenticated') }

  // Insert session
  const { data: session, error: sessionError } = await supabase
    .from('quiz_sessions')
    .insert({ category, question_ids: questionIds, host_id: user.id })
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

// Join by invite code (guest calls this)
export async function joinByCode(code: string, nickname: string) {
  if (!supabase) return { data: null, error: new Error('No connection') }
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { data: null, error: new Error('Not authenticated') }

  // Look up session
  const { data: session, error: lookupError } = await supabase
    .from('quiz_sessions')
    .select('*')
    .eq('invite_code', code.trim().toUpperCase())
    .eq('status', 'lobby')
    .single()
  if (lookupError || !session) return { data: null, error: new Error('Code not found or game already started') }

  // Check member count (enforce 2-player cap)
  const { count } = await supabase
    .from('quiz_session_members')
    .select('*', { count: 'exact', head: true })
    .eq('session_id', session.id)
  if ((count ?? 0) >= 2) return { data: null, error: new Error('This game already has 2 players') }

  // Join
  const { error: joinError } = await supabase
    .from('quiz_session_members')
    .insert({ session_id: session.id, user_id: user.id, nickname })
  if (joinError) return { data: null, error: joinError }

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

// Submit one answer
export async function submitAnswer(
  sessionId: SessionId,
  questionIdx: number,
  answer: 'A' | 'B' | 'C' | 'D',
  isCorrect: boolean,
) {
  if (!supabase) return { error: new Error('No connection') }
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: new Error('Not authenticated') }
  const { error } = await supabase
    .from('quiz_answers')
    .upsert(
      { session_id: sessionId, user_id: user.id, question_idx: questionIdx, answer, is_correct: isCorrect },
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
```

---

## Step 4 — Hook `src/hooks/useMusabaqah.ts`

One hook. Owns both TanStack Query (lobby/results) and Supabase Realtime (active quiz).
Key: `channelRef` prevents duplicate subscriptions on re-render.

```typescript
// src/hooks/useMusabaqah.ts
import { useRef, useEffect, useState, useCallback } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import type { RealtimeChannel } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase/client'
import { useAuth } from '@/hooks/useAuth'
import { startSession, getResults, deleteSession } from '@/lib/api/musabaqah.api'
import type { SessionId, QuizEvent, QuizMember, PlayerScore } from '@/types/musabaqah'

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
        const list = Object.values(state).map(entries => ({
          userId: entries[0].user_id,
          nickname: entries[0].nickname,
        }))
        setMembers(list)
      })
      .on('broadcast', { event: 'quiz_start' }, ({ payload }: { payload: QuizEvent['payload'] & { endsAt: number } }) => {
        setEndsAt(payload.endsAt)
        setView('quiz')
      })
      .on('broadcast', { event: 'quiz_end' }, async () => {
        await fetchResults()
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await ch.track({ user_id: user.id, nickname: user.email ?? 'Player' })
        }
      })

    channelRef.current = ch

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current)
        channelRef.current = null
      }
    }
  }, [sessionId, user?.id])

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
  }, [sessionId, user?.id])

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
    if (!sessionId || !channelRef.current) return
    channelRef.current.send({ type: 'broadcast', event: 'quiz_end', payload: { endedAt: Date.now() } })
    await fetchResults()
  }, [sessionId, fetchResults])

  const handleSessionCreated = useCallback((id: SessionId) => {
    setSessionId(id)
    setView('lobby')
  }, [])

  const handleSessionJoined = useCallback((id: SessionId) => {
    setSessionId(id)
    setView('lobby')
  }, [])

  const handleDismissResults = useCallback(async () => {
    if (sessionId) await deleteSession(sessionId)
    setSessionId(null)
    setSession(null)
    setScores(null)
    setMembers([])
    setEndsAt(null)
    setView('landing')
  }, [sessionId])

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
```

---

## Step 5 — Components

### `src/components/musabaqah/MusabaqahLobby.tsx`

```
Props:
  session         — QuizSession (for invite_code, category)
  members         — QuizMember[] (from Presence)
  isHost          — boolean
  onStart         — () => void (host only, enabled when members.length === 2)

UI:
  - Large invite code display + "Copy Code" button (navigator.clipboard.writeText)
  - "Waiting for opponent..." if members.length < 2
  - Member list: show both nicknames when 2 joined
  - "Start Quiz" button: disabled until 2 members, shown only to host
  - Category badge: "Category: Prophet Stories"
```

### `src/components/musabaqah/MusabaqahQuiz.tsx`

```
Props:
  session         — QuizSession (for question_ids)
  endsAt          — number (timestamp)
  onTimerEnd      — () => void
  onAnswer        — (idx, answer, isCorrect) => void

State:
  currentIdx      — number (0-29), advances after each answer
  selectedAnswer  — 'A'|'B'|'C'|'D'|null
  showFeedback    — boolean (true after answering, shows correct/wrong)
  score           — number (running total)
  timeLeft        — number (seconds remaining, computed from endsAt)

Logic:
  - Questions looked up from local bank using session.question_ids[currentIdx]
  - After answer: show feedback for 1.5s, then auto-advance to next question
  - If timeLeft <= 0: call onTimerEnd
  - Timer uses setInterval, clears on unmount

UI (all inlined, no child components):
  - Top bar: "Q{n+1} of 30" left, countdown timer right (MM:SS format)
  - Question card: question text
  - 4 option buttons (A/B/C/D): disabled after selection
  - After selection: correct button turns green, wrong turns red
  - Explanation text shown briefly after answer
  - Score running tally: "Score: {n}/30"
```

### `src/components/musabaqah/MusabaqahResults.tsx`

```
Props:
  scores          — PlayerScore[]
  onDismiss       — () => void (triggers data deletion)

Logic:
  myScore = scores.find(s => s.isMe)
  opponentScore = scores.find(s => !s.isMe)
  winner = myScore.score > opponentScore.score ? 'me'
         : myScore.score < opponentScore.score ? 'opponent' : 'draw'

UI:
  - Two score cards side by side: "You: 24/30" vs "Opponent: 19/30"
  - Winner line:
      me       → "You won! 🏆"
      opponent → "{nickname} wins!"
      draw     → "It's a draw — Mashallah!"
  - "Back to Home" button → calls onDismiss
```

---

## Step 6 — Page `src/pages/MusabaqahPage.tsx`

```typescript
// src/pages/MusabaqahPage.tsx
// Manages 4 views: landing | lobby | quiz | results
// Uses useMusabaqah() hook for all state

export function MusabaqahPage() {
  const { user } = useAuth()
  if (!user) return <NotLoggedIn />
  if (!supabase) return <NoConnection />

  const {
    view, session, members, endsAt, scores, isHost,
    handleSessionCreated, handleSessionJoined,
    handleStartQuiz, handleTimerEnd, handleDismissResults,
  } = useMusabaqah()

  // landing view: inlined category selector + code entry
  if (view === 'landing') {
    return (
      <LandingView
        onSessionCreated={handleSessionCreated}
        onSessionJoined={handleSessionJoined}
      />
    )
  }

  if (view === 'lobby' && session) {
    return (
      <MusabaqahLobby
        session={session}
        members={members}
        isHost={isHost}
        onStart={handleStartQuiz}
      />
    )
  }

  if (view === 'quiz' && session && endsAt) {
    return (
      <MusabaqahQuiz
        session={session}
        endsAt={endsAt}
        onTimerEnd={handleTimerEnd}
      />
    )
  }

  if (view === 'results' && scores) {
    return (
      <MusabaqahResults
        scores={scores}
        onDismiss={handleDismissResults}
      />
    )
  }

  return null
}

// LandingView is a local function component (not exported, not its own file)
// Shows: 2 category cards (General Knowledge / Prophet Stories) + join code input
// On create: selectQuizQuestions(category, 30) → createSession() → onSessionCreated
// On join:   joinByCode(code, nickname) → onSessionJoined
```

---

## Step 7 — Wire Up Router & Dashboard

### `src/router.tsx`

Add one lazy route inside the existing Layout:

```typescript
// Add to the children array inside the Layout route:
{
  path: 'musabaqah',
  element: (
    <Suspense fallback={<PageLoader />}>
      <ErrorBoundary>
        <MusabaqahPage />
      </ErrorBoundary>
    </Suspense>
  ),
},
```

And add the lazy import:
```typescript
const MusabaqahPage = lazyWithReload(() => import('./pages/MusabaqahPage'))
```

### `src/pages/DashboardPage.tsx`

Add a Musabaqah feature card. Follow the exact same pattern as the existing Halaqah card on the dashboard. Link to `/app/musabaqah`.

---

## Step 8 — Apply Migration to Supabase

```bash
# If using Supabase CLI:
supabase db push

# Or paste 012_musabaqah.sql directly in Supabase Dashboard > SQL Editor
```

After applying:
1. Go to Supabase Dashboard > Realtime > Tables
2. Enable Realtime on `quiz_sessions` and `quiz_session_members`
3. Verify the 3 RPCs appear under Database > Functions

---

## Checklist — In Order

```
[ ] Step 1: src/types/musabaqah.ts
[ ] Step 2: supabase/migrations/012_musabaqah.sql
[ ] Step 3: src/lib/api/musabaqah.api.ts
[ ] Step 4: src/hooks/useMusabaqah.ts
[ ] Step 5a: src/components/musabaqah/MusabaqahLobby.tsx
[ ] Step 5b: src/components/musabaqah/MusabaqahQuiz.tsx
[ ] Step 5c: src/components/musabaqah/MusabaqahResults.tsx
[ ] Step 6: src/pages/MusabaqahPage.tsx
[ ] Step 7a: src/router.tsx — add route
[ ] Step 7b: src/pages/DashboardPage.tsx — add card
[ ] Step 8: Apply migration + enable Realtime in Supabase dashboard
```

**Question bank is already done:** `src/content/quiz/` ✅

---

## Known Gotchas

| Issue | Fix |
|---|---|
| `channelRef.current` check in useEffect prevents double-subscribe on re-render | Already in the hook above |
| `lobby_lookup_for_join` policy has both SELECT policies — Supabase will OR them | This is correct; non-members can look up lobby-status sessions |
| `selectQuizQuestions` uses `Math.random()` — host generates the order | Store `question_ids` in DB at `createSession` so both clients use the same order |
| Timer drift | Both clients use `endsAt` absolute timestamp from the broadcast — not a relative countdown |
| `deleteSession` race condition | Both clients call it; second call is a no-op (row already deleted by cascade) |
| Supabase Realtime must be enabled on tables in the Dashboard | Manual step — easy to forget |

---

## References

- Plan: `plans/feat-multiplayer-islamic-quiz.md`
- Question bank: `src/content/quiz/`
- Halaqah invite code pattern: `src/lib/api/halaqah.api.ts`
- RLS recursion fix pattern: `supabase/migrations/003_fix_halaqah_rls_recursion.sql`
- Leaderboard RPC pattern: `supabase/migrations/008_leaderboard_rpc.sql`
- Hook pattern: `src/hooks/useHalaqah.ts`
- lazyWithReload pattern: `src/router.tsx`
