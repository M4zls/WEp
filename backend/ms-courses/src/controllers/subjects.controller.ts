import { Hono } from 'hono';
import { SubjectsService } from '../services/subjects.service.js';
import { createSubjectSchema } from '../dtos/course.dto.js';

const service = new SubjectsService();

export const subjectsController = new Hono();

subjectsController.get('/subjects', async (c) => {
  try {
    const subjects = await service.listSubjects();
    return c.json(subjects);
  } catch (err: any) {
    return c.json({ error: err.message }, 500);
  }
});

subjectsController.post('/subjects', async (c) => {
  try {
    const raw = await c.req.json();
    const parsed = createSubjectSchema.safeParse(raw);
    if (!parsed.success) {
      const msgs = parsed.error.issues.map(i => i.message).join(', ');
      return c.json({ error: msgs }, 400);
    }
    const subject = await service.createSubject(parsed.data);
    return c.json(subject, 201);
  } catch (err: any) {
    return c.json({ error: err.message }, 400);
  }
});

subjectsController.put('/subjects/:id', async (c) => {
  try {
    const id = parseInt(c.req.param('id'));
    const raw = await c.req.json();
    const parsed = createSubjectSchema.partial().safeParse(raw);
    if (!parsed.success) {
      const msgs = parsed.error.issues.map(i => i.message).join(', ');
      return c.json({ error: msgs }, 400);
    }
    await service.updateSubject(id, parsed.data);
    return c.json({ message: 'Subject updated successfully' });
  } catch (err: any) {
    return c.json({ error: err.message }, 400);
  }
});

subjectsController.delete('/subjects/:id', async (c) => {
  try {
    const id = parseInt(c.req.param('id'));
    await service.deleteSubject(id);
    return c.json({ message: 'Subject deleted successfully' });
  } catch (err: any) {
    return c.json({ error: err.message }, 400);
  }
});
