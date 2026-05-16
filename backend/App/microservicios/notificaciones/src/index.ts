import { Hono } from 'hono'
import { cors } from 'hono/cors';
import { notificacionesController } from './controllers/NotificacionesController.js';

const app = new Hono()

app.use(cors());

app.route('/notificaciones', notificacionesController);

app.get('/health', (c) => c.json({ status: 'ok' }))

const port = Number(process.env.PORT ?? '3003');

Bun.serve({
  fetch: app.fetch,
  port,
});

console.log(`Microservicio Notificaciones running on http://localhost:${port}`)
