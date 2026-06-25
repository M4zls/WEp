import { Hono } from 'hono'
import { cors } from 'hono/cors';
import { gradesController } from './controllers/grades.controller.js';

await import('../drizzle/migrate.js');
await import('../drizzle/seed.js');

const app = new Hono()

app.use(cors());
app.get('/health', (c) => c.json({ status: 'ok' }));

app.route('/grades', gradesController)

const port = Number(process.env.PORT ?? '3010');

Bun.serve({
  fetch: app.fetch,
  port,
});

console.log(`Microservice Grades running on http://localhost:${port}`)
