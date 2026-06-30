import { describe, expect, it, vi, beforeEach } from 'vitest'
import { getActivePlayerCount } from './get-active-player-count'
import { collections } from '../database/collections'

vi.mock('../database/collections', () => ({
  collections: {
    activePlayers: {
      countDocuments: vi.fn(),
    },
  },
}))

describe('getActivePlayerCount()', () => {
  beforeEach(() => {
    vi.mocked(collections.activePlayers.countDocuments).mockClear()
  })

  it('counts players active within the last 30 days', async () => {
    vi.mocked(collections.activePlayers.countDocuments).mockResolvedValue(42)

    const count = await getActivePlayerCount(new Date('2026-06-30T00:00:00.000Z'))

    expect(count).toBe(42)
    expect(collections.activePlayers.countDocuments).toHaveBeenCalledWith({
      lastActiveAt: { $gte: new Date('2026-05-31T00:00:00.000Z') },
    })
  })
})
