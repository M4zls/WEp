import { Hono } from 'hono';
import { lifecycle, initGlitchtip, glitchtipErrorHandler, glitchtipMiddleware } from './glitchtip/index.js'
import { tracingMiddleware } from './tracing/index.js'
import { classesController } from './controllers/classes.controller.js';

await import('../drizzle/migrate.js');
await import('../drizzle/seed.js');

const app = new Hono();
lifecycle()
initGlitchtip()
app.use('*', tracingMiddleware())
app.use('*', glitchtipMiddleware())
app.onError(glitchtipErrorHandler)
app.get('/health', (c) => c.json({ status: 'ok' }));
app.route('/classes', classesController);

const port = Number(process.env.PORT ?? '3006');

Bun.serve({
  fetch: app.fetch,
  port,
});

console.log(`Microservice Classes running on http://localhost:${port}`);
