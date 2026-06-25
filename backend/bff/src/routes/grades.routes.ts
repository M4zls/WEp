import { Hono } from 'hono';
import { GradesService } from '../services/grades.service.js';

const app = new Hono();

const MS_GRADES_SERVICE = process.env.MS_GRADES_SERVICE || 'http://localhost:3010';
const gradesService = new GradesService();

const esToEn: Record<string, string> = {
  estudianteRut: 'studentRut',
  asignatura: 'subject',
  nota: 'grade',
  tipoEvaluacion: 'evaluationType',
  fecha: 'date',
  profesorRut: 'professorRut',
  coeficiente: 'coefficient',
  asignaturas: 'subjects',
  notas: 'grades',
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

app.get('/estudiante/:rut', async (c) => {
  const rut = c.req.param('rut');
  try {
    const response = await fetch(`${MS_GRADES_SERVICE}/grades/student/${rut}`);
    const data = await response.json();
    return c.json(mapKeys(data, enToEs), response.status as any);
  } catch (error) {
    return c.json({ error: 'Error fetching student grades' }, 500);
  }
});

app.get('/curso/:curso', async (c) => {
  const curso = c.req.param('curso');
  const profesorRut = c.req.query('profesorRut');
  try {
    const url = `${MS_GRADES_SERVICE}/grades/course/${encodeURIComponent(curso)}${profesorRut ? `?professorRut=${encodeURIComponent(profesorRut)}` : ''}`;
    const response = await fetch(url);
    const data = await response.json();
    return c.json(mapKeys(data, enToEs), response.status as any);
  } catch (error) {
    return c.json({ error: 'Error fetching course grades' }, 500);
  }
});

app.get('/profesor/:rut', async (c) => {
  const rut = c.req.param('rut');
  try {
    const response = await fetch(`${MS_GRADES_SERVICE}/grades/professor/${rut}`);
    const data = await response.json();
    return c.json(mapKeys(data, enToEs), response.status as any);
  } catch (error) {
    return c.json({ error: 'Error fetching teacher grades' }, 500);
  }
});

app.post('/batch', async (c) => {
  try {
    const body = await c.req.json();
    const grades = Array.isArray(body.notas) ? body.notas.map((n: any) => mapKeys(n, esToEn)) : [];
    const payload = { grades };
    const response = await fetch(`${MS_GRADES_SERVICE}/grades/batch`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await response.json();
    if (response.ok && grades.length > 0) {
      const profesorRut = grades[0].professorRut;
      gradesService.handleGradeNotifications(body.notas, profesorRut).catch(err => console.error(err));
    }
    return c.json(data, response.status as any);
  } catch (error) {
    return c.json({ error: 'Error creating grades in batch' }, 500);
  }
});

app.post('/', async (c) => {
  try {
    const body = await c.req.json();
    const payload = mapKeys(body, esToEn);
    const response = await fetch(`${MS_GRADES_SERVICE}/grades`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await response.json();
    if (response.ok) {
      gradesService.handleGradeNotifications([body], body.profesorRut).catch(err => console.error(err));
    }
    return c.json(data, response.status as any);
  } catch (error) {
    return c.json({ error: 'Error creating grade' }, 500);
  }
});

app.put('/:id', async (c) => {
  const id = c.req.param('id');
  try {
    const body = await c.req.json();
    const payload = mapKeys(body, esToEn);
    const response = await fetch(`${MS_GRADES_SERVICE}/grades/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
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
    const response = await fetch(`${MS_GRADES_SERVICE}/grades/${id}`, {
      method: 'DELETE',
    });
    const data = await response.json();
    return c.json(data, response.status as any);
  } catch (error) {
    return c.json({ error: 'Error deleting grade' }, 500);
  }
});

export default app;
