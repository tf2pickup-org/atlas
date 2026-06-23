import { collections } from '../database/collections'

/** Returns a map of UTC day key -> games launched, for days on or after `fromDay`. */
export async function getActivity(fromDay: string): Promise<Map<string, number>> {
  const days = await collections.dailyGames.find({ day: { $gte: fromDay } }).toArray()
  return new Map(days.map(day => [day.day, day.gamesLaunched]))
}
