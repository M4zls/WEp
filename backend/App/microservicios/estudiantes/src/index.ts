import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { estudianteController } from './controllers/EstudiantesController.js';
import { getDatabaseinstance } from './models/data.js';

const app = new Hono()

getDatabaseinstance(); 

app.route('/estudiantes', estudianteController)

serve({
  fetch: app.fetch,
  port: 3001,
}, (info) => {
  console.log(`Microservicio Estudiantes running on http://localhost:${info.port}`)
})
