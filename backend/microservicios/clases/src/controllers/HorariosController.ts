import { Hono } from 'hono';
import { HorariosService } from '../services/HorariosService.js';
import { crearHorarioSchema, actualizarHorarioSchema } from '../dtos/HorarioDto.js';

const service = new HorariosService();

export const horariosController = new Hono();

horariosController.get('/', async (c) => {
  try {
    const cursoAsignaturaId = c.req.query('curso_asignatura_id');
    const id = cursoAsignaturaId ? parseInt(cursoAsignaturaId) : undefined;
    const horarios = await service.listarHorarios(id);
    return c.json(horarios);
  } catch (err: any) {
    return c.json({ error: err.message }, 500);
  }
});

horariosController.get('/:id', async (c) => {
  try {
    const id = parseInt(c.req.param('id'));
    const horario = await service.obtenerHorario(id);
    return c.json(horario);
  } catch (err: any) {
    const status = err.message === 'Horario no encontrado' ? 404 : 500;
    return c.json({ error: err.message }, status);
  }
});

horariosController.post('/', async (c) => {
  try {
    const data = await c.req.json();
    const parsed = crearHorarioSchema.safeParse(data);
    if (!parsed.success) {
      const msgs = parsed.error.issues.map(i => i.message).join(', ');
      return c.json({ error: msgs }, 400);
    }
    const horario = await service.crearHorario(parsed.data);
    return c.json(horario, 201);
  } catch (err: any) {
    return c.json({ error: err.message }, 400);
  }
});

horariosController.put('/:id', async (c) => {
  try {
    const id = parseInt(c.req.param('id'));
    const data = await c.req.json();
    const parsed = actualizarHorarioSchema.safeParse(data);
    if (!parsed.success) {
      const msgs = parsed.error.issues.map(i => i.message).join(', ');
      return c.json({ error: msgs }, 400);
    }
    await service.actualizarHorario(id, parsed.data);
    return c.json({ message: 'Horario actualizado correctamente' });
  } catch (err: any) {
    const status = err.message === 'Horario no encontrado' ? 404 : 400;
    return c.json({ error: err.message }, status);
  }
});

horariosController.delete('/:id', async (c) => {
  try {
    const id = parseInt(c.req.param('id'));
    await service.eliminarHorario(id);
    return c.json({ message: 'Horario eliminado correctamente' });
  } catch (err: any) {
    const status = err.message === 'Horario no encontrado' ? 404 : 400;
    return c.json({ error: err.message }, status);
  }
});
