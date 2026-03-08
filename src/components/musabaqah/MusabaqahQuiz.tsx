// src/components/musabaqah/MusabaqahQuiz.tsx
import { useEffect, useRef, useState } from 'react'
import { QUESTIONS_BY_CATEGORY } from '@/content/quiz'
import { submitAnswer } from '@/lib/api/musabaqah.api'
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
  const [currentIdx, setCurrentIdx] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<'A' | 'B' | 'C' | 'D' | null>(null)
  const [showFeedback, setShowFeedback] = useState(false)
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(() => Math.max(0, Math.round((endsAt - Date.now()) / 1000)))
  const timerEndedRef = useRef(false)

  // Build question list from session.question_ids (same order for both clients)
  const allQuestions = QUESTIONS_BY_CATEGORY[session.category]
  const questions = session.question_ids
    .map(id => allQuestions.find(q => q.id === id))
    .filter(Boolean) as typeof allQuestions

  const currentQuestion = questions[currentIdx]
  const totalQuestions = questions.length

  // Countdown timer
  useEffect(() => {
    const interval = setInterval(() => {
      const remaining = Math.max(0, Math.round((endsAt - Date.now()) / 1000))
      setTimeLeft(remaining)
      if (remaining <= 0 && !timerEndedRef.current) {
        timerEndedRef.current = true
        clearInterval(interval)
        onTimerEnd()
      }
    }, 500)
    return () => clearInterval(interval)
  }, [endsAt, onTimerEnd])

  async function handleAnswer(answer: 'A' | 'B' | 'C' | 'D') {
    if (selectedAnswer || !currentQuestion) return

    const isCorrect = answer === currentQuestion.correct
    setSelectedAnswer(answer)
    setShowFeedback(true)
    if (isCorrect) setScore(s => s + 1)

    // Persist to DB (fire-and-forget, no await to keep UI snappy)
    submitAnswer(session.id, currentIdx, answer, isCorrect)

    // Auto-advance after 1.5s
    setTimeout(() => {
      setShowFeedback(false)
      setSelectedAnswer(null)
      if (currentIdx + 1 >= totalQuestions) {
        // Finished all questions before time runs out
        if (!timerEndedRef.current) {
          timerEndedRef.current = true
          onTimerEnd()
        }
      } else {
        setCurrentIdx(i => i + 1)
      }
    }, 1500)
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

      {/* Progress bar */}
      <div className="h-1.5 rounded-full bg-muted overflow-hidden">
        <div
          className="h-full bg-primary rounded-full transition-all duration-300"
          style={{ width: `${((currentIdx) / totalQuestions) * 100}%` }}
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
