import { Hono } from 'hono';

const app = new Hono();

const ESTUDIANTES_SERVICE = process.env.ESTUDIANTES_SERVICE || 'http://localhost:3001';

// GET todos los estudiantes
app.get('/', async (c) => {
  try {
    const response = await fetch(`${ESTUDIANTES_SERVICE}/estudiantes`);
    const data = await response.json();
    return c.json(data);
  } catch (error) {
    return c.json({ error: 'Error fetching estudiantes' }, 500);
  }
});

// GET estudiante por ID
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

// POST crear estudiante
app.post('/', async (c) => {
  try {
    const body = await c.req.json();
    const response = await fetch(`${ESTUDIANTES_SERVICE}/estudiantes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = await response.json();
    return c.json(data, 201);
  } catch (error) {
    return c.json({ error: 'Error creating estudiante' }, 500);
  }
});

// PUT actualizar estudiante
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
    return c.json(data);
  } catch (error) {
    return c.json({ error: 'Error updating estudiante' }, 500);
  }
});

// DELETE eliminar estudiante
app.delete('/:id', async (c) => {
  const id = c.req.param('id');
  try {
    const response = await fetch(`${ESTUDIANTES_SERVICE}/estudiantes/${id}`, {
      method: 'DELETE',
    });
    return c.json({ success: true });
  } catch (error) {
    return c.json({ error: 'Error deleting estudiante' }, 500);
  }
});

export default app;
