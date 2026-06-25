import { Hono } from 'hono';
import { EstudiantesService } from '../services/EstudiantesService.js';
import { loginEstudianteSchema, crearEstudianteSchema, actualizarEstudianteSchema } from '../dtos/EstudianteDto.js';

const service = new EstudiantesService();

/**
 * Controller HTTP para la gestión de estudiantes.
 */
export const estudianteController = new Hono();

/**
 * Autentica a un estudiante con email y contraseña.
 * @route POST /estudiantes/login
 * @param {import('hono').Context} c - Contexto HTTP de Hono.
 * @returns {Promise<Response>} Datos del estudiante autenticado.
 */
estudianteController.post('/login', async (c) => {
  try {
    const datos = await c.req.json();
    const parsed = loginEstudianteSchema.safeParse(datos);
    if (!parsed.success) {
      const msgs = parsed.error.issues.map(i => i.message).join(', ');
      return c.json({ error: msgs }, { status: 400 });
    }

    const { email, password } = parsed.data;
    const estudiante = await service.authenticateStudent(email, password);
    return c.json(estudiante, { status: 200 });
  } catch (error) {
    const mensaje = error instanceof Error ? error.message : 'Error al iniciar sesión';
    return c.json({ error: mensaje }, { status: 401 });
  }
});

/**
 * Obtiene todos los estudiantes.
 * @route GET /estudiantes
 * @param {import('hono').Context} c - Contexto HTTP de Hono.
 * @returns {Promise<Response>} Lista de estudiantes.
 */
estudianteController.get('/', async (c) => {
  try {
    const estudiantes = await service.getAllStudents();
    return c.json(estudiantes);
  } catch (error) {
    const mensaje = error instanceof Error ? error.message : 'Error al obtener estudiantes';
    return c.json({ error: mensaje }, { status: 500 });
  }
});

/**
 * Obtiene un estudiante por su RUT.
 * @route GET /estudiantes/:rut
 * @param {import('hono').Context} c - Contexto HTTP de Hono.
 * @returns {Promise<Response>} Estudiante encontrado.
 */
estudianteController.get('/:rut', async (c) => {
  try {
    const rut = c.req.param('rut');
    const estudiante = await service.getStudentByRut(rut);
    return c.json(estudiante);
  } catch (error) {
    const mensaje = error instanceof Error ? error.message : 'Error al obtener estudiante';
    return c.json({ error: mensaje }, { status: 404 });
  }
});

/**
 * Crea un nuevo estudiante.
 * @route POST /estudiantes
 * @param {import('hono').Context} c - Contexto HTTP de Hono.
 * @returns {Promise<Response>} Confirmación de creación.
 */
estudianteController.post('/', async (c) => {
  try {
    const datos = await c.req.json();
    const parsed = crearEstudianteSchema.safeParse(datos);
    if (!parsed.success) {
      const msgs = parsed.error.issues.map(i => i.message).join(', ');
      return c.json({ error: msgs }, { status: 400 });
    }

    await service.createStudent(parsed.data);
    return c.json({ message: 'Estudiante creado correctamente', datos: parsed.data }, { status: 201 });
  } catch (error) {
    const mensaje = error instanceof Error ? error.message : 'Error al crear estudiante';
    return c.json({ error: mensaje }, { status: 400 });
  }
});

/**
 * Actualiza un estudiante por su RUT.
 * @route PUT /estudiantes/:rut
 * @param {import('hono').Context} c - Contexto HTTP de Hono.
 * @returns {Promise<Response>} Confirmación de actualización.
 */
estudianteController.put('/:rut', async (c) => {
  try {
    const rut = c.req.param('rut');
    const datos = await c.req.json();
    const parsed = actualizarEstudianteSchema.safeParse(datos);
    if (!parsed.success) {
      const msgs = parsed.error.issues.map(i => i.message).join(', ');
      return c.json({ error: msgs }, { status: 400 });
    }

    await service.updateStudent(rut, parsed.data);
    return c.json({ message: 'Estudiante actualizado correctamente', datos: parsed.data });
  } catch (error) {
    const mensaje = error instanceof Error ? error.message : 'Error al actualizar estudiante';
    return c.json({ error: mensaje }, { status: 400 });
  }
});

/**
 * Elimina un estudiante por su RUT.
 * @route DELETE /estudiantes/:rut
 * @param {import('hono').Context} c - Contexto HTTP de Hono.
 * @returns {Promise<Response>} Confirmación de eliminación.
 */
estudianteController.delete('/:rut', async (c) => {
  try {
    const rut = c.req.param('rut');
    await service.deleteStudent(rut);
    return c.json({ message: 'Estudiante eliminado correctamente' });
  } catch (error) {
    const mensaje = error instanceof Error ? error.message : 'Error al eliminar estudiante';
    return c.json({ error: mensaje }, { status: 400 });
  }
});

/**
 * Obtiene los estudiantes filtrados por curso.
 * @route GET /estudiantes/curso/:curso
 * @param {import('hono').Context} c - Contexto HTTP de Hono.
 * @returns {Promise<Response>} Lista de estudiantes del curso.
 */
estudianteController.get('/curso/:curso', async (c) => {
  try {
    const curso = c.req.param('curso');
    const estudiantes = await service.getStudentsByCourse(curso);
    return c.json(estudiantes);
  } catch (error) {
    const mensaje = error instanceof Error ? error.message : 'Error al obtener estudiantes por curso';
    return c.json({ error: mensaje }, { status: 400 });
  }
});
