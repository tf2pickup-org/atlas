export interface DailyGamesModel {
  /** UTC day, formatted as YYYY-MM-DD */
  day: string
  /** total games launched across all instances on that day */
  gamesLaunched: number
}
