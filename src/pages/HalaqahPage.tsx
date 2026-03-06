import { useState, useEffect, useRef, FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { ArabicText } from '@/components/ArabicText'
import { useAuth } from '@/hooks/useAuth'
import { useHalaqah } from '@/hooks/useHalaqah'
import type { HalaqahMembership } from '@/lib/api/halaqah.api'

// ── Leaderboard detail view ───────────────────────────────────

function LeaderboardView({
  membership,
  userId,
  onBack,
}: {
  membership: HalaqahMembership
  userId: string
  onBack: () => void
}) {
  const { leaderboard, isLoadingLeaderboard, leaveHalaqah } = useHalaqah(userId, membership.halaqah.id)
  const [copied, setCopied] = useState(false)
  const [leaving, setLeaving] = useState(false)

  async function handleCopy() {
    await navigator.clipboard.writeText(membership.halaqah.invite_code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  async function handleLeave() {
    if (!confirm('Leave this Halaqah? You can rejoin with the invite code.')) return
    setLeaving(true)
    await leaveHalaqah(membership.halaqah.id)
    setLeaving(false)
    onBack()
  }

  return (
    <div className="space-y-6">
      {/* Back + header */}
      <div className="flex items-center gap-3">
        <button onClick={onBack} className="text-sm text-primary font-medium hover:underline">
          ← All Halaqahs
        </button>
      </div>

      <div className="space-y-1">
        <ArabicText as="p" className="text-base text-muted-foreground">حلقة</ArabicText>
        <h1 className="text-2xl font-bold">{membership.halaqah.name}</h1>
        <p className="text-sm text-muted-foreground">
          You are <span className="font-medium text-foreground">{membership.nickname}</span>
        </p>
      </div>

      {/* Invite code */}
      <div className="rounded-xl border border-border p-4 space-y-2">
        <p className="text-xs text-muted-foreground uppercase tracking-wide">Invite code</p>
        <div className="flex items-center gap-3">
          <code className="text-lg font-mono font-semibold tracking-widest text-foreground">
            {membership.halaqah.invite_code}
          </code>
          <button
            onClick={handleCopy}
            className="text-xs text-primary font-medium hover:opacity-75 transition-opacity"
          >
            {copied ? 'Copied' : 'Copy'}
          </button>
        </div>
        <p className="text-xs text-muted-foreground">Share this code so others can join.</p>
      </div>

      {/* Leaderboard */}
      <div className="space-y-3">
        <h2 className="text-base font-semibold">Quran Progress</h2>
        {isLoadingLeaderboard ? (
          <div className="space-y-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-12 rounded-lg bg-muted animate-pulse" />
            ))}
          </div>
        ) : leaderboard.length === 0 ? (
          <p className="text-sm text-muted-foreground">No progress recorded yet.</p>
        ) : (
          <div className="rounded-xl border border-border overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="text-left px-4 py-2 font-medium text-muted-foreground w-8">#</th>
                  <th className="text-left px-4 py-2 font-medium text-muted-foreground">Name</th>
                  <th className="text-right px-4 py-2 font-medium text-muted-foreground">Done</th>
                  <th className="text-right px-4 py-2 font-medium text-muted-foreground">In progress</th>
                </tr>
              </thead>
              <tbody>
                {leaderboard.map((entry, i) => (
                  <tr
                    key={entry.nickname}
                    className={`border-b border-border last:border-0 ${entry.isMe ? 'bg-primary/5' : ''}`}
                  >
                    <td className="px-4 py-3 text-muted-foreground">{i + 1}</td>
                    <td className="px-4 py-3 font-medium">
                      {entry.nickname}
                      {entry.isMe && <span className="ml-2 text-xs text-muted-foreground">(you)</span>}
                    </td>
                    <td className="px-4 py-3 text-right text-foreground">{entry.juzCompleted}/30</td>
                    <td className="px-4 py-3 text-right text-muted-foreground">{entry.juzInProgress}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Leave */}
      <div className="pt-2">
        <button
          onClick={handleLeave}
          disabled={leaving}
          className="text-sm text-muted-foreground hover:text-red-500 transition-colors disabled:opacity-50"
        >
          Leave Halaqah
        </button>
      </div>
    </div>
  )
}

// ── Halaqah list (home view) ──────────────────────────────────

function HalaqahList({
  userId,
  onSelect,
  onJoinOrCreate,
}: {
  userId: string
  onSelect: (m: HalaqahMembership) => void
  onJoinOrCreate: () => void
}) {
  const { memberships, isLoadingMemberships, membershipsError } = useHalaqah(userId)

  if (isLoadingMemberships) {
    return (
      <div className="space-y-4 animate-pulse pt-4">
        <div className="h-6 rounded bg-muted w-1/3" />
        <div className="h-16 rounded bg-muted" />
        <div className="h-16 rounded bg-muted" />
      </div>
    )
  }

  if (membershipsError) {
    return (
      <div className="space-y-4 py-8 text-center">
        <p className="text-sm text-red-500">{membershipsError}</p>
        <button
          onClick={() => window.location.reload()}
          className="text-sm text-primary font-medium hover:underline"
        >
          Retry
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <ArabicText as="p" className="text-base text-muted-foreground">حلقة</ArabicText>
        <h1 className="text-2xl font-bold">Your Halaqahs</h1>
        {memberships.length === 0 && (
          <p className="text-sm text-muted-foreground">
            A private circle where your group tracks Quran progress together.
          </p>
        )}
      </div>

      {/* Membership cards */}
      {memberships.length > 0 && (
        <div className="space-y-3">
          {memberships.map((m) => (
            <button
              key={m.halaqah.id}
              onClick={() => onSelect(m)}
              className="w-full rounded-xl border border-border bg-background p-4 text-left hover:bg-muted/30 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-foreground">{m.halaqah.name}</p>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    As <span className="text-foreground">{m.nickname}</span>
                    <span className="mx-2">·</span>
                    <code className="font-mono text-xs">{m.halaqah.invite_code}</code>
                  </p>
                </div>
                <svg className="h-5 w-5 text-muted-foreground flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Join / Create button */}
      <button
        onClick={onJoinOrCreate}
        className="w-full rounded-xl border border-dashed border-primary/30 bg-primary/5 p-4 text-center hover:bg-primary/10 transition-colors"
      >
        <p className="text-sm font-medium text-primary">
          {memberships.length === 0 ? 'Join or Create a Halaqah' : '+ Join or Create another Halaqah'}
        </p>
      </button>
    </div>
  )
}

// ── Create / Join form ────────────────────────────────────────

function CreateOrJoin({ userId, onBack }: { userId: string; onBack: () => void }) {
  const { createHalaqah, joinHalaqah, createError, joinError } = useHalaqah(userId)

  const [mode, setMode] = useState<'create' | 'join'>('join')
  const [name, setName] = useState('')
  const [inviteCode, setInviteCode] = useState('')
  const [nickname, setNickname] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const isMountedRef = useRef(true)
  useEffect(() => () => { isMountedRef.current = false }, [])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)
    try {
      if (mode === 'create') {
        const { error: err } = await createHalaqah({ name, nickname })
        if (err) { setError(err); return }
      } else {
        const { error: err } = await joinHalaqah({ inviteCode, nickname })
        if (err) { setError(err); return }
      }
      if (!isMountedRef.current) return
      setSuccess(true)
      setTimeout(() => { if (isMountedRef.current) onBack() }, 800)
    } catch (e) {
      if (isMountedRef.current) {
        setError(e instanceof Error ? e.message : 'Something went wrong. Please try again.')
      }
    } finally {
      if (isMountedRef.current) setIsSubmitting(false)
    }
  }

  const apiError = mode === 'create' ? createError : joinError

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <button onClick={onBack} className="text-sm text-primary font-medium hover:underline">
          ← Back
        </button>
      </div>

      <div className="space-y-1">
        <ArabicText as="p" className="text-base text-muted-foreground">حلقة</ArabicText>
        <h1 className="text-2xl font-bold">{mode === 'create' ? 'Create Halaqah' : 'Join Halaqah'}</h1>
      </div>

      {/* Mode toggle */}
      <div className="flex rounded-lg border border-border overflow-hidden text-sm font-medium">
        {(['join', 'create'] as const).map((m) => (
          <button
            key={m}
            onClick={() => { setMode(m); setError(null) }}
            className={`flex-1 py-2 transition-colors ${
              mode === m ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {m === 'join' ? 'Join with code' : 'Create new'}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {mode === 'create' && (
          <div className="space-y-1">
            <label className="text-sm font-medium">Halaqah name</label>
            <input
              type="text"
              required
              minLength={2}
              maxLength={60}
              disabled={isSubmitting || success}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Brothers of Masjid Al-Noor"
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
            />
          </div>
        )}

        {mode === 'join' && (
          <div className="space-y-1">
            <label className="text-sm font-medium">Invite code</label>
            <input
              type="text"
              required
              minLength={8}
              maxLength={8}
              disabled={isSubmitting || success}
              value={inviteCode}
              onChange={(e) => setInviteCode(e.target.value)}
              placeholder="8-character code"
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
            />
          </div>
        )}

        <div className="space-y-1">
          <label className="text-sm font-medium">Your nickname in this Halaqah</label>
          <input
            type="text"
            required
            minLength={1}
            maxLength={30}
            disabled={isSubmitting || success}
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="How others will see you"
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
          />
          <p className="text-xs text-muted-foreground">Your real name is never shown to other members.</p>
        </div>

        {(error || apiError) && (
          <p className="text-sm text-red-500">{error ?? apiError}</p>
        )}

        {success && (
          <p className="text-sm text-green-600 dark:text-green-400 font-medium">
            {mode === 'create' ? 'Halaqah created!' : 'Joined successfully!'}
          </p>
        )}

        <button
          type="submit"
          disabled={isSubmitting || success}
          className="w-full bg-primary text-primary-foreground rounded-lg py-2.5 text-sm font-medium hover:opacity-90 disabled:opacity-50 transition-opacity"
        >
          {isSubmitting ? 'Please wait…' : mode === 'create' ? 'Create Halaqah' : 'Join Halaqah'}
        </button>
      </form>
    </div>
  )
}

// ── Not logged in ─────────────────────────────────────────────

function NotLoggedIn() {
  return (
    <div className="space-y-6 text-center py-8">
      <div className="space-y-2">
        <ArabicText as="p" className="text-xl text-muted-foreground">حلقة</ArabicText>
        <h1 className="text-2xl font-bold">Halaqah</h1>
        <p className="text-sm text-muted-foreground max-w-xs mx-auto leading-relaxed">
          Sign in to join or create a private Halaqah — a circle where your group tracks Quran progress together.
        </p>
      </div>
      <Link
        to="/login?next=/app/halaqah"
        className="inline-block bg-primary text-primary-foreground px-6 py-2.5 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
      >
        Sign in to continue
      </Link>
      <p className="text-xs text-muted-foreground">
        The rest of Sabeel works without an account.
      </p>
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────

type HalaqahView =
  | { type: 'list' }
  | { type: 'detail'; membership: HalaqahMembership }
  | { type: 'join-create' }

export function HalaqahPage() {
  const { user, isLoading: authLoading } = useAuth()
  const [view, setView] = useState<HalaqahView>({ type: 'list' })

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

  if (view.type === 'detail') {
    return (
      <LeaderboardView
        membership={view.membership}
        userId={user.id}
        onBack={() => setView({ type: 'list' })}
      />
    )
  }

  if (view.type === 'join-create') {
    return (
      <CreateOrJoin
        userId={user.id}
        onBack={() => setView({ type: 'list' })}
      />
    )
  }

  return (
    <HalaqahList
      userId={user.id}
      onSelect={(m) => setView({ type: 'detail', membership: m })}
      onJoinOrCreate={() => setView({ type: 'join-create' })}
    />
  )
}
