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
  isStarting: boolean
  onStart: () => void
}

export function MusabaqahLobby({ session, members, isHost, isStarting, onStart }: Props) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    await navigator.clipboard.writeText(session.invite_code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Allow start with 2+ players even if not all slots are filled
  const canStart = isHost && members.length >= 2 && !isStarting

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-1">
        <p className="text-xs text-muted-foreground uppercase tracking-wide">مُسَابَقَة</p>
        <h1 className="text-2xl font-bold text-foreground">Waiting for players</h1>
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
        <p className="text-xs text-muted-foreground">Share this code with your players</p>
      </div>

      {/* Players — slot-based: filled slots + pulsing empty slots */}
      <div className="rounded-xl border border-border bg-background p-4 space-y-3">
        <p className="text-xs text-muted-foreground uppercase tracking-wide">
          Players ({members.length}/{session.max_players})
        </p>
        <ul className="space-y-2">
          {members.map((m) => (
            <li key={m.userId} className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500" />
              <span className="text-sm font-medium text-foreground">{m.nickname}</span>
              {m.userId === session.host_id && (
                <span className="text-xs text-muted-foreground">(host)</span>
              )}
            </li>
          ))}
          {Array.from({ length: session.max_players - members.length }).map((_, i) => (
            <li key={`empty-${i}`} className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-muted animate-pulse" />
              <span className="text-sm text-muted-foreground italic">Waiting for player...</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Start button (host only) */}
      {isHost && (
        <button
          onClick={onStart}
          disabled={!canStart}
          className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-base disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
        >
          {isStarting
            ? 'Starting…'
            : canStart
            ? 'Start Quiz'
            : `Waiting for players… (${members.length}/${session.max_players})`}
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
