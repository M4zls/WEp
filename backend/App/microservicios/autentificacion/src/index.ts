import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import auth from './controllers/AuthController.js';
import { getDatabaseinstance } from './models/data.js';

const app = new Hono()

getDatabaseinstance(); 

app.route('/auth', auth)

serve({
  fetch: app.fetch,
  port: 3002,
}, (info) => {
  console.log(`Microservicio Autenticación running on http://localhost:${info.port}`)
})
