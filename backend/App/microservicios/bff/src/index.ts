import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import estudiantesRoutes from './routes/estudiantesRoutes';
import profesoresRoutes from './routes/profesoresRoutes';
import autentificacionRoutes from './routes/autentificacionRoutes';
import cursosRoutes from './routes/cursosRoutes';
import openapiRoutes from './openapi.js';

const app = new Hono();

// CORS
app.use('*', cors());

// Swagger UI / OpenAPI docs
app.route('/docs', openapiRoutes);

// Rutas agregadas
app.route('/api/estudiantes', estudiantesRoutes);
app.route('/api/profesores', profesoresRoutes);
app.route('/api/auth', autentificacionRoutes);
app.route('/api/cursos', cursosRoutes);

// Health check
app.get('/health', (c) => {
  return c.json({ status: 'BFF is running' });
});

const port = 3000;
console.log(`BFF running on http://localhost:${port}`);

serve({
  fetch: app.fetch,
  port,
});
