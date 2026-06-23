import { hoursToSeconds } from 'date-fns'
import { collections } from './collections'
import { logger } from '../logger'

const instanceTtlHours = 12

export async function ensureIndexes() {
  logger.info('ensuring indexes...')
  await collections.instances.createIndex({ url: 1 }, { unique: true })
  await collections.instances.createIndex(
    { lastSeenAt: 1 },
    { expireAfterSeconds: hoursToSeconds(instanceTtlHours) },
  )
  await collections.dailyGames.createIndex({ day: 1 }, { unique: true })
  logger.info('indexes ensured')
}
