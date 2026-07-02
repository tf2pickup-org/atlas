import { hoursToSeconds } from 'date-fns'
import { collections } from './collections'
import { logger } from '../logger'

const instanceTtlHours = 12
// a few days past the 30-day active window, so stale players are pruned without
// ever dropping anyone still counted as active
const activePlayerTtlHours = 35 * 24

export async function ensureIndexes() {
  logger.info('ensuring indexes...')
  await collections.instances.createIndex({ url: 1 }, { unique: true })
  await collections.instances.createIndex(
    { lastSeenAt: 1 },
    { expireAfterSeconds: hoursToSeconds(instanceTtlHours) },
  )
  await collections.dailyGames.createIndex({ instanceUrl: 1, day: 1 }, { unique: true })
  await collections.dailyGames.createIndex({ day: 1 })
  await collections.activePlayers.createIndex({ id: 1 }, { unique: true })
  await collections.activePlayers.createIndex(
    { lastActiveAt: 1 },
    { expireAfterSeconds: hoursToSeconds(activePlayerTtlHours) },
  )
  logger.info('indexes ensured')
}
