import { z } from 'zod'
import dotenv from 'dotenv'

dotenv.config()

const environmentSchema = z.object({
  NODE_ENV: z.string().default('development'),
  LOG_LEVEL: z.enum(['trace', 'debug', 'info', 'warn', 'error', 'fatal']).default('info'),
  APP_HOST: z.string().default('localhost'),
  APP_PORT: z.coerce.number().default(3000),

  MONGODB_URI: z.url(),
  ATLAS_SECRETS: z
    .string()
    .min(1)
    .transform(value =>
      value
        .split(',')
        .map(secret => secret.trim())
        .filter(secret => secret.length > 0),
    ),
})

export const environment = environmentSchema.parse(process.env)
