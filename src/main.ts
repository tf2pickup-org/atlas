import fastify from 'fastify'
import { serializerCompiler, validatorCompiler } from 'fastify-type-provider-zod'
import { dirname, resolve } from 'node:path'
import { createRequire } from 'node:module'
import autoload from '@fastify/autoload'
import { logger, logger as loggerInstance } from './logger'
import { environment } from './environment'
import { version } from './version'
import { ensureIndexes } from './database/ensure-indexes'

const app = fastify({ loggerInstance })

app.setSerializerCompiler(serializerCompiler)
app.setValidatorCompiler(validatorCompiler)

logger.info(`starting atlas ${version}`)

await ensureIndexes()

await app.register(await import('@fastify/helmet'), {
  contentSecurityPolicy: environment.NODE_ENV === 'production',
})
await app.register(await import('@fastify/sensible'))
await app.register(await import('@fastify/static'), {
  root: resolve(import.meta.dirname, '..', 'public'),
  prefix: '/',
})

const require = createRequire(import.meta.url)
await app.register(await import('@fastify/static'), {
  root: dirname(require.resolve('htmx.org')),
  prefix: '/js/',
  decorateReply: false,
})

await app.register((await import('@kitajs/fastify-html-plugin')).default)

await app.register(autoload, {
  dir: resolve(import.meta.dirname, 'routes'),
  dirNameRoutePrefix: true,
  scriptPattern: /(?:(?:^.?|\.[^d]|[^.]d|[^.][^d])\.ts|\.js|\.cjs|\.mjs|\.cts|\.mts|\.tsx?)$/,
})

await app.listen({ host: environment.APP_HOST, port: environment.APP_PORT })
