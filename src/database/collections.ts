import { database } from './database'
import type { InstanceModel } from './models/instance.model'

export const collections = {
  instances: database.collection<InstanceModel>('instances'),
} as const
