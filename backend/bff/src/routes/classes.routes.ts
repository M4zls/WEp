import { Hono } from 'hono';

const app = new Hono();

const MS_CLASSES_SERVICE = process.env.MS_CLASSES_SERVICE || 'http://localhost:3006';

app.get('/', async (c) => {
  try {
    const cursoAsignaturaId = c.req.query('curso_asignatura_id');
    let url = `${MS_CLASSES_SERVICE}/clases`;
    if (cursoAsignaturaId) url += `?curso_asignatura_id=${cursoAsignaturaId}`;
    const response = await fetch(url);
    const data = await response.json();
    return c.json(data);
  } catch (error) {
    return c.json({ error: 'Error fetching clases' }, 500);
  }
});

app.get('/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const response = await fetch(`${MS_CLASSES_SERVICE}/clases/${id}`);
    const data = await response.json();
    return c.json(data, response.status as any);
  } catch (error) {
    return c.json({ error: 'Error fetching clase' }, 500);
  }
});

app.post('/', async (c) => {
  try {
    const body = await c.req.json();
    const response = await fetch(`${MS_CLASSES_SERVICE}/clases`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = await response.json();
    return c.json(data, response.status as any);
  } catch (error) {
    return c.json({ error: 'Error creating clase' }, 500);
  }
});

app.put('/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const body = await c.req.json();
    const response = await fetch(`${MS_CLASSES_SERVICE}/clases/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = await response.json();
    return c.json(data, response.status as any);
  } catch (error) {
    return c.json({ error: 'Error updating clase' }, 500);
  }
});

app.delete('/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const response = await fetch(`${MS_CLASSES_SERVICE}/clases/${id}`, {
      method: 'DELETE',
    });
    const data = await response.json();
    return c.json(data, response.status as any);
  } catch (error) {
    return c.json({ error: 'Error deleting clase' }, 500);
  }
});

export default app;
