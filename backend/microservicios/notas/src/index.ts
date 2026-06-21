import '../drizzle/migrate.js';
import { Hono } from 'hono'
import { cors } from 'hono/cors';
import { notasController } from './controllers/NotasController.js';

const app = new Hono()

app.use(cors());
app.get('/health', (c) => c.json({ status: 'ok' }));

app.route('/notas', notasController)

const port = Number(process.env.PORT ?? '3010');

Bun.serve({
  fetch: app.fetch,
  port,
});

console.log(`Microservicio Notas running on http://localhost:${port}`)
