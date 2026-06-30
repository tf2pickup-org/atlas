import { database } from './database'
import type { InstanceModel } from './models/instance.model'
import type { DailyGamesModel } from './models/daily-games.model'
import type { ActivePlayerModel } from './models/active-player.model'

export const collections = {
  instances: database.collection<InstanceModel>('instances'),
  dailyGames: database.collection<DailyGamesModel>('dailyGames'),
  activePlayers: database.collection<ActivePlayerModel>('activePlayers'),
} as const
