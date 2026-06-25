import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { classesController } from './controllers/classes.controller.js';

await import('../drizzle/migrate.ts');
await import('../drizzle/seed.js');

const app = new Hono();

app.use(cors());
app.get('/health', (c) => c.json({ status: 'ok' }));
app.route('/classes', classesController);

const port = Number(process.env.PORT ?? '3006');

Bun.serve({
  fetch: app.fetch,
  port,
});

console.log(`Microservice Classes running on http://localhost:${port}`);
