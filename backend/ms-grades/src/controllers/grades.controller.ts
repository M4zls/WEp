import { Hono } from 'hono';
import { GradesService } from '../services/grades.service.js';
import { createGradeSchema, updateGradeSchema, createGradesBatchSchema, gradesForCourseSchema } from '../dtos/grade.dto.js';

const service = new GradesService();

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
gradesController.get('/course/:curso', async (c) => {
  try {
    const params = { curso: c.req.param('curso'), professorRut: c.req.query('professorRut') };
    const parsed = gradesForCourseSchema.safeParse(params);
    if (!parsed.success) {
      const msgs = parsed.error.issues.map(i => i.message).join(', ');
      return c.json({ error: msgs }, 400);
    }
    const result = await service.getCourseGrades(parsed.data.curso, parsed.data.professorRut);
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
    const datos = await c.req.json();
    const parsed = createGradesBatchSchema.safeParse(datos);
    if (!parsed.success) {
      const msgs = parsed.error.issues.map(i => i.message).join(', ');
      return c.json({ error: msgs }, 400);
    }
    await service.createGradesBatch(parsed.data.grades);
    return c.json({ message: 'Notas creadas correctamente' }, 201);
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
    const datos = await c.req.json();
    const parsed = createGradeSchema.safeParse(datos);
    if (!parsed.success) {
      const msgs = parsed.error.issues.map(i => i.message).join(', ');
      return c.json({ error: msgs }, 400);
    }
    await service.createGrade(parsed.data);
    return c.json({ message: 'Nota creada correctamente' }, 201);
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
      return c.json({ error: 'ID inválido' }, 400);
    }
    const datos = await c.req.json();
    const parsed = updateGradeSchema.safeParse(datos);
    if (!parsed.success) {
      const msgs = parsed.error.issues.map(i => i.message).join(', ');
      return c.json({ error: msgs }, 400);
    }
    await service.updateGrade(id, parsed.data);
    return c.json({ message: 'Nota actualizada correctamente' });
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
      return c.json({ error: 'ID inválido' }, 400);
    }
    await service.deleteGrade(id);
    return c.json({ message: 'Nota eliminada correctamente' });
  } catch (err: any) {
    return c.json({ error: err.message }, 400);
  }
});
