import { z } from 'zod'

export const heartbeatSchema = z.object({
  url: z.url(),
  name: z.string().min(1),
  version: z.string().optional(),
  queue: z.object({
    config: z.string().min(1),
    occupied: z.number().int().nonnegative(),
    capacity: z.number().int().positive(),
  }),
  onlinePlayers: z.number().int().nonnegative(),
})
