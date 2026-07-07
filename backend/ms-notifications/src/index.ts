import { Hono } from 'hono'
import { notificationsController } from './controllers/notifications.controller.js';

await import('../drizzle/migrate.ts');
await import('../drizzle/seed.js');

const app = new Hono()

app.route('/notifications', notificationsController);

app.get('/health', (c) => c.json({ status: 'ok' }))

const port = Number(process.env.PORT ?? '3003');

Bun.serve({
  fetch: app.fetch,
  port,
});

console.log(`Microservice Notifications running on http://localhost:${port}`)
