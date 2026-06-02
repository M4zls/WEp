import { Hono } from 'hono';
import { ProfesoresService } from '../services/ProfesoresService.js';
import { crearProfesorSchema, actualizarProfesorSchema } from '../dtos/ProfesorDto.js';

const service = new ProfesoresService(); 
export const profesoresController = new Hono();

// POST /profesores/login - login de profesor
profesoresController.post('/login', async (c) => {
    try {
        const datos = await c.req.json();
        const { email, password } = datos;
        if (!email || !password) {
            return c.json({ error: 'Email y contraseña son requeridos' }, { status: 400 });
        }
        const profesor = await service.login(email, password);
        return c.json(profesor, { status: 200 });
    } catch (error) {
        const mensaje = error instanceof Error ? error.message : 'Error al iniciar sesión';
        return c.json({ error: mensaje }, { status: 401 });
    }
});

// GET /profesores - obtener todos
profesoresController.get('/', async (c) => {
    try {
        const profesores = await service.obtenerTodos();
        return c.json(profesores);
    } catch (error) {
        const mensaje = error instanceof Error ? error.message : 'Error al obtener profesores';
        return c.json({ error: mensaje }, { status: 500 });
    }
});

// GET /profesores/:rut - obtener por rut
profesoresController.get('/:rut', async (c) => {
    try {
        const rut = c.req.param('rut');
        const profesor = await service.obtenerProfesor(rut);
        return c.json(profesor);
    } catch (error) {
        const mensaje = error instanceof Error ? error.message : 'Error al obtener profesor';
        return c.json({ error: mensaje }, { status: 404 });
    }
});

// POST /profesores - crear nuevo
profesoresController.post('/', async (c) => {
    try {
        const datos = await c.req.json();
        const parsed = crearProfesorSchema.safeParse(datos);
        if (!parsed.success) {
            const msgs = parsed.error.issues.map(i => i.message).join(', ');
            return c.json({ error: msgs }, { status: 400 });
        }
        await service.crearProfesor(parsed.data);
        return c.json({ message: 'Profesor creado correctamente', datos: parsed.data }, { status: 201 });
    } catch (error) {
        const mensaje = error instanceof Error ? error.message : 'Error al crear profesor';
        return c.json({ error: mensaje }, { status: 400 });
    }
});

// PUT /profesores/:rut - actualizar
profesoresController.put('/:rut', async (c) => {
    try {
        const rut = c.req.param('rut');
        const datos = await c.req.json();
        const parsed = actualizarProfesorSchema.safeParse(datos);
        if (!parsed.success) {
            const msgs = parsed.error.issues.map(i => i.message).join(', ');
            return c.json({ error: msgs }, { status: 400 });
        }
        await service.actualizarProfesor(rut, parsed.data);
        return c.json({ message: 'Profesor actualizado correctamente', datos: parsed.data });
    } catch (error) {
        const mensaje = error instanceof Error ? error.message : 'Error al actualizar profesor';
        return c.json({ error: mensaje }, { status: 400 });
    }
});

// DELETE /profesores/:rut - eliminar
profesoresController.delete('/:rut', async (c) => {
    try {
        const rut = c.req.param('rut');
        await service.eliminarProfesor(rut);
        return c.json({ message: 'Profesor eliminado correctamente' });
    } catch (error) {
        const mensaje = error instanceof Error ? error.message : 'Error al eliminar profesor';
        return c.json({ error: mensaje }, { status: 400 });
    }
});
