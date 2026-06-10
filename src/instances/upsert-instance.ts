import type { z } from 'zod'
import { collections } from '../database/collections'
import type { heartbeatSchema } from './heartbeat.schema'

export async function upsertInstance(heartbeat: z.infer<typeof heartbeatSchema>) {
  const url = new URL(heartbeat.url).origin
  const now = new Date()
  await collections.instances.updateOne(
    { url },
    {
      $set: { ...heartbeat, url, lastSeenAt: now },
      $setOnInsert: { firstSeenAt: now },
    },
    { upsert: true },
  )
}
