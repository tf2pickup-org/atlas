import { routes } from '../../../utils/routes'
import { errors } from '../../../errors'
import { heartbeatSchema } from '../../../instances/heartbeat.schema'
import { verifySecret } from '../../../instances/verify-secret'
import { upsertInstance } from '../../../instances/upsert-instance'

const bearerPrefix = 'Bearer '

// eslint-disable-next-line @typescript-eslint/require-await
export default routes(async app => {
  app.put(
    '/',
    {
      schema: {
        body: heartbeatSchema,
      },
    },
    async (req, reply) => {
      const auth = req.headers.authorization
      if (!auth?.startsWith(bearerPrefix)) {
        throw errors.unauthorized()
      }

      verifySecret(auth.slice(bearerPrefix.length))
      await upsertInstance(req.body)
      await reply.status(204).send()
    },
  )
})
