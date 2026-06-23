import { describe, expect, it } from 'vitest'
import { activityLevel, buildWeeks, utcDayKey } from './activity-grid'

describe('utcDayKey()', () => {
  it('formats a date as a UTC day', () => {
    expect(utcDayKey(new Date('2026-06-23T22:30:00Z'))).toBe('2026-06-23')
  })
})

describe('buildWeeks()', () => {
  const weeks = buildWeeks(new Date('2026-06-23T12:00:00Z'))

  it('returns 53 columns of 7 days', () => {
    expect(weeks).toHaveLength(53)
    expect(weeks.every(week => week.length === 7)).toBe(true)
  })

  it('starts each column on a Sunday', () => {
    expect(weeks.every(week => week[0]!.date.getUTCDay() === 0)).toBe(true)
  })

  it('ends on the given day', () => {
    const lastWeek = weeks.at(-1)!
    expect(lastWeek.find(day => day.key === '2026-06-23')).toBeDefined()
  })

  it('marks days after today as in the future', () => {
    expect(
      weeks
        .at(-1)!
        .filter(day => day.inFuture)
        .map(day => day.key),
    ).toEqual(['2026-06-24', '2026-06-25', '2026-06-26', '2026-06-27'])
  })
})

describe('activityLevel()', () => {
  it('buckets counts into five levels', () => {
    expect(activityLevel(0)).toBe(0)
    expect(activityLevel(2)).toBe(1)
    expect(activityLevel(5)).toBe(2)
    expect(activityLevel(9)).toBe(3)
    expect(activityLevel(50)).toBe(4)
  })
})
