import { Hono } from 'hono';
import { attendanceController } from './controllers/attendance.controller.js';

await import('../drizzle/migrate.js');
await import('../drizzle/seed.js');

const app = new Hono();
app.get('/health', (c) => c.json({ status: 'ok' }));
app.route('/attendance', attendanceController);

const port = Number(process.env.PORT ?? '3008');

Bun.serve({
  fetch: app.fetch,
  port,
});

console.log(`Microservice Attendance running on http://localhost:${port}`);
