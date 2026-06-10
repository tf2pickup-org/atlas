import { z } from 'zod'
import { routes } from '../utils/routes'
import { errors } from '../errors'
import { IndexPage } from '../instances/views/html/index.page'
import { InstanceList } from '../instances/views/html/instance-list'
import { getFavicon } from '../instances/get-favicon'

// eslint-disable-next-line @typescript-eslint/require-await
export default routes(async app => {
  app.get('/', async (_req, reply) => reply.html(IndexPage()))

  app.get('/instances', async (_req, reply) => {
    reply.header('cache-control', 'no-store')
    return reply.html(InstanceList())
  })

  app.get(
    '/instances/favicon',
    {
      schema: {
        querystring: z.object({ url: z.url() }),
      },
    },
    async (req, reply) => {
      const favicon = await getFavicon(req.query.url)
      if (!favicon) {
        throw errors.notFound()
      }

      reply.header('cache-control', 'public, max-age=3600')
      return reply.type(favicon.contentType).send(favicon.body)
    },
  )
})
