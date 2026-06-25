import { Hono } from 'hono'
import auth from './controllers/auth.controller.js';

await import('../drizzle/migrate.js');
await import('../drizzle/seed.js');

const app = new Hono()

app.get('/health', (c) => c.json({ status: 'ok' }))

app.route('/auth', auth)

const port = Number(process.env.PORT ?? '3002')

Bun.serve({
  fetch: app.fetch,
  port,
})

console.log(`Microservice Auth running on http://localhost:${port}`)
