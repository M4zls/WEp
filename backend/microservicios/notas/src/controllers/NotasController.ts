import { Hono } from 'hono';
import { NotasService } from '../services/NotasService.js';
import { crearNotaSchema, actualizarNotaSchema, crearNotasBatchSchema } from '../dtos/NotaDto.js';

const service = new NotasService();

/**
 * Controller HTTP para la gestión de calificaciones.
 * Expone endpoints REST para consultar y modificar notas.
 */
export const notasController = new Hono();

/**
 * Obtiene las calificaciones de un estudiante por su RUT.
 * @route GET /notas/estudiante/:rut
 */
notasController.get('/estudiante/:rut', async (c) => {
  try {
    const rut = c.req.param('rut');
    const result = await service.getStudentGrades(rut);
    return c.json(result);
  } catch (error) {
    const mensaje = error instanceof Error ? error.message : 'Error al obtener calificaciones';
    return c.json({ error: mensaje }, { status: 404 });
  }
});

/**
 * Obtiene las notas de un curso filtradas por profesor.
 * @route GET /notas/curso/:curso
 */
notasController.get('/curso/:curso', async (c) => {
  try {
    const curso = c.req.param('curso');
    const profesorRut = c.req.query('profesorRut');
    if (!profesorRut) {
      return c.json({ error: 'El RUT del profesor es requerido' }, { status: 400 });
    }
    const result = await service.getCourseGrades(curso, profesorRut);
    return c.json(result);
  } catch (error) {
    const mensaje = error instanceof Error ? error.message : 'Error al obtener notas del curso';
    return c.json({ error: mensaje }, { status: 400 });
  }
});

/**
 * Obtiene todas las notas registradas por un profesor.
 * @route GET /notas/profesor/:rut
 */
notasController.get('/profesor/:rut', async (c) => {
  try {
    const rut = c.req.param('rut');
    const result = await service.getTeacherGrades(rut);
    return c.json(result);
  } catch (error) {
    const mensaje = error instanceof Error ? error.message : 'Error al obtener notas del profesor';
    return c.json({ error: mensaje }, { status: 400 });
  }
});

/**
 * Crea múltiples calificaciones en batch.
 * @route POST /notas/batch
 */
notasController.post('/batch', async (c) => {
  try {
    const datos = await c.req.json();
    const parsed = crearNotasBatchSchema.safeParse(datos);
    if (!parsed.success) {
      const msgs = parsed.error.issues.map(i => i.message).join(', ');
      return c.json({ error: msgs }, { status: 400 });
    }
    await service.createGradesBatch(parsed.data.notas);
    return c.json({ message: 'Notas creadas correctamente' }, { status: 201 });
  } catch (error) {
    const mensaje = error instanceof Error ? error.message : 'Error al crear notas en batch';
    return c.json({ error: mensaje }, { status: 400 });
  }
});

/**
 * Crea una nueva calificación.
 * @route POST /notas
 */
notasController.post('/', async (c) => {
  try {
    const datos = await c.req.json();
    const parsed = crearNotaSchema.safeParse(datos);
    if (!parsed.success) {
      const msgs = parsed.error.issues.map(i => i.message).join(', ');
      return c.json({ error: msgs }, { status: 400 });
    }
    await service.createGrade(parsed.data);
    return c.json({ message: 'Nota creada correctamente' }, { status: 201 });
  } catch (error) {
    const mensaje = error instanceof Error ? error.message : 'Error al crear nota';
    return c.json({ error: mensaje }, { status: 400 });
  }
});

/**
 * Actualiza una calificación existente.
 * @route PUT /notas/:id
 */
notasController.put('/:id', async (c) => {
  try {
    const id = parseInt(c.req.param('id'), 10);
    if (isNaN(id)) {
      return c.json({ error: 'ID inválido' }, { status: 400 });
    }
    const datos = await c.req.json();
    const parsed = actualizarNotaSchema.safeParse(datos);
    if (!parsed.success) {
      const msgs = parsed.error.issues.map(i => i.message).join(', ');
      return c.json({ error: msgs }, { status: 400 });
    }
    await service.updateGrade(id, parsed.data);
    return c.json({ message: 'Nota actualizada correctamente' });
  } catch (error) {
    const mensaje = error instanceof Error ? error.message : 'Error al actualizar nota';
    return c.json({ error: mensaje }, { status: 400 });
  }
});

/**
 * Elimina una calificación.
 * @route DELETE /notas/:id
 */
notasController.delete('/:id', async (c) => {
  try {
    const id = parseInt(c.req.param('id'), 10);
    if (isNaN(id)) {
      return c.json({ error: 'ID inválido' }, { status: 400 });
    }
    await service.deleteGrade(id);
    return c.json({ message: 'Nota eliminada correctamente' });
  } catch (error) {
    const mensaje = error instanceof Error ? error.message : 'Error al eliminar nota';
    return c.json({ error: mensaje }, { status: 400 });
  }
});
