export interface ActivePlayerModel {
  /**
   * Stable, instance-independent identifier for a player, e.g. a hash of their
   * SteamID. The same player reported by different instances must produce the
   * same `id` so that the cross-instance union deduplicates them.
   */
  id: string
  /** the most recent moment this player was seen active, across all instances */
  lastActiveAt: Date
}
