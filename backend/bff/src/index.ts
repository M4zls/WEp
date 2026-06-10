import { Hono } from 'hono';
import { cors } from 'hono/cors';
import estudiantesRoutes from './routes/estudiantesRoutes.js';
import profesoresRoutes from './routes/profesoresRoutes.js';
import autentificacionRoutes from './routes/autentificacionRoutes.js';
import cursosRoutes from './routes/cursosRoutes.js';
import clasesRoutes from './routes/clasesRoutes.js';
import horariosRoutes from './routes/horariosRoutes.js';
import openapiRoutes from './openapi.js';

const app = new Hono();

app.use('*', cors());

app.route('/docs', openapiRoutes);

app.route('/api/estudiantes', estudiantesRoutes);
app.route('/api/profesores', profesoresRoutes);
app.route('/api/auth', autentificacionRoutes);
app.route('/api/cursos', cursosRoutes);
app.route('/api/clases', clasesRoutes);
app.route('/api/horarios', horariosRoutes);

app.get('/health', (c) => {
  return c.json({ status: 'BFF is running' });
});

const port = Number(process.env.PORT ?? '3000');

Bun.serve({
  fetch: app.fetch,
  port,
});

console.log(`BFF running on http://localhost:${port}`);
