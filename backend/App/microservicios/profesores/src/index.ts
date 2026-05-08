import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors';
import { profesoresController } from './controllers/ProfesoresController.js';
import { getDatabaseinstance } from './models/data.js';

const app = new Hono()

getDatabaseinstance(); 

app.use(cors());
app.route('/profesores', profesoresController);

serve({
  fetch: app.fetch,
  port: 3004,
}, (info) => {
  console.log(`Microservicio Profesores running on http://localhost:${info.port}`)
})