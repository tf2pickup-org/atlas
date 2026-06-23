import { collections } from '../database/collections'

export interface DailyCount {
  /** UTC day, formatted as YYYY-MM-DD */
  day: string
  gamesLaunched: number
}

/**
 * Stores an instance's authoritative per-day game counts. Idempotent: each
 * `{ instanceUrl, day }` is overwritten, so the same payload can be re-sent
 * (e.g. a full-history backfill on every boot) without double counting.
 */
export async function recordInstanceActivity(instanceUrl: string, days: DailyCount[]) {
  if (days.length === 0) {
    return
  }
  await collections.dailyGames.bulkWrite(
    days.map(({ day, gamesLaunched }) => ({
      updateOne: {
        filter: { instanceUrl, day },
        update: { $set: { gamesLaunched } },
        upsert: true,
      },
    })),
  )
}
