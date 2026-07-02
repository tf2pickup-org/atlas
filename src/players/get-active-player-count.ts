import { subDays } from 'date-fns'
import { collections } from '../database/collections'

const activeWindowDays = 30

/**
 * Number of distinct players active across all instances in the last 30 days.
 * Because players are stored deduplicated by id, this is the cross-instance
 * union: a player active on two instances is counted once.
 */
export async function getActivePlayerCount(now = new Date()): Promise<number> {
  return collections.activePlayers.countDocuments({
    lastActiveAt: { $gte: subDays(now, activeWindowDays) },
  })
}
