import { describe, expect, it, vi, beforeEach } from 'vitest'
import { recordActivePlayers } from './record-active-players'
import { collections } from '../database/collections'

vi.mock('../database/collections', () => ({
  collections: {
    activePlayers: {
      bulkWrite: vi.fn(),
    },
  },
}))

describe('recordActivePlayers()', () => {
  beforeEach(() => {
    vi.mocked(collections.activePlayers.bulkWrite).mockClear()
  })

  it('upserts each player, keeping the most recent activity', async () => {
    const a = new Date('2026-06-21T10:00:00.000Z')
    const b = new Date('2026-06-22T10:00:00.000Z')

    await recordActivePlayers([
      { id: 'player-a', lastActiveAt: a },
      { id: 'player-b', lastActiveAt: b },
    ])

    expect(collections.activePlayers.bulkWrite).toHaveBeenCalledWith([
      {
        updateOne: {
          filter: { id: 'player-a' },
          update: { $max: { lastActiveAt: a } },
          upsert: true,
        },
      },
      {
        updateOne: {
          filter: { id: 'player-b' },
          update: { $max: { lastActiveAt: b } },
          upsert: true,
        },
      },
    ])
  })

  it('does nothing when there are no players to record', async () => {
    await recordActivePlayers([])

    expect(collections.activePlayers.bulkWrite).not.toHaveBeenCalled()
  })
})
