import { Hono } from 'hono'
import { studentsController } from './controllers/students.controller.js';

await import('../drizzle/migrate.js');
await import('../drizzle/seed.js');

const app = new Hono()
app.get('/health', (c) => c.json({ status: 'ok' }));

app.route('/students', studentsController)

const port = Number(process.env.PORT ?? '3001');

Bun.serve({
  fetch: app.fetch,
  port,
});

console.log(`Microservice Students running on http://localhost:${port}`)
