import { collections } from '../database/collections'

export interface ActivePlayer {
  /** stable, instance-independent player id (e.g. a hash of their SteamID) */
  id: string
  /** when this instance last saw the player active */
  lastActiveAt: Date
}

/**
 * Merges an instance's set of recently active players into the global set.
 * Players are keyed by `id`, so the same player reported by several instances
 * collapses into one document — the union, not the sum. `$max` keeps the most
 * recent `lastActiveAt` seen across all instances, so re-sending a full set on
 * every boot can never move a player's activity backwards.
 */
export async function recordActivePlayers(players: ActivePlayer[]) {
  if (players.length === 0) {
    return
  }
  await collections.activePlayers.bulkWrite(
    players.map(({ id, lastActiveAt }) => ({
      updateOne: {
        filter: { id },
        update: { $max: { lastActiveAt } },
        upsert: true,
      },
    })),
  )
}
