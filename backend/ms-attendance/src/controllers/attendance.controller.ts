import { Hono } from 'hono';
import { AttendanceService } from '../services/attendance.service.js';
import { markAttendanceSchema, updateAttendanceSchema } from '../dtos/attendance.dto.js';

const service = new AttendanceService();

export const attendanceController = new Hono();

attendanceController.get('/class/:classId', async (c) => {
  try {
    const classId = parseInt(c.req.param('classId'));
    const records = await service.listByClass(classId);
    return c.json(records);
  } catch (err: any) {
    return c.json({ error: err.message }, 500);
  }
});

attendanceController.get('/student/:rut', async (c) => {
  try {
    const rut = c.req.param('rut');
    const records = await service.listByStudent(rut);
    return c.json(records);
  } catch (err: any) {
    return c.json({ error: err.message }, 500);
  }
});

attendanceController.get('/course-subject/:id', async (c) => {
  try {
    const id = parseInt(c.req.param('id'));
    const records = await service.listByCourseSubject(id);
    return c.json(records);
  } catch (err: any) {
    return c.json({ error: err.message }, 500);
  }
});

attendanceController.post('/mark', async (c) => {
  try {
    const data = await c.req.json();
    const parsed = markAttendanceSchema.safeParse(data);
    if (!parsed.success) {
      const msgs = parsed.error.issues.map(i => i.message).join(', ');
      return c.json({ error: msgs }, 400);
    }
    const results = await service.markBatch(parsed.data);
    return c.json(results, 201);
  } catch (err: any) {
    return c.json({ error: err.message }, 400);
  }
});

attendanceController.put('/:id', async (c) => {
  try {
    const id = parseInt(c.req.param('id'));
    const data = await c.req.json();
    const parsed = updateAttendanceSchema.safeParse(data);
    if (!parsed.success) {
      const msgs = parsed.error.issues.map(i => i.message).join(', ');
      return c.json({ error: msgs }, 400);
    }
    await service.update(id, parsed.data);
    return c.json({ message: 'Asistencia actualizada correctamente' });
  } catch (err: any) {
    return c.json({ error: err.message }, 400);
  }
});
