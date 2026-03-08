// src/components/musabaqah/MusabaqahLobby.tsx
import { useState } from 'react'
import type { QuizSession, QuizMember } from '@/types/musabaqah'

const CATEGORY_LABELS: Record<string, string> = {
  general: 'General Knowledge',
  prophets: 'Prophet Stories',
  quran: 'Quran',
  history: 'Islamic History',
  sunnah: 'Sunnah',
  names: 'Names of Allah',
}

interface Props {
  session: QuizSession
  members: QuizMember[]
  isHost: boolean
  onStart: () => void
}

export function MusabaqahLobby({ session, members, isHost, onStart }: Props) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    await navigator.clipboard.writeText(session.invite_code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const canStart = isHost && members.length === 2

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-1">
        <p className="text-xs text-muted-foreground uppercase tracking-wide">مُسَابَقَة</p>
        <h1 className="text-2xl font-bold text-foreground">Waiting for opponent</h1>
        <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
          {CATEGORY_LABELS[session.category] ?? session.category}
        </span>
      </div>

      {/* Invite code */}
      <div className="rounded-xl border border-border bg-background p-5 space-y-3 text-center">
        <p className="text-xs text-muted-foreground uppercase tracking-wide">Invite Code</p>
        <code className="block text-4xl font-mono font-bold tracking-widest text-foreground">
          {session.invite_code}
        </code>
        <button
          onClick={handleCopy}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10 text-primary text-sm font-medium hover:bg-primary/20 transition-colors"
        >
          {copied ? 'Copied!' : 'Copy Code'}
        </button>
        <p className="text-xs text-muted-foreground">Share this code with your opponent</p>
      </div>

      {/* Players */}
      <div className="rounded-xl border border-border bg-background p-4 space-y-3">
        <p className="text-xs text-muted-foreground uppercase tracking-wide">Players ({members.length}/2)</p>
        {members.length === 0 ? (
          <p className="text-sm text-muted-foreground">Waiting for players to join...</p>
        ) : (
          <ul className="space-y-2">
            {members.map((m) => (
              <li key={m.userId} className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500" />
                <span className="text-sm font-medium text-foreground">{m.nickname}</span>
              </li>
            ))}
            {members.length === 1 && (
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-muted animate-pulse" />
                <span className="text-sm text-muted-foreground italic">Waiting for opponent...</span>
              </li>
            )}
          </ul>
        )}
      </div>

      {/* Start button (host only) */}
      {isHost && (
        <button
          onClick={onStart}
          disabled={!canStart}
          className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-base disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
        >
          {canStart ? 'Start Quiz' : 'Waiting for opponent to join...'}
        </button>
      )}

      {!isHost && (
        <div className="rounded-xl border border-border bg-muted/30 p-4 text-center">
          <p className="text-sm text-muted-foreground">Waiting for the host to start the quiz...</p>
        </div>
      )}

      <p className="text-xs text-center text-muted-foreground">
        30 questions · 3 minute time limit · independent pace
      </p>
    </div>
  )
}
