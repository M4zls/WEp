import { Hono } from 'hono'
import { lifecycle, initGlitchtip, glitchtipErrorHandler, glitchtipMiddleware, initGlitchtipLogger } from './glitchtip/index.js'
import { tracingMiddleware } from './tracing/index.js'
import { gradesController } from './controllers/grades.controller.js';

await import('../drizzle/migrate.js');
await import('../drizzle/seed.js');

const app = new Hono()
lifecycle()
initGlitchtip()
initGlitchtipLogger('ms-grades')
app.use('*', tracingMiddleware())
app.use('*', glitchtipMiddleware())
app.onError(glitchtipErrorHandler)
app.get('/health', (c) => c.json({ status: 'ok' }));

app.route('/grades', gradesController)

const port = Number(process.env.PORT ?? '3010');

Bun.serve({
  fetch: app.fetch,
  port,
});

console.log(`Microservice Grades running on http://localhost:${port}`)
