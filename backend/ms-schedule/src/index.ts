import '../drizzle/migrate.ts';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { scheduleController } from './controllers/schedule.controller.js';

const app = new Hono();

app.use(cors());
app.get('/health', (c) => c.json({ status: 'ok' }));
app.route('/schedules', scheduleController);

const port = Number(process.env.PORT ?? '3007');

Bun.serve({
  fetch: app.fetch,
  port,
});

console.log(`Microservice Schedule running on http://localhost:${port}`);
