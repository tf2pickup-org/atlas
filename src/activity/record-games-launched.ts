import { collections } from '../database/collections'
import { utcDayKey } from './activity-grid'

/** Adds `count` newly launched games to the daily tally for the UTC day of `when`. */
export async function recordGamesLaunched(count: number, when: Date) {
  if (count <= 0) {
    return
  }
  await collections.dailyGames.updateOne(
    { day: utcDayKey(when) },
    { $inc: { gamesLaunched: count } },
    { upsert: true },
  )
}
