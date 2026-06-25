import { Hono } from 'hono';
import { crearCursoBffSchema, crearAsignaturaBffSchema, asignarMateriaBffSchema } from '../dtos/BffDto.js';

const app = new Hono();

const MS_COURSES_SERVICE = process.env.MS_COURSES_SERVICE || 'http://localhost:3005';

app.get('/', async (c) => {
  try {
    const response = await fetch(`${MS_COURSES_SERVICE}/cursos`);
    const data = await response.json();
    return c.json(data);
  } catch (error) {
    return c.json({ error: 'Error fetching cursos' }, 500);
  }
});

app.get('/:id', async (c) => {
  const id = c.req.param('id');
  try {
    const response = await fetch(`${MS_COURSES_SERVICE}/cursos/${id}`);
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
    const response = await fetch(`${MS_COURSES_SERVICE}/cursos`, {
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
    const response = await fetch(`${MS_COURSES_SERVICE}/cursos/${id}`, {
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
    const response = await fetch(`${MS_COURSES_SERVICE}/cursos/${id}`, {
      method: 'DELETE',
    });
    const data = await response.json();
    return c.json(data, response.status as any);
  } catch (error) {
    return c.json({ error: 'Error deleting curso' }, 500);
  }
});

app.get('/asignaturas', async (c) => {
  try {
    const response = await fetch(`${MS_COURSES_SERVICE}/cursos/asignaturas`);
    const data = await response.json();
    return c.json(data);
  } catch (error) {
    return c.json({ error: 'Error fetching asignaturas' }, 500);
  }
});

app.post('/asignaturas', async (c) => {
  try {
    const body = await c.req.json();
    const parsed = crearAsignaturaBffSchema.safeParse(body);
    if (!parsed.success) {
      const msgs = parsed.error.issues.map(i => i.message).join(', ');
      return c.json({ error: msgs }, 400);
    }
    const response = await fetch(`${MS_COURSES_SERVICE}/cursos/asignaturas`, {
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

app.put('/asignaturas/:id', async (c) => {
  const id = c.req.param('id');
  try {
    const body = await c.req.json();
    const response = await fetch(`${MS_COURSES_SERVICE}/cursos/asignaturas/${id}`, {
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

app.delete('/asignaturas/:id', async (c) => {
  const id = c.req.param('id');
  try {
    const response = await fetch(`${MS_COURSES_SERVICE}/cursos/asignaturas/${id}`, {
      method: 'DELETE',
    });
    const data = await response.json();
    return c.json(data, response.status as any);
  } catch (error) {
    return c.json({ error: 'Error deleting asignatura' }, 500);
  }
});

app.get('/:cursoId/materias', async (c) => {
  const cursoId = c.req.param('cursoId');
  try {
    const response = await fetch(`${MS_COURSES_SERVICE}/cursos/${cursoId}/materias`);
    const data = await response.json();
    return c.json(data);
  } catch (error) {
    return c.json({ error: 'Error fetching materias' }, 500);
  }
});

app.post('/asignar-materia', async (c) => {
  try {
    const body = await c.req.json();
    const parsed = asignarMateriaBffSchema.safeParse(body);
    if (!parsed.success) {
      const msgs = parsed.error.issues.map(i => i.message).join(', ');
      return c.json({ error: msgs }, 400);
    }
    const response = await fetch(`${MS_COURSES_SERVICE}/cursos/asignar-materia`, {
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

app.put('/asignar-materia/:id', async (c) => {
  const id = c.req.param('id');
  try {
    const body = await c.req.json();
    const response = await fetch(`${MS_COURSES_SERVICE}/cursos/asignar-materia/${id}`, {
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

app.delete('/asignar-materia/:id', async (c) => {
  const id = c.req.param('id');
  try {
    const response = await fetch(`${MS_COURSES_SERVICE}/cursos/asignar-materia/${id}`, {
      method: 'DELETE',
    });
    const data = await response.json();
    return c.json(data, response.status as any);
  } catch (error) {
    return c.json({ error: 'Error removing assignment' }, 500);
  }
});

export default app;
