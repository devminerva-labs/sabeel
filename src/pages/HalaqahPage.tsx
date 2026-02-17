import { useState, FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { ArabicText } from '@/components/ArabicText'
import { useAuth } from '@/hooks/useAuth'
import { useHalaqah } from '@/hooks/useHalaqah'

// ── Leaderboard ──────────────────────────────────────────────

function Leaderboard() {
  const { user } = useAuth()
  const { halaqah, myNickname, leaderboard, isLoadingLeaderboard, leaveHalaqah } = useHalaqah(user?.id ?? null)
  const [copied, setCopied] = useState(false)
  const [leaving, setLeaving] = useState(false)

  if (!halaqah) return null

  async function handleCopy() {
    await navigator.clipboard.writeText(halaqah!.invite_code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  async function handleLeave() {
    if (!confirm('Leave this Halaqah? You can rejoin with the invite code.')) return
    setLeaving(true)
    await leaveHalaqah()
    setLeaving(false)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-1">
        <ArabicText as="p" className="text-base text-muted-foreground">حلقة</ArabicText>
        <h1 className="text-2xl font-bold">{halaqah.name}</h1>
        {myNickname && (
          <p className="text-sm text-muted-foreground">You are <span className="font-medium text-foreground">{myNickname}</span></p>
        )}
      </div>

      {/* Invite code */}
      <div className="rounded-xl border border-border p-4 space-y-2">
        <p className="text-xs text-muted-foreground uppercase tracking-wide">Invite code</p>
        <div className="flex items-center gap-3">
          <code className="text-lg font-mono font-semibold tracking-widest text-foreground">
            {halaqah.invite_code}
          </code>
          <button
            onClick={handleCopy}
            className="text-xs text-primary font-medium hover:opacity-75 transition-opacity"
          >
            {copied ? 'Copied' : 'Copy'}
          </button>
        </div>
        <p className="text-xs text-muted-foreground">Share this code so others can join your Halaqah.</p>
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
                    className={`border-b border-border last:border-0 ${
                      entry.isMe ? 'bg-primary/5' : ''
                    }`}
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

// ── Create / Join form ────────────────────────────────────────

function CreateOrJoin() {
  const { user } = useAuth()
  const { createHalaqah, joinHalaqah, createError, joinError } = useHalaqah(user?.id ?? null)

  const [mode, setMode] = useState<'create' | 'join'>('join')
  const [name, setName] = useState('')
  const [inviteCode, setInviteCode] = useState('')
  const [nickname, setNickname] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)
    try {
      if (mode === 'create') {
        const { error: err } = await createHalaqah({ name, nickname })
        if (err) setError(err)
      } else {
        const { error: err } = await joinHalaqah({ inviteCode, nickname })
        if (err) setError(err)
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const apiError = mode === 'create' ? createError : joinError

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <ArabicText as="p" className="text-base text-muted-foreground">حلقة</ArabicText>
        <h1 className="text-2xl font-bold">Your Halaqah</h1>
        <p className="text-sm text-muted-foreground">
          A private circle where your group tracks Quran progress together.
        </p>
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
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Brothers of Masjid Al-Noor"
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        )}

        {mode === 'join' && (
          <div className="space-y-1">
            <label className="text-sm font-medium">Invite code</label>
            <input
              type="text"
              required
              value={inviteCode}
              onChange={(e) => setInviteCode(e.target.value)}
              placeholder="8-character code"
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-ring"
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
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="How others will see you"
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <p className="text-xs text-muted-foreground">Your real name is never shown to other members.</p>
        </div>

        {(error || apiError) && (
          <p className="text-sm text-red-500">{error ?? apiError}</p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
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

export function HalaqahPage() {
  const { user, isLoading: authLoading } = useAuth()

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
  return <HalaqahContent userId={user.id} />
}

function HalaqahContent({ userId }: { userId: string }) {
  const { halaqah, isLoadingHalaqah } = useHalaqah(userId)

  if (isLoadingHalaqah) {
    return (
      <div className="space-y-4 animate-pulse pt-4">
        <div className="h-6 rounded bg-muted w-1/3" />
        <div className="h-10 rounded bg-muted" />
        <div className="h-10 rounded bg-muted w-2/3" />
      </div>
    )
  }

  if (!halaqah) return <CreateOrJoin />
  return <Leaderboard />
}
