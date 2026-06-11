import { describe, expect, it, vi, beforeEach } from 'vitest'
import { upsertInstance } from './upsert-instance'
import { collections } from '../database/collections'

vi.mock('../database/collections', () => ({
  collections: {
    instances: {
      updateOne: vi.fn(),
    },
  },
}))

describe('upsertInstance()', () => {
  beforeEach(() => {
    vi.mocked(collections.instances.updateOne).mockClear()
  })

  it('upserts the instance keyed by the normalized url', async () => {
    await upsertInstance({
      url: 'https://tf2pickup.pl/some/path',
      name: 'tf2pickup.pl',
      version: '4.10.2',
      queue: { config: '6v6', occupied: 7, capacity: 12 },
      onlinePlayers: 23,
      liveGames: 2,
    })

    expect(collections.instances.updateOne).toHaveBeenCalledWith(
      { url: 'https://tf2pickup.pl' },
      {
        $set: {
          url: 'https://tf2pickup.pl',
          name: 'tf2pickup.pl',
          version: '4.10.2',
          queue: { config: '6v6', occupied: 7, capacity: 12 },
          onlinePlayers: 23,
          liveGames: 2,
          lastSeenAt: expect.any(Date),
        },
        $setOnInsert: { firstSeenAt: expect.any(Date) },
      },
      { upsert: true },
    )
  })

  it('unsets liveGames when the heartbeat does not report it', async () => {
    await upsertInstance({
      url: 'https://tf2pickup.pl',
      name: 'tf2pickup.pl',
      queue: { config: '6v6', occupied: 7, capacity: 12 },
      onlinePlayers: 23,
    })

    expect(collections.instances.updateOne).toHaveBeenCalledWith(
      { url: 'https://tf2pickup.pl' },
      expect.objectContaining({ $unset: { liveGames: '' } }),
      { upsert: true },
    )
  })

  it('strips trailing slashes from the url', async () => {
    await upsertInstance({
      url: 'https://tf2pickup.de/',
      name: 'tf2pickup.de',
      queue: { config: '9v9', occupied: 0, capacity: 18 },
      onlinePlayers: 0,
    })

    expect(collections.instances.updateOne).toHaveBeenCalledWith(
      { url: 'https://tf2pickup.de' },
      expect.anything(),
      { upsert: true },
    )
  })
})
