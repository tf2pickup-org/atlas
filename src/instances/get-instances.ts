import { collections } from '../database/collections'

export async function getInstances() {
  return await collections.instances
    .find({}, { sort: { 'queue.occupied': -1, onlinePlayers: -1, name: 1 } })
    .toArray()
}
