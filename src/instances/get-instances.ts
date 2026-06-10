import { collections } from '../database/collections'

export async function getInstances() {
  return await collections.instances.find({}, { sort: { name: 1 } }).toArray()
}
