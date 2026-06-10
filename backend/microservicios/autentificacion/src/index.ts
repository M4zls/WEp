import '../drizzle/migrate.js';
import { Hono } from 'hono'
import auth from './controllers/AuthController.js';

const app = new Hono()

app.route('/auth', auth)

const port = Number(process.env.PORT ?? '3002')

Bun.serve({
  fetch: app.fetch,
  port,
})

console.log(`Microservicio Autenticación running on http://localhost:${port}`)
