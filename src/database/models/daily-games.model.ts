export interface DailyGamesModel {
  /** normalized origin of the reporting instance, e.g. https://tf2pickup.pl */
  instanceUrl: string
  /** UTC day, formatted as YYYY-MM-DD */
  day: string
  /** games launched by that instance on that day */
  gamesLaunched: number
}
