import '../drizzle/migrate.ts';
import '../drizzle/seed.ts';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { cursosController } from './controllers/CursosController.js';

const app = new Hono();

app.use(cors());
app.get('/health', (c) => c.json({ status: 'ok' }));

app.route('/cursos', cursosController);

const port = Number(process.env.PORT ?? '3005');

Bun.serve({
  fetch: app.fetch,
  port,
});

console.log(`Microservicio Cursos running on http://localhost:${port}`);
