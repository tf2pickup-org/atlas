import { z } from 'zod'
import { routes } from '../../../utils/routes'
import { errors } from '../../../errors'
import { verifySecret } from '../../../instances/verify-secret'
import { recordInstanceActivity } from '../../../activity/record-instance-activity'

const bearerPrefix = 'Bearer '

const activitySchema = z.object({
  url: z.url(),
  days: z
    .array(
      z.object({
        day: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
        gamesLaunched: z.number().int().nonnegative(),
      }),
    )
    .max(4000),
})

// eslint-disable-next-line @typescript-eslint/require-await
export default routes(async app => {
  app.put(
    '/',
    {
      schema: {
        body: activitySchema,
      },
    },
    async (req, reply) => {
      const auth = req.headers.authorization
      if (!auth?.startsWith(bearerPrefix)) {
        throw errors.unauthorized()
      }

      verifySecret(auth.slice(bearerPrefix.length))
      await recordInstanceActivity(new URL(req.body.url).origin, req.body.days)
      await reply.status(204).send()
    },
  )
})
