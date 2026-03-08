// src/components/musabaqah/MusabaqahQuiz.tsx
import { useEffect, useMemo, useRef, useState } from 'react'
import { QUESTIONS_BY_CATEGORY } from '@/content/quiz'
import { submitAnswer } from '@/lib/api/musabaqah.api'
import { useAuth } from '@/hooks/useAuth'
import type { QuizSession } from '@/types/musabaqah'

interface Props {
  session: QuizSession
  endsAt: number
  onTimerEnd: () => void
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}

export function MusabaqahQuiz({ session, endsAt, onTimerEnd }: Props) {
  const { user } = useAuth()
  const [currentIdx, setCurrentIdx] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<'A' | 'B' | 'C' | 'D' | null>(null)
  const [showFeedback, setShowFeedback] = useState(false)
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(() => Math.max(0, Math.round((endsAt - Date.now()) / 1000)))
  const [playerDone, setPlayerDone] = useState(false)
  const timerEndedRef = useRef(false)
  // Synchronous guard — prevents double-submission when state hasn't updated yet (bug 014)
  const answerLockedRef = useRef(false)
  // Stable ref for onTimerEnd — prevents timer effect from resetting on prop reference change (bug 008)
  const onTimerEndRef = useRef(onTimerEnd)
  useEffect(() => { onTimerEndRef.current = onTimerEnd }, [onTimerEnd])

  // Build question list once from session.question_ids — memoized so 1s timer ticks don't rebuild it (bug 006)
  const questions = useMemo(() => {
    const allQuestions = QUESTIONS_BY_CATEGORY[session.category]
    return session.question_ids
      .map(id => allQuestions.find(q => q.id === id))
      .filter(Boolean) as typeof allQuestions
  }, [session.question_ids, session.category])

  const currentQuestion = questions[currentIdx]
  const totalQuestions = questions.length

  // Countdown timer — fires every 1s (was 500ms, doubled renders unnecessarily) (bug 007)
  // Only `endsAt` in deps — stable because onTimerEnd is accessed via ref (bug 008)
  useEffect(() => {
    const interval = setInterval(() => {
      const remaining = Math.max(0, Math.round((endsAt - Date.now()) / 1000))
      setTimeLeft(remaining)
      if (remaining <= 0 && !timerEndedRef.current) {
        timerEndedRef.current = true
        clearInterval(interval)
        onTimerEndRef.current()
      }
    }, 1000)
    return () => clearInterval(interval)
  }, [endsAt])

  async function handleAnswer(answer: 'A' | 'B' | 'C' | 'D') {
    // Synchronous ref guard prevents double-submission from rapid taps (bug 014)
    if (answerLockedRef.current || !currentQuestion || !user) return
    answerLockedRef.current = true

    const isCorrect = answer === currentQuestion.correct
    setSelectedAnswer(answer)
    setShowFeedback(true)
    if (isCorrect) setScore(s => s + 1)

    // Pass userId directly — no per-answer getUser() network call (bug 010)
    submitAnswer(session.id, user.id, currentIdx, answer, isCorrect)

    // Auto-advance after 1.5s
    setTimeout(() => {
      setShowFeedback(false)
      setSelectedAnswer(null)
      answerLockedRef.current = false
      if (currentIdx + 1 >= totalQuestions) {
        // Finished all questions — wait for timer to expire (don't end session for both players)
        setPlayerDone(true)
      } else {
        setCurrentIdx(i => i + 1)
      }
    }, 1500)
  }

  if (playerDone) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
        <p className="text-2xl">✅</p>
        <p className="font-semibold text-foreground">You've finished!</p>
        <p className="text-sm text-muted-foreground">
          Score: {score}/{totalQuestions} — waiting for the timer to end…
        </p>
        <span
          className={`text-sm font-mono font-semibold tabular-nums ${
            timeLeft <= 30 ? 'text-red-500' : 'text-muted-foreground'
          }`}
        >
          {formatTime(timeLeft)} remaining
        </span>
      </div>
    )
  }

  if (!currentQuestion) {
    return (
      <div className="flex items-center justify-center py-16">
        <p className="text-muted-foreground text-sm">Loading questions...</p>
      </div>
    )
  }

  const optionKeys = ['A', 'B', 'C', 'D'] as const

  return (
    <div className="space-y-5">
      {/* Top bar */}
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-muted-foreground">
          Q{currentIdx + 1} of {totalQuestions}
        </span>
        <span
          className={`text-sm font-mono font-semibold tabular-nums ${
            timeLeft <= 30 ? 'text-red-500' : 'text-foreground'
          }`}
        >
          {formatTime(timeLeft)}
        </span>
      </div>

      {/* Progress bar — starts at 1/30 on Q1, reaches 100% on Q30 (bug 012) */}
      <div className="h-1.5 rounded-full bg-muted overflow-hidden">
        <div
          className="h-full bg-primary rounded-full transition-all duration-300"
          style={{ width: `${((currentIdx + 1) / totalQuestions) * 100}%` }}
        />
      </div>

      {/* Question */}
      <div className="rounded-xl border border-border bg-background p-5">
        <p className="text-base font-medium text-foreground leading-relaxed">
          {currentQuestion.question}
        </p>
      </div>

      {/* Options */}
      <div className="space-y-2.5">
        {optionKeys.map(key => {
          let variant = 'default'
          if (showFeedback && selectedAnswer) {
            if (key === currentQuestion.correct) variant = 'correct'
            else if (key === selectedAnswer && selectedAnswer !== currentQuestion.correct) variant = 'wrong'
          }

          return (
            <button
              key={key}
              onClick={() => handleAnswer(key)}
              disabled={!!selectedAnswer}
              className={`w-full text-left rounded-xl border px-4 py-3 text-sm font-medium transition-colors ${
                variant === 'correct'
                  ? 'border-green-500 bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-400'
                  : variant === 'wrong'
                  ? 'border-red-500 bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400'
                  : 'border-border bg-background text-foreground hover:bg-muted/40 disabled:cursor-default'
              }`}
            >
              <span className="font-semibold mr-2">{key}.</span>
              {currentQuestion.options[key]}
            </button>
          )
        })}
      </div>

      {/* Feedback / explanation */}
      {showFeedback && currentQuestion.explanation && (
        <div className="rounded-xl bg-muted/50 border border-border px-4 py-3">
          <p className="text-xs text-muted-foreground">{currentQuestion.explanation}</p>
        </div>
      )}

      {/* Running score */}
      <div className="text-center">
        <span className="text-xs text-muted-foreground">
          Score: <span className="font-semibold text-foreground">{score}/{currentIdx + (selectedAnswer ? 1 : 0)}</span>
        </span>
      </div>
    </div>
  )
}
