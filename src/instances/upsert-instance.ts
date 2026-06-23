import type { z } from 'zod'
import { collections } from '../database/collections'
import { recordGamesLaunched } from '../activity/record-games-launched'
import type { heartbeatSchema } from './heartbeat.schema'

export async function upsertInstance(heartbeat: z.infer<typeof heartbeatSchema>) {
  const url = new URL(heartbeat.url).origin
  const now = new Date()

  const previous = await collections.instances.findOne({ url }, { projection: { liveGames: 1 } })

  await collections.instances.updateOne(
    { url },
    {
      $set: { ...heartbeat, url, lastSeenAt: now },
      ...(heartbeat.liveGames === undefined ? { $unset: { liveGames: '' } } : {}),
      $setOnInsert: { firstSeenAt: now },
    },
    { upsert: true },
  )

  if (previous) {
    const launched = (heartbeat.liveGames ?? 0) - (previous.liveGames ?? 0)
    await recordGamesLaunched(launched, now)
  }
}
