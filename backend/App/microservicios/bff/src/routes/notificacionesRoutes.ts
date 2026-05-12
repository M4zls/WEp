/// <reference types="node" />
import { Hono } from 'hono';

const app = new Hono();

const NOTIFICACIONES_SERVICE = process.env.NOTIFICACIONES_SERVICE || 'http://localhost:3003';

app.post('/aviso-inasistencia', async (c) => {
  const body = await c.req.json();
  const response = await fetch(`${NOTIFICACIONES_SERVICE}/notificaciones/aviso-inasistencia`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await response.json();
  return c.json(data, response.status as any);
});

export default app;