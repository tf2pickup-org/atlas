import { createHash, timingSafeEqual } from 'node:crypto'
import { environment } from '../environment'
import { errors } from '../errors'

const sha256 = (value: string) => createHash('sha256').update(value).digest()

const configuredSecrets = environment.ATLAS_SECRETS.map(sha256)

export function verifySecret(secret: string) {
  const hash = sha256(secret)
  if (!configuredSecrets.some(configured => timingSafeEqual(configured, hash))) {
    throw errors.forbidden()
  }
}
