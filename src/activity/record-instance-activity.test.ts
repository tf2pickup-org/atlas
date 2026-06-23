import { describe, expect, it, vi, beforeEach } from 'vitest'
import { recordInstanceActivity } from './record-instance-activity'
import { collections } from '../database/collections'

vi.mock('../database/collections', () => ({
  collections: {
    dailyGames: {
      bulkWrite: vi.fn(),
    },
  },
}))

describe('recordInstanceActivity()', () => {
  beforeEach(() => {
    vi.mocked(collections.dailyGames.bulkWrite).mockClear()
  })

  it('idempotently sets each instance/day count', async () => {
    await recordInstanceActivity('https://tf2pickup.pl', [
      { day: '2026-06-21', gamesLaunched: 4 },
      { day: '2026-06-22', gamesLaunched: 7 },
    ])

    expect(collections.dailyGames.bulkWrite).toHaveBeenCalledWith([
      {
        updateOne: {
          filter: { instanceUrl: 'https://tf2pickup.pl', day: '2026-06-21' },
          update: { $set: { gamesLaunched: 4 } },
          upsert: true,
        },
      },
      {
        updateOne: {
          filter: { instanceUrl: 'https://tf2pickup.pl', day: '2026-06-22' },
          update: { $set: { gamesLaunched: 7 } },
          upsert: true,
        },
      },
    ])
  })

  it('does nothing when there are no days to record', async () => {
    await recordInstanceActivity('https://tf2pickup.pl', [])

    expect(collections.dailyGames.bulkWrite).not.toHaveBeenCalled()
  })
})
