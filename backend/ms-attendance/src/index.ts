import '../drizzle/migrate.ts';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { attendanceController } from './controllers/attendance.controller.js';

const app = new Hono();

app.use(cors());
app.get('/health', (c) => c.json({ status: 'ok' }));
app.route('/attendance', attendanceController);

const port = Number(process.env.PORT ?? '3008');

Bun.serve({
  fetch: app.fetch,
  port,
});

console.log(`Microservice Attendance running on http://localhost:${port}`);
