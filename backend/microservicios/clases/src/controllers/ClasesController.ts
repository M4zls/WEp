import { Hono } from 'hono';
import { ClasesService } from '../services/ClasesService.js';
import { crearClaseSchema, actualizarClaseSchema } from '../dtos/ClaseDto.js';

const service = new ClasesService();

export const clasesController = new Hono();

clasesController.get('/', async (c) => {
  try {
    const cursoAsignaturaId = c.req.query('curso_asignatura_id');
    const id = cursoAsignaturaId ? parseInt(cursoAsignaturaId) : undefined;
    const clases = await service.listarClases(id);
    return c.json(clases);
  } catch (err: any) {
    return c.json({ error: err.message }, 500);
  }
});

clasesController.get('/:id', async (c) => {
  try {
    const id = parseInt(c.req.param('id'));
    const clase = await service.obtenerClase(id);
    return c.json(clase);
  } catch (err: any) {
    const status = err.message === 'Clase no encontrada' ? 404 : 500;
    return c.json({ error: err.message }, status);
  }
});

clasesController.post('/', async (c) => {
  try {
    const data = await c.req.json();
    const parsed = crearClaseSchema.safeParse(data);
    if (!parsed.success) {
      const msgs = parsed.error.issues.map(i => i.message).join(', ');
      return c.json({ error: msgs }, 400);
    }
    const clase = await service.crearClase(parsed.data);
    return c.json(clase, 201);
  } catch (err: any) {
    return c.json({ error: err.message }, 400);
  }
});

clasesController.put('/:id', async (c) => {
  try {
    const id = parseInt(c.req.param('id'));
    const data = await c.req.json();
    const parsed = actualizarClaseSchema.safeParse(data);
    if (!parsed.success) {
      const msgs = parsed.error.issues.map(i => i.message).join(', ');
      return c.json({ error: msgs }, 400);
    }
    await service.actualizarClase(id, parsed.data);
    return c.json({ message: 'Clase actualizada correctamente' });
  } catch (err: any) {
    const status = err.message === 'Clase no encontrada' ? 404 : 400;
    return c.json({ error: err.message }, status);
  }
});

clasesController.delete('/:id', async (c) => {
  try {
    const id = parseInt(c.req.param('id'));
    await service.eliminarClase(id);
    return c.json({ message: 'Clase eliminada correctamente' });
  } catch (err: any) {
    const status = err.message === 'Clase no encontrada' ? 404 : 400;
    return c.json({ error: err.message }, status);
  }
});
