import { Hono } from 'hono';

const app = new Hono();

const NOTAS_SERVICE = process.env.NOTAS_SERVICE || 'http://localhost:3010';

app.get('/estudiante/:rut', async (c) => {
  const rut = c.req.param('rut');
  try {
    const response = await fetch(`${NOTAS_SERVICE}/notas/estudiante/${rut}`);
    const data = await response.json();
    return c.json(data, response.status as any);
  } catch (error) {
    return c.json({ error: 'Error fetching student grades' }, 500);
  }
});

app.get('/curso/:curso', async (c) => {
  const curso = c.req.param('curso');
  const profesorRut = c.req.query('profesorRut');
  try {
    const url = `${NOTAS_SERVICE}/notas/curso/${curso}${profesorRut ? `?profesorRut=${profesorRut}` : ''}`;
    const response = await fetch(url);
    const data = await response.json();
    return c.json(data, response.status as any);
  } catch (error) {
    return c.json({ error: 'Error fetching course grades' }, 500);
  }
});

app.get('/profesor/:rut', async (c) => {
  const rut = c.req.param('rut');
  try {
    const response = await fetch(`${NOTAS_SERVICE}/notas/profesor/${rut}`);
    const data = await response.json();
    return c.json(data, response.status as any);
  } catch (error) {
    return c.json({ error: 'Error fetching teacher grades' }, 500);
  }
});

app.post('/batch', async (c) => {
  try {
    const body = await c.req.json();
    const response = await fetch(`${NOTAS_SERVICE}/notas/batch`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = await response.json();
    return c.json(data, response.status as any);
  } catch (error) {
    return c.json({ error: 'Error creating grades in batch' }, 500);
  }
});

app.post('/', async (c) => {
  try {
    const body = await c.req.json();
    const response = await fetch(`${NOTAS_SERVICE}/notas`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = await response.json();
    return c.json(data, response.status as any);
  } catch (error) {
    return c.json({ error: 'Error creating grade' }, 500);
  }
});

app.put('/:id', async (c) => {
  const id = c.req.param('id');
  try {
    const body = await c.req.json();
    const response = await fetch(`${NOTAS_SERVICE}/notas/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = await response.json();
    return c.json(data, response.status as any);
  } catch (error) {
    return c.json({ error: 'Error updating grade' }, 500);
  }
});

app.delete('/:id', async (c) => {
  const id = c.req.param('id');
  try {
    const response = await fetch(`${NOTAS_SERVICE}/notas/${id}`, {
      method: 'DELETE',
    });
    const data = await response.json();
    return c.json(data, response.status as any);
  } catch (error) {
    return c.json({ error: 'Error deleting grade' }, 500);
  }
});

export default app;
