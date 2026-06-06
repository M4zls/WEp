import { Hono } from 'hono';
import { CursosService } from '../services/CursosService.js';
import { crearCursoSchema, crearAsignaturaSchema, asignarMateriaSchema } from '../dtos/CursoDto.js';

const service = new CursosService();

/**
 * Controller HTTP para la gestión de cursos, asignaturas y asignaciones.
 */
export const cursosController = new Hono();

/**
 * Lista todas las asignaturas registradas.
 * @route GET /cursos/asignaturas
 * @param {import('hono').Context} c - Contexto HTTP de Hono.
 * @returns {Promise<Response>} Lista de asignaturas.
 */
cursosController.get('/asignaturas', async (c) => {
  try {
    const asignaturas = await service.listarAsignaturas();
    return c.json(asignaturas);
  } catch (err: any) {
    return c.json({ error: err.message }, 500);
  }
});

/**
 * Crea una nueva asignatura.
 * @route POST /cursos/asignaturas
 * @param {import('hono').Context} c - Contexto HTTP de Hono.
 * @returns {Promise<Response>} Asignatura creada.
 */
cursosController.post('/asignaturas', async (c) => {
  try {
    const data = await c.req.json();
    const parsed = crearAsignaturaSchema.safeParse(data);
    if (!parsed.success) {
      const msgs = parsed.error.issues.map(i => i.message).join(', ');
      return c.json({ error: msgs }, 400);
    }
    const asignatura = await service.crearAsignatura(parsed.data);
    return c.json(asignatura, 201);
  } catch (err: any) {
    return c.json({ error: err.message }, 400);
  }
});

/**
 * Actualiza una asignatura existente.
 * @route PUT /cursos/asignaturas/:id
 * @param {import('hono').Context} c - Contexto HTTP de Hono.
 * @returns {Promise<Response>} Confirmación de actualización.
 */
cursosController.put('/asignaturas/:id', async (c) => {
  try {
    const id = parseInt(c.req.param('id'));
    const data = await c.req.json();
    const parsed = crearAsignaturaSchema.partial().safeParse(data);
    if (!parsed.success) {
      const msgs = parsed.error.issues.map(i => i.message).join(', ');
      return c.json({ error: msgs }, 400);
    }
    await service.actualizarAsignatura(id, parsed.data);
    return c.json({ message: 'Asignatura actualizada correctamente' });
  } catch (err: any) {
    return c.json({ error: err.message }, 400);
  }
});

/**
 * Elimina una asignatura por su identificador.
 * @route DELETE /cursos/asignaturas/:id
 * @param {import('hono').Context} c - Contexto HTTP de Hono.
 * @returns {Promise<Response>} Confirmación de eliminación.
 */
cursosController.delete('/asignaturas/:id', async (c) => {
  try {
    const id = parseInt(c.req.param('id'));
    await service.eliminarAsignatura(id);
    return c.json({ message: 'Asignatura eliminada correctamente' });
  } catch (err: any) {
    return c.json({ error: err.message }, 400);
  }
});

/**
 * Asigna una materia a un curso.
 * @route POST /cursos/asignar-materia
 * @param {import('hono').Context} c - Contexto HTTP de Hono.
 * @returns {Promise<Response>} Resultado de la asignación.
 */
cursosController.post('/asignar-materia', async (c) => {
  try {
    const data = await c.req.json();
    const parsed = asignarMateriaSchema.safeParse(data);
    if (!parsed.success) {
      const msgs = parsed.error.issues.map(i => i.message).join(', ');
      return c.json({ error: msgs }, 400);
    }
    const result = await service.asignarMateriaACurso(parsed.data);
    return c.json(result, 201);
  } catch (err: any) {
    return c.json({ error: err.message }, 400);
  }
});

/**
 * Actualiza una asignación entre curso y materia.
 * @route PUT /cursos/asignar-materia/:id
 * @param {import('hono').Context} c - Contexto HTTP de Hono.
 * @returns {Promise<Response>} Confirmación de actualización.
 */
cursosController.put('/asignar-materia/:id', async (c) => {
  try {
    const id = parseInt(c.req.param('id'));
    const data = await c.req.json();
    const parsed = asignarMateriaSchema.partial().safeParse(data);
    if (!parsed.success) {
      const msgs = parsed.error.issues.map(i => i.message).join(', ');
      return c.json({ error: msgs }, 400);
    }
    await service.actualizarAsignacion(id, parsed.data);
    return c.json({ message: 'Asignación actualizada correctamente' });
  } catch (err: any) {
    return c.json({ error: err.message }, 400);
  }
});

/**
 * Elimina una asignación entre curso y materia.
 * @route DELETE /cursos/asignar-materia/:id
 * @param {import('hono').Context} c - Contexto HTTP de Hono.
 * @returns {Promise<Response>} Confirmación de eliminación.
 */
cursosController.delete('/asignar-materia/:id', async (c) => {
  try {
    const id = parseInt(c.req.param('id'));
    await service.eliminarAsignacion(id);
    return c.json({ message: 'Asignación eliminada correctamente' });
  } catch (err: any) {
    return c.json({ error: err.message }, 400);
  }
});

/**
 * Lista todos los cursos.
 * @route GET /cursos
 * @param {import('hono').Context} c - Contexto HTTP de Hono.
 * @returns {Promise<Response>} Lista de cursos.
 */
cursosController.get('/', async (c) => {
  try {
    const cursos = await service.listarCursos();
    return c.json(cursos);
  } catch (err: any) {
    return c.json({ error: err.message }, 500);
  }
});

/**
 * Obtiene un curso por su identificador.
 * @route GET /cursos/:id
 * @param {import('hono').Context} c - Contexto HTTP de Hono.
 * @returns {Promise<Response>} Curso encontrado con sus materias.
 */
cursosController.get('/:id', async (c) => {
  try {
    const id = parseInt(c.req.param('id'));
    const curso = await service.obtenerCurso(id);
    return c.json(curso);
  } catch (err: any) {
    return c.json({ error: err.message }, 404);
  }
});

/**
 * Crea un nuevo curso.
 * @route POST /cursos
 * @param {import('hono').Context} c - Contexto HTTP de Hono.
 * @returns {Promise<Response>} Curso creado.
 */
cursosController.post('/', async (c) => {
  try {
    const data = await c.req.json();
    const parsed = crearCursoSchema.safeParse(data);
    if (!parsed.success) {
      const msgs = parsed.error.issues.map(i => i.message).join(', ');
      return c.json({ error: msgs }, 400);
    }
    const curso = await service.crearCurso(parsed.data);
    return c.json(curso, 201);
  } catch (err: any) {
    return c.json({ error: err.message }, 400);
  }
});

/**
 * Actualiza un curso por su identificador.
 * @route PUT /cursos/:id
 * @param {import('hono').Context} c - Contexto HTTP de Hono.
 * @returns {Promise<Response>} Confirmación de actualización.
 */
cursosController.put('/:id', async (c) => {
  try {
    const id = parseInt(c.req.param('id'));
    const data = await c.req.json();
    const parsed = crearCursoSchema.partial().safeParse(data);
    if (!parsed.success) {
      const msgs = parsed.error.issues.map(i => i.message).join(', ');
      return c.json({ error: msgs }, 400);
    }
    await service.actualizarCurso(id, parsed.data);
    return c.json({ message: 'Curso actualizado correctamente' });
  } catch (err: any) {
    return c.json({ error: err.message }, 400);
  }
});

/**
 * Elimina un curso por su identificador.
 * @route DELETE /cursos/:id
 * @param {import('hono').Context} c - Contexto HTTP de Hono.
 * @returns {Promise<Response>} Confirmación de eliminación.
 */
cursosController.delete('/:id', async (c) => {
  try {
    const id = parseInt(c.req.param('id'));
    await service.eliminarCurso(id);
    return c.json({ message: 'Curso eliminado correctamente' });
  } catch (err: any) {
    return c.json({ error: err.message }, 400);
  }
});

/**
 * Obtiene las materias asociadas a un curso.
 * @route GET /cursos/:cursoId/materias
 * @param {import('hono').Context} c - Contexto HTTP de Hono.
 * @returns {Promise<Response>} Lista de materias del curso.
 */
cursosController.get('/:cursoId/materias', async (c) => {
  try {
    const cursoId = parseInt(c.req.param('cursoId'));
    const materias = await service.obtenerMateriasDelCurso(cursoId);
    return c.json(materias);
  } catch (err: any) {
    return c.json({ error: err.message }, 400);
  }
});
