import '../drizzle/migrate.ts';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { clasesController } from './controllers/ClasesController.js';
import { horariosController } from './controllers/HorariosController.js';

const app = new Hono();

app.use(cors());
app.get('/health', (c) => c.json({ status: 'ok' }));
app.route('/clases', clasesController);
app.route('/horarios', horariosController);

const port = Number(process.env.PORT ?? '3006');

Bun.serve({
  fetch: app.fetch,
  port,
});

console.log(`Microservicio Clases running on http://localhost:${port}`);
