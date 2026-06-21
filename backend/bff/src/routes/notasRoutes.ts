import { Hono } from 'hono';

const app = new Hono();

const NOTAS_SERVICE = process.env.NOTAS_SERVICE || 'http://localhost:3010';
const ESTUDIANTES_SERVICE = process.env.ESTUDIANTES_SERVICE || 'http://localhost:3001';
const PROFESORES_SERVICE = process.env.PROFESORES_SERVICE || 'http://localhost:3004';
const NOTIFICACIONES_SERVICE = process.env.NOTIFICACIONES_SERVICE || 'http://localhost:3003';

async function fetchStudentInfo(rut: string) {
  const response = await fetch(`${ESTUDIANTES_SERVICE}/estudiantes/${encodeURIComponent(rut)}`);
  if (!response.ok) return null;
  return await response.json();
}

async function fetchProfesorInfo(rut: string) {
  const response = await fetch(`${PROFESORES_SERVICE}/profesores/${encodeURIComponent(rut)}`);
  if (!response.ok) return null;
  return await response.json();
}

function sendGradeNotification(grade: any, estudiante: any, profesor: any) {
  const payload: any = {
    subscriberId: grade.estudianteRut,
    estudianteRut: grade.estudianteRut,
    nombreAlumno: `${estudiante.nombre ?? ''} ${estudiante.apellido ?? ''}`.trim(),
    emailAlumno: estudiante.email ?? '',
    asignatura: grade.asignatura,
    nota: grade.nota,
    tipoEvaluacion: grade.tipoEvaluacion,
    nombreProfesor: profesor ? `${profesor.nombre ?? ''} ${profesor.apellido ?? ''}`.trim() : '',
    curso: grade.curso,
  };

  if (estudiante.apoderado) {
    payload.nombreApoderado = estudiante.apoderado;
  }
  if (estudiante.apoderadoEmail) {
    payload.emailApoderado = estudiante.apoderadoEmail;
  }

  fetch(`${NOTIFICACIONES_SERVICE}/notificaciones/aviso-nota`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  }).catch(() => {});
}

async function handleGradeNotifications(
  grades: any[],
  profesorRut: string,
) {
  const uniqueRuts = [...new Set(grades.map((g: any) => g.estudianteRut))];
  const studentMap = new Map<string, any>();

  const studentResults = await Promise.allSettled(
    uniqueRuts.map((rut) => fetchStudentInfo(rut)),
  );

  uniqueRuts.forEach((rut, i) => {
    if (studentResults[i].status === 'fulfilled' && studentResults[i].value) {
      studentMap.set(rut, studentResults[i].value);
    }
  });

  const profesor = await fetchProfesorInfo(profesorRut);

  for (const grade of grades) {
    const estudiante = studentMap.get(grade.estudianteRut);
    if (estudiante) {
      sendGradeNotification(grade, estudiante, profesor);
    }
  }
}

app.get('/estudiante/:rut', async (c) => {
  const rut = c.req.param('rut');
  try {
    const response = await fetch(`${NOTAS_SERVICE}/notas/estudiante/${rut}`);
    const data = await response.json();
    return c.json(data, response.status as any);
  } catch (error) {
    return c.json({ error: 'Error fetching student grades' }, 500);
  }
});

app.get('/curso/:curso', async (c) => {
  const curso = c.req.param('curso');
  const profesorRut = c.req.query('profesorRut');
  try {
    const url = `${NOTAS_SERVICE}/notas/curso/${curso}${profesorRut ? `?profesorRut=${profesorRut}` : ''}`;
    const response = await fetch(url);
    const data = await response.json();
    return c.json(data, response.status as any);
  } catch (error) {
    return c.json({ error: 'Error fetching course grades' }, 500);
  }
});

app.get('/profesor/:rut', async (c) => {
  const rut = c.req.param('rut');
  try {
    const response = await fetch(`${NOTAS_SERVICE}/notas/profesor/${rut}`);
    const data = await response.json();
    return c.json(data, response.status as any);
  } catch (error) {
    return c.json({ error: 'Error fetching teacher grades' }, 500);
  }
});

app.post('/batch', async (c) => {
  try {
    const body = await c.req.json();
    const response = await fetch(`${NOTAS_SERVICE}/notas/batch`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = await response.json();
    if (response.ok && Array.isArray(body.notas) && body.notas.length > 0) {
      const profesorRut = body.notas[0].profesorRut;
      handleGradeNotifications(body.notas, profesorRut);
    }
    return c.json(data, response.status as any);
  } catch (error) {
    return c.json({ error: 'Error creating grades in batch' }, 500);
  }
});

app.post('/', async (c) => {
  try {
    const body = await c.req.json();
    const response = await fetch(`${NOTAS_SERVICE}/notas`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = await response.json();
    if (response.ok) {
      handleGradeNotifications([body], body.profesorRut);
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
    const response = await fetch(`${NOTAS_SERVICE}/notas/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
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
    const response = await fetch(`${NOTAS_SERVICE}/notas/${id}`, {
      method: 'DELETE',
    });
    const data = await response.json();
    return c.json(data, response.status as any);
  } catch (error) {
    return c.json({ error: 'Error deleting grade' }, 500);
  }
});

export default app;
