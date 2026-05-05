import { Hono } from 'hono';
import { EstudiantesService } from '../services/EstudiantesService.js';
const service = new EstudiantesService();
export const estudianteController = new Hono();
// POST /estudiantes/login - login de estudiante
estudianteController.post('/login', async (c) => {
    try {
        const datos = await c.req.json();
        const { email, password } = datos;
        if (!email || !password) {
            return c.json({ error: 'Email y contraseña son requeridos' }, { status: 400 });
        }
        const estudiante = await service.login(email, password);
        return c.json(estudiante, { status: 200 });
    }
    catch (error) {
        const mensaje = error instanceof Error ? error.message : 'Error al iniciar sesión';
        return c.json({ error: mensaje }, { status: 401 });
    }
});
// GET /estudiantes - obtener todos
estudianteController.get('/', async (c) => {
    try {
        const estudiantes = await service.obtenerTodos();
        return c.json(estudiantes);
    }
    catch (error) {
        const mensaje = error instanceof Error ? error.message : 'Error al obtener estudiantes';
        return c.json({ error: mensaje }, { status: 500 });
    }
});
// GET /estudiantes/:rut - obtener por rut
estudianteController.get('/:rut', async (c) => {
    try {
        const rut = c.req.param('rut');
        const estudiante = await service.obtenerEstudiante(rut);
        return c.json(estudiante);
    }
    catch (error) {
        const mensaje = error instanceof Error ? error.message : 'Error al obtener estudiante';
        return c.json({ error: mensaje }, { status: 404 });
    }
});
// POST /estudiantes - crear nuevo
estudianteController.post('/', async (c) => {
    try {
        const datos = await c.req.json();
        await service.crearEstudiante(datos);
        return c.json({ message: 'Estudiante creado correctamente', datos }, { status: 201 });
    }
    catch (error) {
        const mensaje = error instanceof Error ? error.message : 'Error al crear estudiante';
        return c.json({ error: mensaje }, { status: 400 });
    }
});
// PUT /estudiantes/:rut - actualizar
estudianteController.put('/:rut', async (c) => {
    try {
        const rut = c.req.param('rut');
        const datos = await c.req.json();
        await service.actualizarEstudiante(rut, datos);
        return c.json({ message: 'Estudiante actualizado correctamente', datos });
    }
    catch (error) {
        const mensaje = error instanceof Error ? error.message : 'Error al actualizar estudiante';
        return c.json({ error: mensaje }, { status: 400 });
    }
});
// DELETE /estudiantes/:rut - eliminar
estudianteController.delete('/:rut', async (c) => {
    try {
        const rut = c.req.param('rut');
        await service.eliminarEstudiante(rut);
        return c.json({ message: 'Estudiante eliminado correctamente' });
    }
    catch (error) {
        const mensaje = error instanceof Error ? error.message : 'Error al eliminar estudiante';
        return c.json({ error: mensaje }, { status: 400 });
    }
});
// GET /estudiantes/curso/:curso - obtener por curso
estudianteController.get('/curso/:curso', async (c) => {
    try {
        const curso = c.req.param('curso');
        const estudiantes = await service.obtenerEstudiantesPorCurso(curso);
        return c.json(estudiantes);
    }
    catch (error) {
        const mensaje = error instanceof Error ? error.message : 'Error al obtener estudiantes por curso';
        return c.json({ error: mensaje }, { status: 400 });
    }
});
//# sourceMappingURL=EstudiantesController.js.map