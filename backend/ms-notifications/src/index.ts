import { Hono } from 'hono'
import { lifecycle, initGlitchtip, glitchtipErrorHandler, glitchtipMiddleware } from './glitchtip/index.js'
import { tracingMiddleware } from './tracing/index.js'
import { notificationsController } from './controllers/notifications.controller.js';

await import('../drizzle/migrate.ts');
await import('../drizzle/seed.js');

const app = new Hono()
lifecycle()
initGlitchtip()
app.use('*', tracingMiddleware())
app.use('*', glitchtipMiddleware())
app.onError(glitchtipErrorHandler)

app.route('/notifications', notificationsController);

app.get('/health', (c) => c.json({ status: 'ok' }))

const port = Number(process.env.PORT ?? '3003');

Bun.serve({
  fetch: app.fetch,
  port,
});

console.log(`Microservice Notifications running on http://localhost:${port}`)
