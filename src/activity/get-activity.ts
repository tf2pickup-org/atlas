import { collections } from '../database/collections'

/**
 * Returns a map of UTC day key -> games launched summed across all instances,
 * for days on or after `fromDay`.
 */
export async function getActivity(fromDay: string): Promise<Map<string, number>> {
  const days = await collections.dailyGames
    .aggregate<{
      _id: string
      gamesLaunched: number
    }>([
      { $match: { day: { $gte: fromDay } } },
      { $group: { _id: '$day', gamesLaunched: { $sum: '$gamesLaunched' } } },
    ])
    .toArray()
  return new Map(days.map(day => [day._id, day.gamesLaunched]))
}
