import { routes } from '../utils/routes'
import { IndexPage } from '../instances/views/html/index.page'
import { InstanceList } from '../instances/views/html/instance-list'

// eslint-disable-next-line @typescript-eslint/require-await
export default routes(async app => {
  app.get('/', async (_req, reply) => reply.html(IndexPage()))

  app.get('/instances', async (_req, reply) => {
    reply.header('cache-control', 'no-store')
    return reply.html(InstanceList())
  })
})
