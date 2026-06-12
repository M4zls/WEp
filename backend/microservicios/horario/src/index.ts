import '../drizzle/migrate.ts';
import '../drizzle/seed.ts';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { horariosController } from './controllers/HorariosController.js';

const app = new Hono();

app.use(cors());
app.route('/horarios', horariosController);

const port = Number(process.env.PORT ?? '3007');

Bun.serve({
  fetch: app.fetch,
  port,
});

console.log(`Microservicio Horario running on http://localhost:${port}`);
