import { Hono } from 'hono'
import { lifecycle, initGlitchtip, glitchtipErrorHandler, glitchtipMiddleware, initGlitchtipLogger } from './glitchtip/index.js'
import { tracingMiddleware } from './tracing/index.js'
import { teachersController } from './controllers/teachers.controller.js';

await import('../drizzle/migrate.ts');
await import('../drizzle/seed.js');

const app = new Hono()
lifecycle()
initGlitchtip()
initGlitchtipLogger('ms-teachers')
app.use('*', tracingMiddleware())
app.use('*', glitchtipMiddleware())
app.onError(glitchtipErrorHandler)
app.get('/health', (c) => c.json({ status: 'ok' }));

app.route('/teachers', teachersController);

const port = Number(process.env.PORT ?? '3004');

Bun.serve({
  fetch: app.fetch,
  port,
});

console.log(`Microservice Teachers running on http://localhost:${port}`)
