import { describe, expect, it } from 'vitest'
import {
  LEGENDS,
  MATCHES,
  RECORDS,
  WORLD_CUPS,
  ICC_RANKINGS,
  QUIZ_QUESTIONS,
  CRICKET_TIMELINE,
  getLegendById,
  getLegendByName,
  searchLegends,
} from './legends'

describe('LEGENDS dataset', () => {
  it('has at least 20 curated legends', () => {
    expect(LEGENDS.length).toBeGreaterThanOrEqual(20)
  })

  it('has unique ids and unique hall of fame ranks', () => {
    const ids = LEGENDS.map((l) => l.id)
    const ranks = LEGENDS.map((l) => l.hallOfFameRank)
    expect(new Set(ids).size).toBe(ids.length)
    expect(new Set(ranks).size).toBe(ranks.length)
  })

  it('every legend has required fields', () => {
    for (const l of LEGENDS) {
      expect(l.name, l.id).toBeTruthy()
      expect(l.country, l.id).toBeTruthy()
      expect(l.role, l.id).toBeTruthy()
      expect(l.image, l.id).toBeTruthy()
      expect(l.goatScore, l.id).toBeGreaterThan(0)
      expect(l.stats?.test, l.id).toBeTruthy()
      expect(l.stats?.odi, l.id).toBeTruthy()
    }
  })

  it('includes women’s cricket icons', () => {
    const women = ['Mithali Raj', 'Ellyse Perry', 'Smriti Mandhana', 'Meg Lanning']
    for (const name of women) {
      expect(LEGENDS.some((l) => l.name === name), name).toBe(true)
    }
  })

  it('goatScores are unique across legends', () => {
    const scores = LEGENDS.map((l) => l.goatScore)
    expect(new Set(scores).size).toBe(scores.length)
  })
})

describe('MATCHES dataset', () => {
  it('has results, venues and formats', () => {
    expect(MATCHES.length).toBeGreaterThan(0)
    for (const m of MATCHES) {
      expect(m.teamA, m.id).toBeTruthy()
      expect(m.teamB, m.id).toBeTruthy()
      expect(m.format, m.id).toBeTruthy()
      expect(m.venue, m.id).toBeTruthy()
    }
  })
})

describe('QUIZ_QUESTIONS', () => {
  it('has unique ids and valid answer indices', () => {
    const ids = QUIZ_QUESTIONS.map((q) => q.id)
    expect(new Set(ids).size).toBe(ids.length)
    for (const q of QUIZ_QUESTIONS) {
      expect(q.answer, q.question).toBeGreaterThanOrEqual(0)
      expect(q.answer, q.question).toBeLessThan(q.options.length)
      expect(['easy', 'medium', 'hard']).toContain(q.difficulty)
    }
  })
})

describe('WORLD_CUPS & ICC_RANKINGS', () => {
  it('world cups cover ODI and T20 editions', () => {
    expect(WORLD_CUPS.odi.length).toBeGreaterThan(0)
    expect(WORLD_CUPS.t20.length).toBeGreaterThan(0)
  })

  it('icc rankings have batting, bowling and all-rounders', () => {
    expect(ICC_RANKINGS.batting).toBeTruthy()
    expect(ICC_RANKINGS.bowling).toBeTruthy()
    expect(ICC_RANKINGS.allRounder).toBeTruthy()
  })
})

describe('RECORDS & timeline', () => {
  it('records have categories with labeled entries', () => {
    const categories = Object.values(RECORDS)
    expect(categories.length).toBeGreaterThan(0)
    for (const cat of categories) {
      expect(Array.isArray(cat)).toBe(true)
      expect(cat.length).toBeGreaterThan(0)
      expect(cat[0].label).toBeTruthy()
      expect(cat[0].value).toBeTruthy()
    }
  })
  it('timeline is ordered by year', () => {
    const years = CRICKET_TIMELINE.map((t) => t.year)
    const sorted = [...years].sort((a, b) => a - b)
    expect(years).toEqual(sorted)
  })
})

describe('lookup helpers', () => {
  it('finds legends by id and name', () => {
    expect(getLegendById('sachin-tendulkar')?.name).toBe('Sachin Tendulkar')
    expect(getLegendByName('Sachin Tendulkar')?.id).toBe('sachin-tendulkar')
  })
  it('searches case-insensitively', () => {
    expect(searchLegends('dhoni').length).toBeGreaterThan(0)
    expect(searchLegends('zzz-nonexistent')).toHaveLength(0)
  })
})
