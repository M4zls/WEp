import { Hono } from 'hono';
import { CourseSubjectsService } from '../services/course-subjects.service.js';
import { assignSubjectSchema } from '../dtos/course.dto.js';

const service = new CourseSubjectsService();

export const courseSubjectsController = new Hono();

courseSubjectsController.post('/assign-subject', async (c) => {
  try {
    const raw = await c.req.json();
    const parsed = assignSubjectSchema.safeParse(raw);
    if (!parsed.success) {
      const msgs = parsed.error.issues.map(i => i.message).join(', ');
      return c.json({ error: msgs }, 400);
    }
    const result = await service.assignSubject(parsed.data);
    return c.json(result, 201);
  } catch (err: any) {
    return c.json({ error: err.message }, 400);
  }
});

courseSubjectsController.put('/assign-subject/:id', async (c) => {
  try {
    const id = parseInt(c.req.param('id'));
    const raw = await c.req.json();
    const parsed = assignSubjectSchema.partial().safeParse(raw);
    if (!parsed.success) {
      const msgs = parsed.error.issues.map(i => i.message).join(', ');
      return c.json({ error: msgs }, 400);
    }
    await service.updateAssignment(id, parsed.data);
    return c.json({ message: 'Assignment updated successfully' });
  } catch (err: any) {
    return c.json({ error: err.message }, 400);
  }
});

courseSubjectsController.delete('/assign-subject/:id', async (c) => {
  try {
    const id = parseInt(c.req.param('id'));
    await service.deleteAssignment(id);
    return c.json({ message: 'Assignment deleted successfully' });
  } catch (err: any) {
    return c.json({ error: err.message }, 400);
  }
});

courseSubjectsController.get('/:courseId/subjects', async (c) => {
  try {
    const courseId = parseInt(c.req.param('courseId'));
    if (isNaN(courseId)) return c.json({ error: 'Invalid course ID' }, 400);
    const subjects = await service.getSubjectsByCourse(courseId);
    return c.json(subjects);
  } catch (err: any) {
    return c.json({ error: err.message }, 400);
  }
});
