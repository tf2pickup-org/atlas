import { z } from 'zod'
import { routes } from '../../../utils/routes'
import { errors } from '../../../errors'
import { verifySecret } from '../../../instances/verify-secret'
import { recordActivePlayers } from '../../../players/record-active-players'

const bearerPrefix = 'Bearer '

const activePlayersSchema = z.object({
  url: z.url(),
  players: z
    .array(
      z.object({
        id: z.string().min(1).max(128),
        lastActiveAt: z.iso.datetime(),
      }),
    )
    .max(100000),
})

// eslint-disable-next-line @typescript-eslint/require-await
export default routes(async app => {
  app.put(
    '/',
    {
      schema: {
        body: activePlayersSchema,
      },
    },
    async (req, reply) => {
      const auth = req.headers.authorization
      if (!auth?.startsWith(bearerPrefix)) {
        throw errors.unauthorized()
      }

      verifySecret(auth.slice(bearerPrefix.length))
      await recordActivePlayers(
        req.body.players.map(({ id, lastActiveAt }) => ({
          id,
          lastActiveAt: new Date(lastActiveAt),
        })),
      )
      await reply.status(204).send()
    },
  )
})
