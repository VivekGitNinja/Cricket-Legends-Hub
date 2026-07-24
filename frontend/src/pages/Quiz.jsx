import { useMemo, useState } from 'react'
import { QUIZ_QUESTIONS } from '../data/legends'
import { storage, STORAGE_KEYS } from '../utils/storage'
import Section from '../components/ui/Section'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'
import { cn } from '../utils/cn'

export default function Quiz() {
  const questions = useMemo(() => QUIZ_QUESTIONS, [])
  const [index, setIndex] = useState(0)
  const [selected, setSelected] = useState(null)
  const [score, setScore] = useState(0)
  const [done, setDone] = useState(false)
  const best = storage.get(STORAGE_KEYS.quizBest, 0)

  const q = questions[index]

  const choose = (optionIndex) => {
    if (selected !== null) return
    setSelected(optionIndex)
    if (optionIndex === q.answer) setScore((s) => s + 1)
  }

  const next = () => {
    if (index >= questions.length - 1) {
      const finalScore = selected === q.answer || selected !== null ? score : score
      const actual = selected === q.answer ? score : score
      // score already updated on choose
      const total = actual
      if (total > best) storage.set(STORAGE_KEYS.quizBest, total)
      setDone(true)
      return
    }
    setIndex((i) => i + 1)
    setSelected(null)
  }

  const restart = () => {
    setIndex(0)
    setSelected(null)
    setScore(0)
    setDone(false)
  }

  if (done) {
    const finalBest = Math.max(best, score)
    return (
      <Section eyebrow="Quiz" title="Results">
        <Card hover={false} className="mx-auto max-w-lg p-8 text-center">
          <p className="text-sm text-[var(--text-muted)]">Your score</p>
          <p className="mt-2 font-display text-5xl font-bold text-orange-400">
            {score}/{questions.length}
          </p>
          <p className="mt-3 text-sm text-[var(--text-secondary)]">Best score: {finalBest}</p>
          <Button className="mt-6" onClick={restart}>
            Play again
          </Button>
        </Card>
      </Section>
    )
  }

  return (
    <Section
      eyebrow="Test Your Knowledge"
      title="Legend Quiz"
      description="Ten questions. One score. How well do you know cricket history?"
    >
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <Badge tone="brand">
          Question {index + 1}/{questions.length}
        </Badge>
        <Badge tone="muted">Score {score}</Badge>
        <Badge tone="gold">Best {best}</Badge>
        <Badge tone="sky">{q.difficulty}</Badge>
      </div>

      <Card hover={false} className="p-6 md:p-8">
        <h2 className="font-display text-xl font-semibold text-[var(--text-primary)] md:text-2xl">
          {q.question}
        </h2>
        <div className="mt-6 grid gap-3">
          {q.options.map((opt, i) => {
            const isCorrect = selected !== null && i === q.answer
            const isWrong = selected === i && i !== q.answer
            return (
              <button
                key={opt}
                type="button"
                onClick={() => choose(i)}
                className={cn(
                  'rounded-xl border px-4 py-3 text-left text-sm transition',
                  isCorrect && 'border-emerald-500/50 bg-emerald-500/15 text-emerald-300',
                  isWrong && 'border-rose-500/50 bg-rose-500/15 text-rose-300',
                  selected === null &&
                    'border-[var(--border-subtle)] bg-[var(--bg-glass)] text-[var(--text-secondary)] hover:border-orange-500/40 hover:text-[var(--text-primary)]',
                  selected !== null && !isCorrect && !isWrong && 'border-[var(--border-subtle)] opacity-60'
                )}
              >
                {opt}
              </button>
            )
          })}
        </div>
        {selected !== null && (
          <div className="mt-6 flex justify-end">
            <Button onClick={next}>
              {index >= questions.length - 1 ? 'See results' : 'Next question'}
            </Button>
          </div>
        )}
      </Card>
    </Section>
  )
}
