import { Hono } from 'hono';

const app = new Hono();

const MS_SCHEDULE_SERVICE = process.env.MS_SCHEDULE_SERVICE || 'http://localhost:3007';

const esToEn: Record<string, string> = {
  cursoAsignaturaId: 'courseSubjectId',
  diaSemana: 'weekDay',
  horaInicio: 'startTime',
  horaTermino: 'endTime',
};

const enToEs: Record<string, string> = {};
for (const [es, en] of Object.entries(esToEn)) {
  enToEs[en] = es;
}

function mapKeys(obj: any, mapping: Record<string, string>): any {
  if (Array.isArray(obj)) return obj.map(i => mapKeys(i, mapping));
  if (obj && typeof obj === 'object') {
    const mapped: any = {};
    for (const [key, value] of Object.entries(obj)) {
      const newKey = mapping[key] ?? key;
      mapped[newKey] = mapKeys(value, mapping);
    }
    return mapped;
  }
  return obj;
}

app.get('/', async (c) => {
  try {
    const cursoAsignaturaId = c.req.query('curso_asignatura_id');
    let url = `${MS_SCHEDULE_SERVICE}/schedules`;
    if (cursoAsignaturaId) url += `?curso_asignatura_id=${cursoAsignaturaId}`;
    const response = await fetch(url);
    const data = await response.json();
    return c.json(mapKeys(data, enToEs));
  } catch (error) {
    return c.json({ error: 'Error fetching horarios' }, 500);
  }
});

app.get('/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const response = await fetch(`${MS_SCHEDULE_SERVICE}/schedules/${id}`);
    const data = await response.json();
    return c.json(mapKeys(data, enToEs), response.status as any);
  } catch (error) {
    return c.json({ error: 'Error fetching horario' }, 500);
  }
});

app.post('/', async (c) => {
  try {
    const body = await c.req.json();
    const payload = mapKeys(body, esToEn);
    const response = await fetch(`${MS_SCHEDULE_SERVICE}/schedules`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await response.json();
    return c.json(data, response.status as any);
  } catch (error) {
    return c.json({ error: 'Error creating horario' }, 500);
  }
});

app.put('/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const body = await c.req.json();
    const payload = mapKeys(body, esToEn);
    const response = await fetch(`${MS_SCHEDULE_SERVICE}/schedules/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await response.json();
    return c.json(data, response.status as any);
  } catch (error) {
    return c.json({ error: 'Error updating horario' }, 500);
  }
});

app.delete('/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const response = await fetch(`${MS_SCHEDULE_SERVICE}/schedules/${id}`, {
      method: 'DELETE',
    });
    const data = await response.json();
    return c.json(data, response.status as any);
  } catch (error) {
    return c.json({ error: 'Error deleting horario' }, 500);
  }
});

export default app;
