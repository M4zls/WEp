import { Hono } from 'hono'
import { lifecycle, initGlitchtip, glitchtipErrorHandler, glitchtipMiddleware } from './glitchtip/index.js'
import { tracingMiddleware } from './tracing/index.js'
import auth from './controllers/auth.controller.js';

await import('../drizzle/migrate.js');
await import('../drizzle/seed.js');

const app = new Hono()
lifecycle()
initGlitchtip()
app.use('*', tracingMiddleware())
app.use('*', glitchtipMiddleware())
app.onError(glitchtipErrorHandler)

app.get('/health', (c) => c.json({ status: 'ok' }))

app.route('/auth', auth)

const port = Number(process.env.PORT ?? '3002')

Bun.serve({
  fetch: app.fetch,
  port,
})

console.log(`Microservice Auth running on http://localhost:${port}`)
