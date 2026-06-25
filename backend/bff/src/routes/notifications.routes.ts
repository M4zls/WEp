import { Hono } from 'hono';

const app = new Hono();

const MS_NOTIFICATIONS_SERVICE = process.env.MS_NOTIFICATIONS_SERVICE || 'http://localhost:3003';

app.post('/aviso-inasistencia', async (c) => {
  const body = await c.req.json();
  const response = await fetch(`${MS_NOTIFICATIONS_SERVICE}/notificaciones/aviso-inasistencia`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await response.json();
  return c.json(data, response.status as any);
});

app.post('/aviso-nota', async (c) => {
  const body = await c.req.json();
  const response = await fetch(`${MS_NOTIFICATIONS_SERVICE}/notificaciones/aviso-nota`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await response.json();
  return c.json(data, response.status as any);
});

app.get('/usuario/:usuarioId', async (c) => {
  const usuarioId = c.req.param('usuarioId');
  const response = await fetch(`${MS_NOTIFICATIONS_SERVICE}/notificaciones/usuario/${usuarioId}`);
  const data = await response.json();
  return c.json(data, response.status as any);
});

app.get('/usuario/:usuarioId/no-leidas', async (c) => {
  const usuarioId = c.req.param('usuarioId');
  const response = await fetch(`${MS_NOTIFICATIONS_SERVICE}/notificaciones/usuario/${usuarioId}/no-leidas`);
  const data = await response.json();
  return c.json(data, response.status as any);
});

app.put('/:id/leer', async (c) => {
  const id = c.req.param('id');
  const response = await fetch(`${MS_NOTIFICATIONS_SERVICE}/notificaciones/${id}/leer`, {
    method: 'PUT',
  });
  const data = await response.json();
  return c.json(data, response.status as any);
});

export default app;
