import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { messagingController } from './controllers/messaging.controller.js';

await import('../drizzle/migrate.ts');
await import('../drizzle/seed.js');

/** Punto de entrada del microservicio de mensajería. */
const app = new Hono();
app.use(cors());
app.get('/health', (c) => c.json({ status: 'ok' }));
app.route('/messaging', messagingController);

const port = Number(process.env.PORT ?? '3009');

Bun.serve({
  fetch: app.fetch,
  port,
});

console.log(`Microservice Messaging running on http://localhost:${port}`);
