import { Hono } from 'hono';

const app = new Hono();

const MS_NOTIFICATIONS_SERVICE = process.env.MS_NOTIFICATIONS_SERVICE || 'http://localhost:3003';

const enToEs: Record<string, string> = {
  userId: 'usuarioId',
};

function mapKeys(obj: any, mapping: Record<string, string>): any {
  if (Array.isArray(obj)) return obj.map(i => mapKeys(i, mapping));
  if (obj && typeof obj === 'object') {
    const mapped: any = {};
    for (const [key, value] of Object.entries(obj)) {
      const newKey = mapping[key] ?? key;
      mapped[newKey] = typeof value === 'object' ? mapKeys(value, mapping) : value;
    }
    return mapped;
  }
  return obj;
}

app.post('/aviso-inasistencia', async (c) => {
  const body = await c.req.json();
  const response = await fetch(`${MS_NOTIFICATIONS_SERVICE}/notifications/aviso-inasistencia`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await response.json();
  return c.json(data, response.status as any);
});

app.post('/aviso-nota', async (c) => {
  const body = await c.req.json();
  const response = await fetch(`${MS_NOTIFICATIONS_SERVICE}/notifications/aviso-nota`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await response.json();
  return c.json(data, response.status as any);
});

app.get('/usuario/:usuarioId', async (c) => {
  const usuarioId = c.req.param('usuarioId');
  const response = await fetch(`${MS_NOTIFICATIONS_SERVICE}/notifications/usuario/${usuarioId}`);
  const data = await response.json();
  return c.json(mapKeys(data, enToEs), response.status as any);
});

app.get('/usuario/:usuarioId/no-leidas', async (c) => {
  const usuarioId = c.req.param('usuarioId');
  const response = await fetch(`${MS_NOTIFICATIONS_SERVICE}/notifications/usuario/${usuarioId}/no-leidas`);
  const data = await response.json();
  return c.json(data, response.status as any);
});

app.put('/:id/leer', async (c) => {
  const id = c.req.param('id');
  const response = await fetch(`${MS_NOTIFICATIONS_SERVICE}/notifications/${id}/leer`, {
    method: 'PUT',
  });
  const data = await response.json();
  return c.json(data, response.status as any);
});

export default app;
