import { Hono } from 'hono';
import { CoursesService } from '../services/courses.service.js';
import { createCourseSchema } from '../dtos/course.dto.js';

const service = new CoursesService();

export const coursesController = new Hono();

coursesController.get('/', async (c) => {
  try {
    const courses = await service.listCourses();
    return c.json(courses);
  } catch (err: any) {
    return c.json({ error: err.message }, 500);
  }
});

coursesController.get('/:id', async (c) => {
  try {
    const id = parseInt(c.req.param('id'));
    const course = await service.getCourse(id);
    return c.json(course);
  } catch (err: any) {
    return c.json({ error: err.message }, 404);
  }
});

coursesController.post('/', async (c) => {
  try {
    const data = await c.req.json();
    const parsed = createCourseSchema.safeParse(data);
    if (!parsed.success) {
      const msgs = parsed.error.issues.map(i => i.message).join(', ');
      return c.json({ error: msgs }, 400);
    }
    const course = await service.createCourse(parsed.data);
    return c.json(course, 201);
  } catch (err: any) {
    return c.json({ error: err.message }, 400);
  }
});

coursesController.put('/:id', async (c) => {
  try {
    const id = parseInt(c.req.param('id'));
    const data = await c.req.json();
    const parsed = createCourseSchema.partial().safeParse(data);
    if (!parsed.success) {
      const msgs = parsed.error.issues.map(i => i.message).join(', ');
      return c.json({ error: msgs }, 400);
    }
    await service.updateCourse(id, parsed.data);
    return c.json({ message: 'Curso actualizado correctamente' });
  } catch (err: any) {
    return c.json({ error: err.message }, 400);
  }
});

coursesController.delete('/:id', async (c) => {
  try {
    const id = parseInt(c.req.param('id'));
    await service.deleteCourse(id);
    return c.json({ message: 'Curso eliminado correctamente' });
  } catch (err: any) {
    return c.json({ error: err.message }, 400);
  }
});
