// src/components/musabaqah/MusabaqahResults.tsx
import type { PlayerScore, QuizWinner } from '@/types/musabaqah'

interface Props {
  scores: PlayerScore[]
  onDismiss: () => void
}

export function MusabaqahResults({ scores, onDismiss }: Props) {
  const myScore = scores.find(s => s.isMe)
  const opponentScore = scores.find(s => !s.isMe)

  const winner: QuizWinner =
    !myScore || !opponentScore
      ? 'draw'
      : myScore.score > opponentScore.score
      ? 'me'
      : myScore.score < opponentScore.score
      ? 'opponent'
      : 'draw'

  const winnerLine =
    winner === 'me'
      ? 'You won!'
      : winner === 'opponent'
      ? `${opponentScore?.nickname ?? 'Opponent'} wins!`
      : "It's a draw — Mashallah!"

  return (
    <div className="space-y-6 text-center py-4">
      {/* Title */}
      <div className="space-y-1">
        <p className="text-xs text-muted-foreground uppercase tracking-wide">مُسَابَقَة</p>
        <h1 className="text-2xl font-bold text-foreground">Quiz Complete</h1>
      </div>

      {/* Winner banner */}
      <div className={`rounded-xl px-6 py-4 ${
        winner === 'me'
          ? 'bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800'
          : winner === 'opponent'
          ? 'bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800'
          : 'bg-primary/5 border border-primary/20'
      }`}>
        <p className={`text-xl font-bold ${
          winner === 'me'
            ? 'text-green-700 dark:text-green-400'
            : winner === 'opponent'
            ? 'text-amber-700 dark:text-amber-400'
            : 'text-primary'
        }`}>
          {winner === 'me' && '🏆 '}
          {winnerLine}
        </p>
      </div>

      {/* Score cards */}
      <div className="grid grid-cols-2 gap-3">
        <div className={`rounded-xl border p-4 space-y-1 ${
          winner === 'me' ? 'border-green-300 dark:border-green-700' : 'border-border'
        }`}>
          <p className="text-xs text-muted-foreground uppercase tracking-wide">You</p>
          <p className="text-3xl font-bold text-foreground">
            {myScore?.score ?? 0}
            <span className="text-base font-normal text-muted-foreground">/30</span>
          </p>
          <p className="text-xs text-muted-foreground truncate">{myScore?.nickname ?? 'You'}</p>
        </div>

        <div className={`rounded-xl border p-4 space-y-1 ${
          winner === 'opponent' ? 'border-amber-300 dark:border-amber-700' : 'border-border'
        }`}>
          <p className="text-xs text-muted-foreground uppercase tracking-wide">Opponent</p>
          <p className="text-3xl font-bold text-foreground">
            {opponentScore?.score ?? 0}
            <span className="text-base font-normal text-muted-foreground">/30</span>
          </p>
          <p className="text-xs text-muted-foreground truncate">{opponentScore?.nickname ?? 'Opponent'}</p>
        </div>
      </div>

      {/* Accuracy */}
      {myScore && (
        <p className="text-sm text-muted-foreground">
          Your accuracy: <span className="font-semibold text-foreground">{Math.round((myScore.score / 30) * 100)}%</span>
        </p>
      )}

      {/* Dismiss */}
      <button
        onClick={onDismiss}
        className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-base hover:opacity-90 transition-opacity"
      >
        Back to Home
      </button>
    </div>
  )
}
