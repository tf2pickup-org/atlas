import { describe, expect, it, vi } from 'vitest'
import { verifySecret } from './verify-secret'

vi.mock('../environment', () => ({
  environment: {
    ATLAS_SECRETS: ['secret1', 'secret2'],
  },
}))

describe('verifySecret()', () => {
  it('accepts a configured secret', () => {
    expect(() => verifySecret('secret1')).not.toThrow()
    expect(() => verifySecret('secret2')).not.toThrow()
  })

  it('rejects an unknown secret', () => {
    expect(() => verifySecret('nope')).toThrow()
  })

  it('rejects an empty secret', () => {
    expect(() => verifySecret('')).toThrow()
  })
})
