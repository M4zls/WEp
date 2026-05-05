import { Hono } from 'hono';

const app = new Hono();

const PROFESORES_SERVICE = process.env.PROFESORES_SERVICE || 'http://localhost:3004';

// GET todos los profesores
app.get('/', async (c) => {
  try {
    const response = await fetch(`${PROFESORES_SERVICE}/profesores`);
    const data = await response.json();
    return c.json(data);
  } catch (error) {
    return c.json({ error: 'Error fetching profesores' }, 500);
  }
});

// GET profesor por ID
app.get('/:id', async (c) => {
  const id = c.req.param('id');
  try {
    const response = await fetch(`${PROFESORES_SERVICE}/profesores/${id}`);
    const data = await response.json();
    return c.json(data);
  } catch (error) {
    return c.json({ error: 'Error fetching profesor' }, 500);
  }
});

// POST crear profesor
app.post('/', async (c) => {
  try {
    const body = await c.req.json();
    const response = await fetch(`${PROFESORES_SERVICE}/profesores`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = await response.json();
    return c.json(data, 201);
  } catch (error) {
    return c.json({ error: 'Error creating profesor' }, 500);
  }
});

// PUT actualizar profesor
app.put('/:id', async (c) => {
  const id = c.req.param('id');
  try {
    const body = await c.req.json();
    const response = await fetch(`${PROFESORES_SERVICE}/profesores/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = await response.json();
    return c.json(data);
  } catch (error) {
    return c.json({ error: 'Error updating profesor' }, 500);
  }
});

// DELETE eliminar profesor
app.delete('/:id', async (c) => {
  const id = c.req.param('id');
  try {
    await fetch(`${PROFESORES_SERVICE}/profesores/${id}`, {
      method: 'DELETE',
    });
    return c.json({ success: true });
  } catch (error) {
    return c.json({ error: 'Error deleting profesor' }, 500);
  }
});

export default app;
