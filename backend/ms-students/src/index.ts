import '../drizzle/migrate.js';
import { Hono } from 'hono'
import { cors } from 'hono/cors';
import { studentsController } from './controllers/students.controller.js';

const app = new Hono()

app.use(cors());
app.get('/health', (c) => c.json({ status: 'ok' }));

app.route('/students', studentsController)

const port = Number(process.env.PORT ?? '3001');

Bun.serve({
  fetch: app.fetch,
  port,
});

console.log(`Microservice Students running on http://localhost:${port}`)
