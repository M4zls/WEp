import { Hono } from 'hono';

const app = new Hono();

const MS_ATTENDANCE_SERVICE = process.env.MS_ATTENDANCE_SERVICE || 'http://localhost:3008';

app.get('/clase/:claseId', async (c) => {
  try {
    const claseId = c.req.param('claseId');
    const response = await fetch(`${MS_ATTENDANCE_SERVICE}/asistencia/clase/${claseId}`);
    const data = await response.json();
    return c.json(data, response.status as any);
  } catch (error) {
    return c.json({ error: 'Error fetching asistencia por clase' }, 500);
  }
});

app.get('/estudiante/:rut', async (c) => {
  try {
    const rut = c.req.param('rut');
    const response = await fetch(`${MS_ATTENDANCE_SERVICE}/asistencia/estudiante/${rut}`);
    const data = await response.json();
    return c.json(data, response.status as any);
  } catch (error) {
    return c.json({ error: 'Error fetching asistencia por estudiante' }, 500);
  }
});

app.get('/curso-asignatura/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const response = await fetch(`${MS_ATTENDANCE_SERVICE}/asistencia/curso-asignatura/${id}`);
    const data = await response.json();
    return c.json(data, response.status as any);
  } catch (error) {
    return c.json({ error: 'Error fetching asistencia por curso-asignatura' }, 500);
  }
});

app.post('/marcar', async (c) => {
  try {
    const body = await c.req.json();
    const response = await fetch(`${MS_ATTENDANCE_SERVICE}/asistencia/marcar`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = await response.json();
    return c.json(data, response.status as any);
  } catch (error) {
    return c.json({ error: 'Error marcando asistencia' }, 500);
  }
});

app.put('/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const body = await c.req.json();
    const response = await fetch(`${MS_ATTENDANCE_SERVICE}/asistencia/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = await response.json();
    return c.json(data, response.status as any);
  } catch (error) {
    return c.json({ error: 'Error updating asistencia' }, 500);
  }
});

export default app;
