import { Hono } from 'hono';
import { ScheduleService } from '../services/schedule.service.js';
import { createScheduleSchema, updateScheduleSchema } from '../dtos/schedule.dto.js';
import { SCHEDULE_ERRORS } from '../common/consts.js';

const service = new ScheduleService();

export const scheduleController = new Hono();

scheduleController.get('/', async (c) => {
  try {
    const courseSubjectId = c.req.query('curso_asignatura_id');
    const id = courseSubjectId ? parseInt(courseSubjectId) : undefined;
    const horarios = await service.listHorarios(id);
    return c.json(horarios);
  } catch (err: any) {
    return c.json({ error: err.message }, 500);
  }
});

scheduleController.get('/:id', async (c) => {
  try {
    const id = parseInt(c.req.param('id'));
    const horario = await service.getSchedule(id);
    return c.json(horario);
  } catch (err: any) {
    const status = err.message === SCHEDULE_ERRORS.NOT_FOUND ? 404 : 500;
    return c.json({ error: err.message }, status);
  }
});

scheduleController.post('/', async (c) => {
  try {
    const data = await c.req.json();
    const parsed = createScheduleSchema.safeParse(data);
    if (!parsed.success) {
      const msgs = parsed.error.issues.map(i => i.message).join(', ');
      return c.json({ error: msgs }, 400);
    }
    const horario = await service.createSchedule(parsed.data);
    return c.json(horario, 201);
  } catch (err: any) {
    return c.json({ error: err.message }, 400);
  }
});

scheduleController.put('/:id', async (c) => {
  try {
    const id = parseInt(c.req.param('id'));
    const data = await c.req.json();
    const parsed = updateScheduleSchema.safeParse(data);
    if (!parsed.success) {
      const msgs = parsed.error.issues.map(i => i.message).join(', ');
      return c.json({ error: msgs }, 400);
    }
    await service.updateSchedule(id, parsed.data);
    return c.json({ message: 'Horario actualizado correctamente' });
  } catch (err: any) {
    const status = err.message === SCHEDULE_ERRORS.NOT_FOUND ? 404 : 400;
    return c.json({ error: err.message }, status);
  }
});

scheduleController.delete('/:id', async (c) => {
  try {
    const id = parseInt(c.req.param('id'));
    await service.deleteSchedule(id);
    return c.json({ message: 'Horario eliminado correctamente' });
  } catch (err: any) {
    const status = err.message === SCHEDULE_ERRORS.NOT_FOUND ? 404 : 400;
    return c.json({ error: err.message }, status);
  }
});
