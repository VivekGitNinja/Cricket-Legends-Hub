import { describe, expect, it } from 'vitest'
import { formatNumber, formatAverage, formatDate, slugify, initials, clamp, percentage } from './format'

describe('formatNumber', () => {
  it('formats numbers with en-IN grouping', () => {
    expect(formatNumber(15921)).toBe('15,921')
  })
  it('returns fallback for null/undefined/NaN', () => {
    expect(formatNumber(null)).toBe('—')
    expect(formatNumber(undefined)).toBe('—')
    expect(formatNumber('abc')).toBe('—')
  })
})

describe('formatAverage', () => {
  it('formats to two decimals by default', () => {
    expect(formatAverage(53.7842)).toBe('53.78')
  })
  it('returns fallback for invalid values', () => {
    expect(formatAverage(undefined)).toBe('—')
  })
})

describe('formatDate', () => {
  it('formats a date string', () => {
    expect(formatDate('2004-01-02')).not.toBe('—')
  })
  it('returns fallback for invalid dates', () => {
    expect(formatDate('not-a-date')).toBe('—')
    expect(formatDate()).toBe('—')
  })
})

describe('slugify', () => {
  it('slugifies names', () => {
    expect(slugify('MS Dhoni')).toBe('ms-dhoni')
    expect(slugify('  AB de Villiers!! ')).toBe('ab-de-villiers')
  })
})

describe('initials', () => {
  it('takes up to two initials', () => {
    expect(initials('Sachin Tendulkar')).toBe('ST')
    expect(initials('MS Dhoni')).toBe('MD')
    expect(initials('Kane')).toBe('K')
  })
})

describe('clamp & percentage', () => {
  it('clamps values to bounds', () => {
    expect(clamp(150, 0, 100)).toBe(100)
    expect(clamp(-5, 0, 100)).toBe(0)
    expect(clamp(50, 0, 100)).toBe(50)
  })
  it('computes percentages safely', () => {
    expect(percentage(5, 20)).toBe(25)
    expect(percentage(5, 0)).toBe(0)
  })
})
