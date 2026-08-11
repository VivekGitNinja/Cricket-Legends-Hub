import { describe, expect, it } from 'vitest'
import { computeGoatBreakdown, rankLegends, comparePlayers } from './goat'

const sample = {
  id: 'sample',
  name: 'Sample Player',
  rating: 95,
  goatScore: 90,
  awards: ['Award 1', 'Award 2'],
  stats: {
    test: { matches: 100, runs: 8000, average: 50, hundreds: 25 },
    odi: { matches: 250, runs: 10000, average: 45, hundreds: 25 },
    t20: { matches: 50, runs: 1000, average: 30, hundreds: 0 },
  },
}

describe('computeGoatBreakdown', () => {
  it('returns a score, model score, and breakdown parts', () => {
    const result = computeGoatBreakdown(sample)
    expect(result.score).toBeTypeOf('number')
    expect(result.modelScore).toBeTypeOf('number')
    expect(result.curated).toBe(90)
    expect(Object.keys(result.parts).length).toBeGreaterThan(0)
  })

  it('blends model score with curated goatScore', () => {
    const result = computeGoatBreakdown(sample)
    const expected = Number((result.modelScore * 0.35 + 90 * 0.65).toFixed(1))
    expect(result.score).toBe(expected)
  })

  it('falls back to model-only score when no curated score exists', () => {
    const noCurated = { ...sample, goatScore: undefined }
    const result = computeGoatBreakdown(noCurated)
    expect(result.score).toBe(result.modelScore)
  })

  it('handles a player with no stats gracefully', () => {
    const result = computeGoatBreakdown({ name: 'Empty', rating: 0 })
    expect(result.score).toBeGreaterThanOrEqual(0)
    expect(Number.isNaN(result.score)).toBe(false)
  })
})

describe('rankLegends', () => {
  it('sorts by computed score descending', () => {
    const weak = { ...sample, id: 'weak', rating: 75, goatScore: 60, stats: sample.stats }
    const strong = { ...sample, id: 'strong', rating: 99, goatScore: 99, stats: sample.stats }
    const ranked = rankLegends([weak, strong])
    expect(ranked[0].id).toBe('strong')
  })

  it('does not mutate the input list', () => {
    const input = [sample]
    rankLegends(input)
    expect(input).toHaveLength(1)
    expect(input[0]).not.toHaveProperty('_goat')
  })
})

describe('comparePlayers', () => {
  it('declares a winner and exposes metrics', () => {
    const a = { ...sample, id: 'a', goatScore: 80, rating: 85 }
    const b = { ...sample, id: 'b', goatScore: 95, rating: 99 }
    const result = comparePlayers(a, b)
    expect(result.winner).toBe('b')
    expect(result.metrics.length).toBeGreaterThan(0)
    expect(result.metrics.find((m) => m.key === 'goat')).toBeTruthy()
  })
})
