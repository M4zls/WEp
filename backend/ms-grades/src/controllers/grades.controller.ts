import { Hono } from 'hono';
import { GradesService } from '../services/grades.service.js';
import { createGradeSchema, updateGradeSchema, createGradesBatchSchema, gradesForCourseSchema } from '../dtos/grade.dto.js';

const service = new GradesService();
const MS_STUDENTS = process.env.MS_STUDENTS_SERVICE || 'http://ms-students:3001';
const MS_TEACHERS = process.env.MS_TEACHERS_SERVICE || 'http://ms-teachers:3004';
const MS_NOTIFICATIONS = process.env.MS_NOTIFICATIONS_SERVICE || 'http://ms-notifications:3003';

/**
 * Controller HTTP para la gestión de calificaciones.
 * Expone endpoints REST para consultar y modificar notas.
 */
export const gradesController = new Hono();

/**
 * Obtiene las calificaciones de un estudiante por su RUT.
 * @route GET /grades/student/:rut
 */
gradesController.get('/student/:rut', async (c) => {
  try {
    const rut = c.req.param('rut');
    const result = await service.getStudentGrades(rut);
    return c.json(result);
  } catch (err: any) {
    return c.json({ error: err.message }, 404);
  }
});

/**
 * Obtiene las notas de un curso filtradas por profesor.
 * @route GET /grades/course/:curso
 */
gradesController.get('/course/:course', async (c) => {
  try {
    const params = { course: c.req.param('course'), professorRut: c.req.query('professorRut') };
    const parsed = gradesForCourseSchema.safeParse(params);
    if (!parsed.success) {
      const msgs = parsed.error.issues.map(i => i.message).join(', ');
      return c.json({ error: msgs }, 400);
    }
    const result = await service.getCourseGrades(parsed.data.course, parsed.data.professorRut);
    return c.json(result);
  } catch (err: any) {
    return c.json({ error: err.message }, 400);
  }
});

/**
 * Obtiene todas las notas registradas por un profesor.
 * @route GET /grades/professor/:rut
 */
gradesController.get('/professor/:rut', async (c) => {
  try {
    const rut = c.req.param('rut');
    const result = await service.getTeacherGrades(rut);
    return c.json(result);
  } catch (err: any) {
    return c.json({ error: err.message }, 400);
  }
});

/**
 * Crea múltiples calificaciones en batch.
 * @route POST /grades/batch
 */
gradesController.post('/batch', async (c) => {
  try {
    const raw = await c.req.json();
    const parsed = createGradesBatchSchema.safeParse(raw);
    if (!parsed.success) {
      const msgs = parsed.error.issues.map(i => i.message).join(', ');
      return c.json({ error: msgs }, 400);
    }
    await service.createGradesBatch(parsed.data.grades);
    sendGradeNotifications(parsed.data.grades).catch(err => console.error(err));
    return c.json({ message: 'Grades created successfully' }, 201);
  } catch (err: any) {
    return c.json({ error: err.message }, 400);
  }
});

/**
 * Crea una nueva calificación.
 * @route POST /grades
 */
gradesController.post('/', async (c) => {
  try {
    const data = await c.req.json();
    const parsed = createGradeSchema.safeParse(data);
    if (!parsed.success) {
      const msgs = parsed.error.issues.map(i => i.message).join(', ');
      return c.json({ error: msgs }, 400);
    }
    await service.createGrade(parsed.data);
    sendGradeNotifications([parsed.data]).catch(err => console.error(err));
    return c.json({ message: 'Grade created successfully' }, 201);
  } catch (err: any) {
    return c.json({ error: err.message }, 400);
  }
});

/**
 * Actualiza una calificación existente.
 * @route PUT /grades/:id
 */
gradesController.put('/:id', async (c) => {
  try {
    const id = parseInt(c.req.param('id'), 10);
    if (isNaN(id)) {
      return c.json({ error: 'Invalid ID' }, 400);
    }
    const raw = await c.req.json();
    const parsed = updateGradeSchema.safeParse(raw);
    if (!parsed.success) {
      const msgs = parsed.error.issues.map(i => i.message).join(', ');
      return c.json({ error: msgs }, 400);
    }
    await service.updateGrade(id, parsed.data);
    return c.json({ message: 'Grade updated successfully' });
  } catch (err: any) {
    return c.json({ error: err.message }, 400);
  }
});

/**
 * Elimina una calificación.
 * @route DELETE /grades/:id
 */
gradesController.delete('/:id', async (c) => {
  try {
    const id = parseInt(c.req.param('id'), 10);
    if (isNaN(id)) {
      return c.json({ error: 'Invalid ID' }, 400);
    }
    await service.deleteGrade(id);
    return c.json({ message: 'Grade deleted successfully' });
  } catch (err: any) {
    return c.json({ error: err.message }, 400);
  }
});

async function sendGradeNotifications(grades: any[]) {
  const uniqueRuts = [...new Set(grades.map((g: any) => g.studentRut))];
  const studentMap = new Map<string, any>();

  const studentResults = await Promise.allSettled(
    uniqueRuts.map((rut) =>
      fetch(`${MS_STUDENTS}/students/${encodeURIComponent(rut)}`).then(r => r.ok ? r.json() : null)
    ),
  );
  uniqueRuts.forEach((rut, i) => {
    if (studentResults[i].status === 'fulfilled' && studentResults[i].value) {
      studentMap.set(rut, studentResults[i].value);
    }
  });

  let profesor: any = null;
  const firstRut = grades[0]?.professorRut;
  if (firstRut) {
    try {
      const res = await fetch(`${MS_TEACHERS}/teachers/${encodeURIComponent(firstRut)}`);
      if (res.ok) profesor = await res.json();
    } catch { /* ignore */ }
  }

  for (const grade of grades) {
    const estudiante = studentMap.get(grade.studentRut);
    if (!estudiante) continue;

    const payload: any = {
      subscriberId: grade.studentRut,
      studentRut: grade.studentRut,
      studentName: `${estudiante.firstName ?? ''} ${estudiante.lastName ?? ''}`.trim(),
      studentEmail: estudiante.email ?? '',
      subject: grade.subject,
      grade: grade.grade,
      evaluationType: grade.evaluationType,
      professorName: profesor ? `${profesor.firstName ?? ''} ${profesor.lastName ?? ''}`.trim() : '',
      course: grade.course,
    };
    if (estudiante.guardian) payload.guardianName = estudiante.guardian;
    if (estudiante.guardianEmail) payload.guardianEmail = estudiante.guardianEmail;

    fetch(`${MS_NOTIFICATIONS}/notifications/grade-notice`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }).catch((err: any) => console.error('[grades] notification failed:', err.message));
  }
}
