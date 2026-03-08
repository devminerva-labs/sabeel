// src/components/musabaqah/MusabaqahResults.tsx
import type { PlayerScore, QuizWinner } from '@/types/musabaqah'

interface Props {
  scores: PlayerScore[]
  onDismiss: () => void
}

export function MusabaqahResults({ scores, onDismiss }: Props) {
  const ranked = [...scores].sort((a, b) => b.score - a.score)
  const topScore = ranked[0]?.score ?? 0
  const topPlayers = ranked.filter(s => s.score === topScore)
  const isDraw = topPlayers.length > 1
  const iWon = topPlayers.some(s => s.isMe)
  const winnerNickname = isDraw ? null : (topPlayers[0]?.nickname ?? null)

  const winner: QuizWinner = iWon ? (isDraw ? 'draw' : 'me') : 'other'

  const winnerLine =
    winner === 'me'    ? 'You won!' :
    winner === 'other' ? `${winnerNickname} wins!` :
    scores.length === 1 ? 'Quiz complete!' :
    "It's a tie — Mashallah!"

  const myScore = ranked.find(s => s.isMe)

  // 1 player: centered card; 2-4 players: 2-column grid (3 wraps naturally)
  const gridClass = scores.length === 1 ? 'flex justify-center' : 'grid grid-cols-2 gap-3'

  const rankEmoji = (i: number) => i === 0 ? '🥇' : i === 1 ? '🥈' : '🥉'

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
          : winner === 'other'
          ? 'bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800'
          : 'bg-primary/5 border border-primary/20'
      }`}>
        <p className={`text-xl font-bold ${
          winner === 'me'
            ? 'text-green-700 dark:text-green-400'
            : winner === 'other'
            ? 'text-amber-700 dark:text-amber-400'
            : 'text-primary'
        }`}>
          {winner === 'me' && '🏆 '}
          {winnerLine}
        </p>
      </div>

      {/* Score cards — ranked loop */}
      <div className={gridClass}>
        {ranked.map((s, i) => (
          <div
            key={s.userId}
            className={`rounded-xl border p-4 space-y-1 ${
              !isDraw && s.userId === topPlayers[0]?.userId
                ? winner === 'me'
                  ? 'border-green-300 dark:border-green-700'
                  : 'border-amber-300 dark:border-amber-700'
                : s.isMe
                ? 'border-primary'
                : 'border-border'
            }`}
          >
            <p className="text-xs text-muted-foreground uppercase tracking-wide">
              {rankEmoji(i)} {s.isMe ? 'You' : s.nickname}
            </p>
            <p className="text-3xl font-bold text-foreground">
              {s.score}
              <span className="text-base font-normal text-muted-foreground">/30</span>
            </p>
            {!s.isMe && (
              <p className="text-xs text-muted-foreground truncate">{s.nickname}</p>
            )}
          </div>
        ))}
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
