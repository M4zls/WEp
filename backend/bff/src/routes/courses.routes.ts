import { Hono } from 'hono';
import { crearCursoBffSchema, crearAsignaturaBffSchema, asignarMateriaBffSchema } from '../dtos/BffDto.js';

const app = new Hono();

const MS_COURSES_SERVICE = process.env.MS_COURSES_SERVICE || 'http://localhost:3005';

app.get('/', async (c) => {
  try {
    const response = await fetch(`${MS_COURSES_SERVICE}/courses`);
    const data = await response.json();
    return c.json(data);
  } catch (error) {
    return c.json({ error: 'Error fetching cursos' }, 500);
  }
});

app.get('/:id', async (c) => {
  const id = c.req.param('id');
  try {
    const response = await fetch(`${MS_COURSES_SERVICE}/courses/${id}`);
    const data = await response.json();
    return c.json(data, response.status as any);
  } catch (error) {
    return c.json({ error: 'Error fetching curso' }, 500);
  }
});

app.post('/', async (c) => {
  try {
    const body = await c.req.json();
    const parsed = crearCursoBffSchema.safeParse(body);
    if (!parsed.success) {
      const msgs = parsed.error.issues.map(i => i.message).join(', ');
      return c.json({ error: msgs }, 400);
    }
    const response = await fetch(`${MS_COURSES_SERVICE}/courses`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(parsed.data),
    });
    const data = await response.json();
    return c.json(data, response.status as any);
  } catch (error) {
    return c.json({ error: 'Error creating curso' }, 500);
  }
});

app.put('/:id', async (c) => {
  const id = c.req.param('id');
  try {
    const body = await c.req.json();
    const response = await fetch(`${MS_COURSES_SERVICE}/courses/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = await response.json();
    return c.json(data, response.status as any);
  } catch (error) {
    return c.json({ error: 'Error updating curso' }, 500);
  }
});

app.delete('/:id', async (c) => {
  const id = c.req.param('id');
  try {
    const response = await fetch(`${MS_COURSES_SERVICE}/courses/${id}`, {
      method: 'DELETE',
    });
    const data = await response.json();
    return c.json(data, response.status as any);
  } catch (error) {
    return c.json({ error: 'Error deleting curso' }, 500);
  }
});

app.get('/subjects', async (c) => {
  try {
    const response = await fetch(`${MS_COURSES_SERVICE}/courses/subjects`);
    const data = await response.json();
    return c.json(data);
  } catch (error) {
    return c.json({ error: 'Error fetching asignaturas' }, 500);
  }
});

app.post('/subjects', async (c) => {
  try {
    const body = await c.req.json();
    const parsed = crearAsignaturaBffSchema.safeParse(body);
    if (!parsed.success) {
      const msgs = parsed.error.issues.map(i => i.message).join(', ');
      return c.json({ error: msgs }, 400);
    }
    const response = await fetch(`${MS_COURSES_SERVICE}/courses/subjects`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(parsed.data),
    });
    const data = await response.json();
    return c.json(data, response.status as any);
  } catch (error) {
    return c.json({ error: 'Error creating asignatura' }, 500);
  }
});

app.put('/subjects/:id', async (c) => {
  const id = c.req.param('id');
  try {
    const body = await c.req.json();
    const response = await fetch(`${MS_COURSES_SERVICE}/courses/subjects/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = await response.json();
    return c.json(data, response.status as any);
  } catch (error) {
    return c.json({ error: 'Error updating asignatura' }, 500);
  }
});

app.delete('/subjects/:id', async (c) => {
  const id = c.req.param('id');
  try {
    const response = await fetch(`${MS_COURSES_SERVICE}/courses/subjects/${id}`, {
      method: 'DELETE',
    });
    const data = await response.json();
    return c.json(data, response.status as any);
  } catch (error) {
    return c.json({ error: 'Error deleting asignatura' }, 500);
  }
});

app.get('/:courseId/subjects', async (c) => {
  const courseId = c.req.param('courseId');
  try {
    const response = await fetch(`${MS_COURSES_SERVICE}/courses/${courseId}/subjects`);
    const data = await response.json();
    return c.json(data);
  } catch (error) {
    return c.json({ error: 'Error fetching materias' }, 500);
  }
});

app.post('/assign-subject', async (c) => {
  try {
    const body = await c.req.json();
    const parsed = asignarMateriaBffSchema.safeParse(body);
    if (!parsed.success) {
      const msgs = parsed.error.issues.map(i => i.message).join(', ');
      return c.json({ error: msgs }, 400);
    }
    const response = await fetch(`${MS_COURSES_SERVICE}/courses/assign-subject`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(parsed.data),
    });
    const data = await response.json();
    return c.json(data, response.status as any);
  } catch (error) {
    return c.json({ error: 'Error assigning materia' }, 500);
  }
});

app.put('/assign-subject/:id', async (c) => {
  const id = c.req.param('id');
  try {
    const body = await c.req.json();
    const response = await fetch(`${MS_COURSES_SERVICE}/courses/assign-subject/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = await response.json();
    return c.json(data, response.status as any);
  } catch (error) {
    return c.json({ error: 'Error updating assignment' }, 500);
  }
});

app.delete('/assign-subject/:id', async (c) => {
  const id = c.req.param('id');
  try {
    const response = await fetch(`${MS_COURSES_SERVICE}/courses/assign-subject/${id}`, {
      method: 'DELETE',
    });
    const data = await response.json();
    return c.json(data, response.status as any);
  } catch (error) {
    return c.json({ error: 'Error removing assignment' }, 500);
  }
});

export default app;
