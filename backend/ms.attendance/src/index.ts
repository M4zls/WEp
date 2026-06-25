import '../drizzle/migrate.ts';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { asistenciaController } from './controllers/AsistenciaController.js';

const app = new Hono();

app.use(cors());
app.get('/health', (c) => c.json({ status: 'ok' }));
app.route('/asistencia', asistenciaController);

const port = Number(process.env.PORT ?? '3008');

Bun.serve({
  fetch: app.fetch,
  port,
});

console.log(`Microservicio Asistencia running on http://localhost:${port}`);
