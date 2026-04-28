import { serve } from '@hono/node-server';
import { Hono } from 'hono';

const app = new Hono();

// Gateway routes
app.get('/', (c) => {
  return c.json({ message: 'API Gateway - Bienvenido' });
});

serve({
  fetch: app.fetch,
  port: 3000,
}, (info) => {
  console.log(`API Gateway running on http://localhost:${info.port}`);
});
