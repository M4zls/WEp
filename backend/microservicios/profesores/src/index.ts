import '../drizzle/migrate.ts';
import { Hono } from 'hono'
import { cors } from 'hono/cors';
import { profesoresController } from './controllers/ProfesoresController.js';

const app = new Hono()

app.use(cors());
app.get('/health', (c) => c.json({ status: 'ok' }));

app.route('/profesores', profesoresController);

const port = Number(process.env.PORT ?? '3004');

Bun.serve({
  fetch: app.fetch,
  port,
});

console.log(`Microservicio Profesores running on http://localhost:${port}`)
