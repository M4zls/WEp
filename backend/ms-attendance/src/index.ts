import { Hono } from 'hono';
import { lifecycle, initGlitchtip, glitchtipErrorHandler, glitchtipMiddleware } from './glitchtip/index.js'
import { tracingMiddleware } from './tracing/index.js'
import { attendanceController } from './controllers/attendance.controller.js';

await import('../drizzle/migrate.js');
await import('../drizzle/seed.js');

const app = new Hono();
lifecycle()
initGlitchtip()
app.use('*', tracingMiddleware())
app.use('*', glitchtipMiddleware())
app.onError(glitchtipErrorHandler)
app.get('/health', (c) => c.json({ status: 'ok' }));
app.route('/attendance', attendanceController);

const port = Number(process.env.PORT ?? '3008');

Bun.serve({
  fetch: app.fetch,
  port,
});

console.log(`Microservice Attendance running on http://localhost:${port}`);
