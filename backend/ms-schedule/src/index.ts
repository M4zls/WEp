import { Hono } from 'hono';
import { scheduleController } from './controllers/schedule.controller.js';

await import('../drizzle/migrate.js');
await import('../drizzle/seed.js');

const app = new Hono();
app.get('/health', (c) => c.json({ status: 'ok' }));
app.route('/schedules', scheduleController);

const port = Number(process.env.PORT ?? '3007');

Bun.serve({
  fetch: app.fetch,
  port,
});

console.log(`Microservice Schedule running on http://localhost:${port}`);
