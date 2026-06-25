import { Hono } from 'hono';
import { ClassesService } from '../services/classes.service.js';
import { createClassSchema, updateClassSchema } from '../dtos/class.dto.js';
import { CLASS_ERRORS } from '../common/consts.js';

const service = new ClassesService();

export const classesController = new Hono();

classesController.get('/', async (c) => {
  try {
    const courseSubjectId = c.req.query('course_subject_id');
    const id = courseSubjectId ? parseInt(courseSubjectId) : undefined;
    const classes = await service.listClasses(id);
    return c.json(classes);
  } catch (err: any) {
    return c.json({ error: err.message }, 500);
  }
});

classesController.get('/:id', async (c) => {
  try {
    const id = parseInt(c.req.param('id'));
    const cls = await service.getClass(id);
    return c.json(cls);
  } catch (err: any) {
    const status = err.message === CLASS_ERRORS.NOT_FOUND ? 404 : 500;
    return c.json({ error: err.message }, status);
  }
});

classesController.post('/', async (c) => {
  try {
    const data = await c.req.json();
    const parsed = createClassSchema.safeParse(data);
    if (!parsed.success) {
      const msgs = parsed.error.issues.map(i => i.message).join(', ');
      return c.json({ error: msgs }, 400);
    }
    const cls = await service.createClass(parsed.data);
    return c.json(cls, 201);
  } catch (err: any) {
    return c.json({ error: err.message }, 400);
  }
});

classesController.put('/:id', async (c) => {
  try {
    const id = parseInt(c.req.param('id'));
    const data = await c.req.json();
    const parsed = updateClassSchema.safeParse(data);
    if (!parsed.success) {
      const msgs = parsed.error.issues.map(i => i.message).join(', ');
      return c.json({ error: msgs }, 400);
    }
    await service.updateClass(id, parsed.data);
    return c.json({ message: 'Clase actualizada correctamente' });
  } catch (err: any) {
    const status = err.message === CLASS_ERRORS.NOT_FOUND ? 404 : 400;
    return c.json({ error: err.message }, status);
  }
});

classesController.delete('/:id', async (c) => {
  try {
    const id = parseInt(c.req.param('id'));
    await service.deleteClass(id);
    return c.json({ message: 'Clase eliminada correctamente' });
  } catch (err: any) {
    const status = err.message === CLASS_ERRORS.NOT_FOUND ? 404 : 400;
    return c.json({ error: err.message }, status);
  }
});
