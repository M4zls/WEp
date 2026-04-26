import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { estudianteController } from './controllers/EstudiantesController.js';
import { getDatabaseinstance } from './utils/data.js';

const app = new Hono()

getDatabaseinstance(); 

app.route('/estudiantes/', estudianteController)

serve({
  fetch: app.fetch,
  port: 3000,
}, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`)
})
