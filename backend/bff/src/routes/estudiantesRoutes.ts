import { Hono } from 'hono';
import { loginBffSchema } from '../dtos/BffDto.js';

const app = new Hono();

const ESTUDIANTES_SERVICE = process.env.ESTUDIANTES_SERVICE || 'http://localhost:3001';

app.post('/login', async (c) => {
  try {
    const body = await c.req.json();
    const parsed = loginBffSchema.safeParse(body);
    if (!parsed.success) {
      const msgs = parsed.error.issues.map(i => i.message).join(', ');
      return c.json({ error: msgs }, 400);
    }
    const response = await fetch(`${ESTUDIANTES_SERVICE}/estudiantes/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = await response.json();
    return c.json(data, response.status as any);
  } catch (error) {
    return c.json({ error: 'Error during student login' }, 500);
  }
});

app.get('/', async (c) => {
  try {
    const response = await fetch(`${ESTUDIANTES_SERVICE}/estudiantes`);
    const data = await response.json();
    return c.json(data);
  } catch (error) {
    return c.json({ error: 'Error fetching estudiantes' }, 500);
  }
});

app.get('/:id', async (c) => {
  const id = c.req.param('id');
  try {
    const response = await fetch(`${ESTUDIANTES_SERVICE}/estudiantes/${id}`);
    const data = await response.json();
    return c.json(data);
  } catch (error) {
    return c.json({ error: 'Error fetching estudiante' }, 500);
  }
});

app.post('/', async (c) => {
  try {
    const body = await c.req.json();
    const response = await fetch(`${ESTUDIANTES_SERVICE}/estudiantes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = await response.json();
    return c.json(data, response.status as any);
  } catch (error) {
    return c.json({ error: 'Error creating estudiante' }, 500);
  }
});

app.put('/:id', async (c) => {
  const id = c.req.param('id');
  try {
    const body = await c.req.json();
    const response = await fetch(`${ESTUDIANTES_SERVICE}/estudiantes/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = await response.json();
    return c.json(data, response.status as any);
  } catch (error) {
    return c.json({ error: 'Error updating estudiante' }, 500);
  }
});

app.delete('/:id', async (c) => {
  const id = c.req.param('id');
  try {
    const response = await fetch(`${ESTUDIANTES_SERVICE}/estudiantes/${id}`, {
      method: 'DELETE',
    });
    const data = await response.json();
    return c.json(data, response.status as any);
  } catch (error) {
    return c.json({ error: 'Error deleting estudiante' }, 500);
  }
});

app.get('/curso/:curso', async (c) => {
  const curso = c.req.param('curso');
  try {
    const response = await fetch(`${ESTUDIANTES_SERVICE}/estudiantes/curso/${curso}`);
    const data = await response.json();
    return c.json(data);
  } catch (error) {
    return c.json({ error: 'Error fetching estudiantes por curso' }, 500);
  }
});

export default app;
