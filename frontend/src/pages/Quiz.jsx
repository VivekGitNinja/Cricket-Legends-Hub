import { useEffect, useState } from 'react'
import { Trophy } from 'lucide-react'
import { QUIZ_QUESTIONS } from '../data/legends'
import { api } from '../lib/api'
import { useAuth } from '../context/AuthContext'
import { storage, STORAGE_KEYS } from '../utils/storage'
import Section from '../components/ui/Section'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'
import Skeleton from '../components/ui/Skeleton'
import { cn } from '../utils/cn'

export default function Quiz() {
  const { user, token } = useAuth()
  const [questions, setQuestions] = useState(QUIZ_QUESTIONS)
  const [loading, setLoading] = useState(true)
  const [index, setIndex] = useState(0)
  const [selected, setSelected] = useState(null)
  const [score, setScore] = useState(0)
  const [done, setDone] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [leaderboard, setLeaderboard] = useState([])
  const best = storage.get(STORAGE_KEYS.quizBest, 0)

  useEffect(() => {
    let mounted = true
    Promise.allSettled([api.getQuizQuestions(), api.getLeaderboard()]).then(([q, l]) => {
      if (!mounted) return
      if (q.status === 'fulfilled' && q.value.length) setQuestions(q.value)
      if (l.status === 'fulfilled' && l.value.length) setLeaderboard(l.value)
      setLoading(false)
    })
    return () => {
      mounted = false
    }
  }, [])

  const q = questions[index]

  const choose = (optionIndex) => {
    if (selected !== null) return
    setSelected(optionIndex)
    if (optionIndex === q.answer) setScore((s) => s + 1)
  }

  const finish = async () => {
    if (score > best) storage.set(STORAGE_KEYS.quizBest, score)
    setDone(true)
    if (token && !submitted) {
      setSubmitted(true)
      try {
        await api.submitQuiz(token, { score, total: questions.length })
        const lb = await api.getLeaderboard()
        setLeaderboard(lb)
      } catch {
        /* leaderboard stays local */
      }
    }
  }

  const next = () => {
    if (index >= questions.length - 1) {
      finish()
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

  if (loading) {
    return (
      <Section eyebrow="Quiz" title="Legend Quiz">
        <Skeleton className="h-64" />
      </Section>
    )
  }

  if (done) {
    const finalBest = Math.max(best, score)
    return (
      <Section eyebrow="Quiz" title="Results">
        <div className="grid gap-4 lg:grid-cols-2">
          <Card hover={false} className="p-8 text-center">
            <p className="text-sm text-[var(--text-muted)]">Your score</p>
            <p className="mt-2 font-display text-5xl font-bold text-[#7EC8F2]">
              {score}/{questions.length}
            </p>
            <p className="mt-3 text-sm text-[var(--text-secondary)]">Best score: {finalBest}</p>
            <p className="mt-1 text-xs text-[var(--text-muted)]">
              {token && submitted ? 'Score saved to the global leaderboard' : user ? 'Sign in to save your score to the leaderboard' : 'Scores are kept locally — sign in to compete globally'}
            </p>
            <Button className="mt-6" onClick={restart}>
              Play again
            </Button>
          </Card>
          <Card hover={false} className="p-8">
            <h3 className="flex items-center gap-2 font-display text-lg font-semibold text-[var(--text-primary)]">
              <Trophy className="h-4 w-4 text-[#539AC1]" /> Global leaderboard
            </h3>
            {leaderboard.length === 0 ? (
              <p className="mt-4 text-sm text-[var(--text-muted)]">No scores recorded yet — be the first!</p>
            ) : (
              <ul className="mt-4 space-y-2">
                {leaderboard.map((a, i) => (
                  <li
                    key={a._id}
                    className={cn(
                      'flex items-center gap-3 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-glass)] px-4 py-2.5',
                      i === 0 && 'border-[#539AC1]/40'
                    )}
                  >
                    <span className={cn('w-6 font-display text-sm font-bold', i === 0 ? 'text-[#539AC1]' : 'text-[var(--text-muted)]')}>
                      #{i + 1}
                    </span>
                    <span className="flex-1 truncate text-sm font-medium text-[var(--text-primary)]">
                      {a.user?.name || a.name || 'Anonymous'}
                    </span>
                    <Badge tone={i === 0 ? 'gold' : 'muted'}>
                      {a.score}/{a.total}
                    </Badge>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>
      </Section>
    )
  }

  return (
    <Section
      eyebrow="Test Your Knowledge"
      title="Legend Quiz"
      description={`${questions.length} questions. One score. How well do you know cricket history?`}
    >
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <Badge tone="brand">
          Question {index + 1}/{questions.length}
        </Badge>
        <Badge tone="muted">Score {score}</Badge>
        <Badge tone="gold">Best {best}</Badge>
        <Badge tone="sky">{q?.difficulty}</Badge>
        {q?.category && <Badge tone="muted">{q.category}</Badge>}
      </div>

      <Card hover={false} className="p-6 md:p-8">
        <h2 className="font-display text-xl font-semibold text-[var(--text-primary)] md:text-2xl">
          {q?.question}
        </h2>
        <div className="mt-6 grid gap-3">
          {q?.options.map((opt, i) => {
            const isCorrect = selected !== null && i === q.answer
            const isWrong = selected === i && i !== q.answer
            return (
              <button
                key={`${i}-${opt}`}
                type="button"
                onClick={() => choose(i)}
                className={cn(
                  'rounded-xl border px-4 py-3 text-left text-sm transition',
                  isCorrect && 'border-emerald-500/50 bg-emerald-500/15 text-emerald-300',
                  isWrong && 'border-rose-500/50 bg-rose-500/15 text-rose-300',
                  selected === null &&
                    'border-[var(--border-subtle)] bg-[var(--bg-glass)] text-[var(--text-secondary)] hover:border-[#235D94]/40 hover:text-[var(--text-primary)]',
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
