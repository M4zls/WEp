import { Hono } from 'hono';
import { ProfesoresService } from '../services/ProfesoresService.js';
import { crearProfesorSchema, actualizarProfesorSchema } from '../dtos/ProfesorDto.js';

const service = new ProfesoresService(); 

/**
 * Controller HTTP para la gestión de profesores.
 */
export const profesoresController = new Hono();

/**
 * Autentica a un profesor con email y contraseña.
 * @route POST /profesores/login
 * @param {import('hono').Context} c - Contexto HTTP de Hono.
 * @returns {Promise<Response>} Datos del profesor autenticado.
 */
profesoresController.post('/login', async (c) => {
    try {
        const datos = await c.req.json();
        const { email, password } = datos;
        if (!email || !password) {
            return c.json({ error: 'Email y contraseña son requeridos' }, { status: 400 });
        }
        const profesor = await service.authenticateTeacher(email, password);
        return c.json(profesor, { status: 200 });
    } catch (error) {
        const mensaje = error instanceof Error ? error.message : 'Error al iniciar sesión';
        return c.json({ error: mensaje }, { status: 401 });
    }
});

/**
 * Obtiene todos los profesores.
 * @route GET /profesores
 * @param {import('hono').Context} c - Contexto HTTP de Hono.
 * @returns {Promise<Response>} Lista de profesores.
 */
profesoresController.get('/', async (c) => {
    try {
        const profesores = await service.getAllTeachers();
        return c.json(profesores);
    } catch (error) {
        const mensaje = error instanceof Error ? error.message : 'Error al obtener profesores';
        return c.json({ error: mensaje }, { status: 500 });
    }
});

/**
 * Obtiene un profesor por su RUT.
 * @route GET /profesores/:rut
 * @param {import('hono').Context} c - Contexto HTTP de Hono.
 * @returns {Promise<Response>} Profesor encontrado.
 */
profesoresController.get('/:rut', async (c) => {
    try {
        const rut = c.req.param('rut');
        const profesor = await service.getTeacherByRut(rut);
        return c.json(profesor);
    } catch (error) {
        const mensaje = error instanceof Error ? error.message : 'Error al obtener profesor';
        return c.json({ error: mensaje }, { status: 404 });
    }
});

/**
 * Crea un nuevo profesor.
 * @route POST /profesores
 * @param {import('hono').Context} c - Contexto HTTP de Hono.
 * @returns {Promise<Response>} Confirmación de creación.
 */
profesoresController.post('/', async (c) => {
    try {
        const datos = await c.req.json();
        const parsed = crearProfesorSchema.safeParse(datos);
        if (!parsed.success) {
            const msgs = parsed.error.issues.map(i => i.message).join(', ');
            return c.json({ error: msgs }, { status: 400 });
        }
        await service.createTeacher(parsed.data);
        return c.json({ message: 'Profesor creado correctamente', datos: parsed.data }, { status: 201 });
    } catch (error) {
        const mensaje = error instanceof Error ? error.message : 'Error al crear profesor';
        return c.json({ error: mensaje }, { status: 400 });
    }
});

/**
 * Actualiza un profesor por su RUT.
 * @route PUT /profesores/:rut
 * @param {import('hono').Context} c - Contexto HTTP de Hono.
 * @returns {Promise<Response>} Confirmación de actualización.
 */
profesoresController.put('/:rut', async (c) => {
    try {
        const rut = c.req.param('rut');
        const datos = await c.req.json();
        const parsed = actualizarProfesorSchema.safeParse(datos);
        if (!parsed.success) {
            const msgs = parsed.error.issues.map(i => i.message).join(', ');
            return c.json({ error: msgs }, { status: 400 });
        }
        await service.updateTeacher(rut, parsed.data);
        return c.json({ message: 'Profesor actualizado correctamente', datos: parsed.data });
    } catch (error) {
        const mensaje = error instanceof Error ? error.message : 'Error al actualizar profesor';
        return c.json({ error: mensaje }, { status: 400 });
    }
});

/**
 * Elimina un profesor por su RUT.
 * @route DELETE /profesores/:rut
 * @param {import('hono').Context} c - Contexto HTTP de Hono.
 * @returns {Promise<Response>} Confirmación de eliminación.
 */
profesoresController.delete('/:rut', async (c) => {
    try {
        const rut = c.req.param('rut');
        await service.deleteTeacher(rut);
        return c.json({ message: 'Profesor eliminado correctamente' });
    } catch (error) {
        const mensaje = error instanceof Error ? error.message : 'Error al eliminar profesor';
        return c.json({ error: mensaje }, { status: 400 });
    }
});
