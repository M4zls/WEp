import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors';
import { getDatabaseinstance } from './models/data.js';
import { notificacionesController } from './controllers/NotificacionesController.js';

const app = new Hono()

getDatabaseinstance(); 

app.use(cors());

app.route('/notificaciones', notificacionesController);

app.get('/health', (c) => c.json({ status: 'ok' }))

serve({
  fetch: app.fetch,
  port: 3003,
}, (info) => {
  console.log(`Microservicio Notificaciones running on http://localhost:${info.port}`)
})