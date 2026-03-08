// src/pages/MusabaqahPage.tsx
import { useState, FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { useMusabaqah } from '@/hooks/useMusabaqah'
import { MusabaqahLobby } from '@/components/musabaqah/MusabaqahLobby'
import { MusabaqahQuiz } from '@/components/musabaqah/MusabaqahQuiz'
import { MusabaqahResults } from '@/components/musabaqah/MusabaqahResults'
import { createSession, joinByCode } from '@/lib/api/musabaqah.api'
import { selectQuizQuestions } from '@/content/quiz'
import { supabase } from '@/lib/supabase/client'
import type { QuizCategory, SessionId } from '@/types/musabaqah'

// ── Not logged in ─────────────────────────────────────────────

function NotLoggedIn() {
  return (
    <div className="space-y-6 text-center py-8">
      <div className="space-y-2">
        <p className="text-xl text-muted-foreground">مُسَابَقَة</p>
        <h1 className="text-2xl font-bold">Musabaqah</h1>
        <p className="text-sm text-muted-foreground max-w-xs mx-auto leading-relaxed">
          Sign in to challenge a friend to an Islamic knowledge quiz.
        </p>
      </div>
      <Link
        to="/login?next=/app/musabaqah"
        className="inline-block bg-primary text-primary-foreground px-6 py-2.5 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
      >
        Sign in to continue
      </Link>
      <p className="text-xs text-muted-foreground">The rest of Sabeel works without an account.</p>
    </div>
  )
}

// ── Categories ────────────────────────────────────────────────

const CATEGORIES: { id: QuizCategory; label: string; description: string; available: boolean }[] = [
  { id: 'general', label: 'General Knowledge', description: 'Pillars, faith, worship & more', available: true },
  { id: 'prophets', label: 'Prophet Stories', description: 'Stories of the 25 Quranic prophets', available: true },
  { id: 'quran', label: 'Quran', description: 'Coming soon', available: false },
  { id: 'history', label: 'Islamic History', description: 'Coming soon', available: false },
  { id: 'sunnah', label: 'Sunnah', description: 'Coming soon', available: false },
  { id: 'names', label: 'Names of Allah', description: 'Coming soon', available: false },
]

// ── Landing view ──────────────────────────────────────────────

function LandingView({
  onSessionCreated,
  onSessionJoined,
}: {
  onSessionCreated: (id: SessionId) => void
  onSessionJoined: (id: SessionId) => void
}) {
  const [mode, setMode] = useState<'menu' | 'create' | 'join'>('menu')
  const [selectedCategory, setSelectedCategory] = useState<QuizCategory>('general')
  const [nickname, setNickname] = useState('')
  const [joinCode, setJoinCode] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleCreate(e: FormEvent) {
    e.preventDefault()
    if (!nickname.trim()) return
    setLoading(true)
    setError(null)
    try {
      const questions = selectQuizQuestions(selectedCategory, 30)
      if (questions.length === 0) {
        setError('No questions available for this category.')
        return
      }
      const { data, error: err } = await createSession(selectedCategory, questions.map(q => q.id), nickname.trim())
      if (err || !data) {
        setError(err?.message ?? 'Failed to create session')
        return
      }
      onSessionCreated(data.id as SessionId)
    } finally {
      setLoading(false)
    }
  }

  async function handleJoin(e: FormEvent) {
    e.preventDefault()
    if (!nickname.trim() || !joinCode.trim()) return
    setLoading(true)
    setError(null)
    try {
      const { data, error: err } = await joinByCode(joinCode.trim(), nickname.trim())
      if (err || !data) {
        setError(err?.message ?? 'Failed to join session')
        return
      }
      onSessionJoined(data.id as SessionId)
    } finally {
      setLoading(false)
    }
  }

  if (mode === 'create') {
    return (
      <div className="space-y-6">
        <button onClick={() => setMode('menu')} className="text-sm text-primary font-medium hover:underline">
          ← Back
        </button>
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground uppercase tracking-wide">مُسَابَقَة</p>
          <h1 className="text-2xl font-bold text-foreground">Create a Quiz</h1>
        </div>
        <form onSubmit={handleCreate} className="space-y-5">
          {/* Nickname */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">Your nickname</label>
            <input
              type="text"
              value={nickname}
              onChange={e => setNickname(e.target.value)}
              placeholder="Enter your name"
              maxLength={30}
              required
              className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>

          {/* Category */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Category</label>
            <div className="grid grid-cols-1 gap-2">
              {CATEGORIES.filter(c => c.available).map(cat => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`text-left rounded-xl border px-4 py-3 transition-colors ${
                    selectedCategory === cat.id
                      ? 'border-primary bg-primary/10'
                      : 'border-border bg-background hover:bg-muted/30'
                  }`}
                >
                  <p className="text-sm font-semibold text-foreground">{cat.label}</p>
                  <p className="text-xs text-muted-foreground">{cat.description}</p>
                </button>
              ))}
            </div>
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <button
            type="submit"
            disabled={loading || !nickname.trim()}
            className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-base disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
          >
            {loading ? 'Creating...' : 'Create & Get Code'}
          </button>
        </form>
        <p className="text-xs text-center text-muted-foreground">30 questions · 3 minute time limit</p>
      </div>
    )
  }

  if (mode === 'join') {
    return (
      <div className="space-y-6">
        <button onClick={() => setMode('menu')} className="text-sm text-primary font-medium hover:underline">
          ← Back
        </button>
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground uppercase tracking-wide">مُسَابَقَة</p>
          <h1 className="text-2xl font-bold text-foreground">Join a Quiz</h1>
        </div>
        <form onSubmit={handleJoin} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">Your nickname</label>
            <input
              type="text"
              value={nickname}
              onChange={e => setNickname(e.target.value)}
              placeholder="Enter your name"
              maxLength={30}
              required
              className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">Invite code</label>
            <input
              type="text"
              value={joinCode}
              onChange={e => setJoinCode(e.target.value.toUpperCase())}
              placeholder="e.g. AB12CD"
              maxLength={6}
              required
              className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm font-mono text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 uppercase"
            />
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <button
            type="submit"
            disabled={loading || !nickname.trim() || joinCode.length < 6}
            className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-base disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
          >
            {loading ? 'Joining...' : 'Join Quiz'}
          </button>
        </form>
      </div>
    )
  }

  // Default menu
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <p className="text-muted-foreground">مُسَابَقَة</p>
        <h1 className="text-2xl font-bold text-foreground">Musabaqah</h1>
        <p className="text-sm text-muted-foreground max-w-xs mx-auto">
          Challenge a friend to an Islamic knowledge quiz. Race through 30 questions in 3 minutes.
        </p>
      </div>

      <div className="space-y-3">
        <button
          onClick={() => setMode('create')}
          className="w-full rounded-xl bg-primary text-primary-foreground py-4 font-semibold text-base hover:opacity-90 transition-opacity"
        >
          Create a Quiz
        </button>
        <button
          onClick={() => setMode('join')}
          className="w-full rounded-xl border border-border bg-background py-4 font-semibold text-base hover:bg-muted/30 transition-colors text-foreground"
        >
          Join with Code
        </button>
      </div>

      <div className="rounded-xl bg-muted/30 border border-border p-4 space-y-2">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">How it works</p>
        <ul className="space-y-1.5 text-sm text-muted-foreground">
          <li>• Create a quiz and share the 6-letter code</li>
          <li>• Both players race through 30 questions independently</li>
          <li>• 3-minute time limit — speed and accuracy matter</li>
          <li>• Scores revealed when time is up</li>
        </ul>
      </div>
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────

export function MusabaqahPage() {
  const { user, isLoading: authLoading } = useAuth()

  const {
    view,
    session,
    members,
    endsAt,
    scores,
    isHost,
    handleSessionCreated,
    handleSessionJoined,
    handleStartQuiz,
    handleTimerEnd,
    handleDismissResults,
  } = useMusabaqah()

  if (authLoading) {
    return (
      <div className="space-y-4 animate-pulse pt-4">
        <div className="h-6 rounded bg-muted w-1/3" />
        <div className="h-10 rounded bg-muted" />
        <div className="h-10 rounded bg-muted w-2/3" />
      </div>
    )
  }

  if (!user) return <NotLoggedIn />

  if (!supabase) {
    return (
      <div className="text-center py-8 space-y-2">
        <p className="font-semibold text-foreground">No connection</p>
        <p className="text-sm text-muted-foreground">Musabaqah requires an internet connection.</p>
      </div>
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

  return (
    <LandingView
      onSessionCreated={handleSessionCreated}
      onSessionJoined={handleSessionJoined}
    />
  )
}
