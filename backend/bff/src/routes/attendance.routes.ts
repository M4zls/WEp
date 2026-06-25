import { Hono } from 'hono';

const MS_NOTIFICATIONS_SERVICE = process.env.MS_NOTIFICATIONS_SERVICE || 'http://localhost:3003';

const app = new Hono();

const MS_ATTENDANCE_SERVICE = process.env.MS_ATTENDANCE_SERVICE || 'http://localhost:3008';

const esToEn: Record<string, string> = {
  claseId: 'classId',
  cursoAsignaturaId: 'courseSubjectId',
  registros: 'records',
  estudianteRut: 'studentRut',
  estudianteNombre: 'studentName',
  presente: 'present',
  justificacion: 'justification',
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

app.get('/clase/:claseId', async (c) => {
  try {
    const claseId = c.req.param('claseId');
    const response = await fetch(`${MS_ATTENDANCE_SERVICE}/attendance/class/${claseId}`);
    const data = await response.json();
    return c.json(mapKeys(data, enToEs), response.status as any);
  } catch (error) {
    return c.json({ error: 'Error fetching asistencia por clase' }, 500);
  }
});

app.get('/estudiante/:rut', async (c) => {
  try {
    const rut = c.req.param('rut');
    const response = await fetch(`${MS_ATTENDANCE_SERVICE}/attendance/student/${rut}`);
    const data = await response.json();
    return c.json(mapKeys(data, enToEs), response.status as any);
  } catch (error) {
    return c.json({ error: 'Error fetching asistencia por estudiante' }, 500);
  }
});

app.get('/curso-asignatura/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const response = await fetch(`${MS_ATTENDANCE_SERVICE}/attendance/course-subject/${id}`);
    const data = await response.json();
    return c.json(mapKeys(data, enToEs), response.status as any);
  } catch (error) {
    return c.json({ error: 'Error fetching asistencia por curso-asignatura' }, 500);
  }
});

app.post('/marcar', async (c) => {
  try {
    const body = await c.req.json();
    const payload = mapKeys(body, esToEn);
    const response = await fetch(`${MS_ATTENDANCE_SERVICE}/attendance/mark`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await response.json();
    if (!response.ok) return c.json(data, response.status as any);
    const mapped = mapKeys(data, enToEs);
    if (body.registros) {
      for (const r of body.registros) {
        if (r.presente === false) {
          const payload: any = {
            subscriberId: r.estudianteRut || 'unknown',
            studentName: r.estudianteNombre || '',
            studentRut: r.estudianteRut || '',
            course: body.cursoAsignaturaId?.toString() || '',
            date: new Date().toISOString().split('T')[0],
          };
          fetch(`${MS_NOTIFICATIONS_SERVICE}/notifications/aviso-inasistencia`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          }).catch(err => console.error('Error sending attendance notification:', err));
        }
      }
    }
    return c.json(mapped, 201);
  } catch (error) {
    return c.json({ error: 'Error marcando asistencia' }, 500);
  }
});

app.put('/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const body = await c.req.json();
    const payload = mapKeys(body, esToEn);
    const response = await fetch(`${MS_ATTENDANCE_SERVICE}/attendance/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await response.json();
    return c.json(data, response.status as any);
  } catch (error) {
    return c.json({ error: 'Error updating asistencia' }, 500);
  }
});

export default app;
