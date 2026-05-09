import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { cursosController } from './controllers/CursosController.js';
import { getDatabaseinstance } from './models/data.js';

const app = new Hono();

getDatabaseinstance();

app.use(cors());
app.route('/cursos', cursosController);

const port = parseInt(process.env.PORT ?? '3005');

serve({
  fetch: app.fetch,
  port,
}, (info) => {
  console.log(`Microservicio Cursos running on http://localhost:${info.port}`);
});
