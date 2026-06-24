const weeksShown = 53
const dayMs = 86_400_000

export interface ActivityDay {
  date: Date
  /** UTC day key, YYYY-MM-DD */
  key: string
  inFuture: boolean
}

/** UTC day, formatted as YYYY-MM-DD */
export function utcDayKey(date: Date): string {
  return date.toISOString().slice(0, 10)
}

/**
 * Builds a GitHub-style grid of the last 53 weeks ending on the week of `today`.
 * Each column is a week (Sunday-first), each row a weekday.
 */
export function buildWeeks(today: Date): ActivityDay[][] {
  const todayMs = Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate())
  const todayDow = new Date(todayMs).getUTCDay()
  const startMs = todayMs - (weeksShown - 1) * 7 * dayMs - todayDow * dayMs

  const weeks: ActivityDay[][] = []
  for (let col = 0; col < weeksShown; col++) {
    const week: ActivityDay[] = []
    for (let row = 0; row < 7; row++) {
      const ms = startMs + (col * 7 + row) * dayMs
      const date = new Date(ms)
      week.push({ date, key: utcDayKey(date), inFuture: ms > todayMs })
    }
    weeks.push(week)
  }
  return weeks
}

export type ActivityLevel = 0 | 1 | 2 | 3 | 4

export function activityLevel(count: number): ActivityLevel {
  if (count <= 0) return 0
  if (count <= 9) return 1
  if (count <= 19) return 2
  if (count <= 29) return 3
  return 4
}
