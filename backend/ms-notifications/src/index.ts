import '../drizzle/migrate.ts';
import { Hono } from 'hono'
import { cors } from 'hono/cors';
import { notificationsController } from './controllers/notifications.controller.js';

const app = new Hono()

app.use(cors());

app.route('/notifications', notificationsController);

app.get('/health', (c) => c.json({ status: 'ok' }))

const port = Number(process.env.PORT ?? '3003');

Bun.serve({
  fetch: app.fetch,
  port,
});

console.log(`Microservice Notifications running on http://localhost:${port}`)
