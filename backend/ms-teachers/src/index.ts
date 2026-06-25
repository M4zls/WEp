import '../drizzle/migrate.ts';
import { Hono } from 'hono'
import { cors } from 'hono/cors';
import { teachersController } from './controllers/teachers.controller.js';

const app = new Hono()

app.use(cors());
app.get('/health', (c) => c.json({ status: 'ok' }));

app.route('/teachers', teachersController);

const port = Number(process.env.PORT ?? '3004');

Bun.serve({
  fetch: app.fetch,
  port,
});

console.log(`Microservice Teachers running on http://localhost:${port}`)
