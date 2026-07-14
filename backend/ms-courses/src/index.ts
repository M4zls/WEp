import { Hono } from 'hono';
import { lifecycle, initGlitchtip, glitchtipErrorHandler, glitchtipMiddleware, initGlitchtipLogger } from './glitchtip/index.js'
import { tracingMiddleware } from './tracing/index.js'
import { coursesController } from './controllers/courses.controller.js';
import { subjectsController } from './controllers/subjects.controller.js';
import { courseSubjectsController } from './controllers/course-subjects.controller.js';

await import('../drizzle/migrate.ts');
await import('../drizzle/seed.js');

const app = new Hono();
lifecycle()
initGlitchtip()
initGlitchtipLogger('ms-courses')
app.use('*', tracingMiddleware())
app.use('*', glitchtipMiddleware())
app.onError(glitchtipErrorHandler)
app.get('/health', (c) => c.json({ status: 'ok' }));

app.route('/courses', subjectsController);
app.route('/courses', courseSubjectsController);
app.route('/courses', coursesController);

const port = Number(process.env.PORT ?? '3005');

Bun.serve({
  fetch: app.fetch,
  port,
});

console.log(`Microservice Courses running on http://localhost:${port}`);
