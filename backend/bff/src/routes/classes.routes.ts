import { Hono } from 'hono';

const app = new Hono();

const MS_CLASSES_SERVICE = process.env.MS_CLASSES_SERVICE || 'http://localhost:3006';

const esToEn: Record<string, string> = {
  cursoAsignaturaId: 'courseSubjectId',
  titulo: 'title',
  descripcion: 'description',
  fecha: 'date',
  horaInicio: 'startTime',
  horaTermino: 'endTime',
  estado: 'status',
};

const enToEs: Record<string, string> = {};
for (const [es, en] of Object.entries(esToEn)) {
  enToEs[en] = es;
}

const esStatusToEn: Record<string, string> = {
  pendiente: 'pending',
  realizada: 'completed',
  cancelada: 'cancelled',
};

const enStatusToEs: Record<string, string> = {};
for (const [es, en] of Object.entries(esStatusToEn)) {
  enStatusToEs[en] = es;
}

function transform(obj: any, keyMapping: Record<string, string>, statusMapping: Record<string, string>): any {
  if (Array.isArray(obj)) return obj.map(i => transform(i, keyMapping, statusMapping));
  if (obj && typeof obj === 'object') {
    const mapped: any = {};
    for (const [key, value] of Object.entries(obj)) {
      const newKey = keyMapping[key] ?? key;
      let newValue = value;
      if (newKey === 'status' || newKey === 'estado') {
        newValue = statusMapping[value as string] ?? value;
      } else if (typeof value === 'object') {
        newValue = transform(value, keyMapping, statusMapping);
      }
      mapped[newKey] = newValue;
    }
    return mapped;
  }
  return obj;
}

app.get('/', async (c) => {
  try {
    const courseSubjectId = c.req.query('course_subject_id') || c.req.query('curso_asignatura_id');
    let url = `${MS_CLASSES_SERVICE}/classes`;
    if (courseSubjectId) url += `?course_subject_id=${courseSubjectId}`;
    const response = await fetch(url);
    const data = await response.json();
    const mapped = transform(data, enToEs, enStatusToEs);
    return c.json(mapped);
  } catch (error) {
    return c.json({ error: 'Error fetching clases' }, 500);
  }
});

app.get('/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const response = await fetch(`${MS_CLASSES_SERVICE}/classes/${id}`);
    const data = await response.json();
    const mapped = transform(data, enToEs, enStatusToEs);
    return c.json(mapped, response.status as any);
  } catch (error) {
    return c.json({ error: 'Error fetching clase' }, 500);
  }
});

app.post('/', async (c) => {
  try {
    const body = await c.req.json();
    const payload = transform(body, esToEn, esStatusToEn);
    const response = await fetch(`${MS_CLASSES_SERVICE}/classes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await response.json();
    if (!response.ok) return c.json(data, response.status as any);
    const mapped = transform(data, enToEs, enStatusToEs);
    return c.json(mapped, 201);
  } catch (error) {
    return c.json({ error: 'Error creating clase' }, 500);
  }
});

app.put('/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const body = await c.req.json();
    const payload = transform(body, esToEn, esStatusToEn);
    const response = await fetch(`${MS_CLASSES_SERVICE}/classes/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
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
    const response = await fetch(`${MS_CLASSES_SERVICE}/classes/${id}`, {
      method: 'DELETE',
    });
    const data = await response.json();
    return c.json(data, response.status as any);
  } catch (error) {
    return c.json({ error: 'Error deleting clase' }, 500);
  }
});

export default app;
