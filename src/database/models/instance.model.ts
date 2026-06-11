export interface InstanceModel {
  /** normalized origin, e.g. https://tf2pickup.pl */
  url: string
  name: string
  version?: string
  queue: {
    config: string
    occupied: number
    capacity: number
  }
  onlinePlayers: number
  liveGames?: number
  lastSeenAt: Date
  firstSeenAt: Date
}
