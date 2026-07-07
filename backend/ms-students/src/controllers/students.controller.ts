import { Hono } from 'hono';
import { StudentsService } from '../services/students.service.js';
import { loginStudentSchema, createStudentSchema, updateStudentSchema } from '../dtos/student.dto.js';

const service = new StudentsService();

export const studentsController = new Hono();

studentsController.post('/login', async (c) => {
  try {
    const data = await c.req.json();
    const parsed = loginStudentSchema.safeParse(data);
    if (!parsed.success) {
      const msgs = parsed.error.issues.map(i => i.message).join(', ');
      return c.json({ error: msgs }, 400);
    }

    const { email, password } = parsed.data;
    const { estudiante, token } = await service.authenticateStudent(email, password);
    return c.json({
      id: estudiante.id,
      rut: estudiante.rut,
      dv: estudiante.dv,
      firstName: estudiante.firstName,
      lastName: estudiante.lastName,
      courses: estudiante.courses,
      email: estudiante.email,
      phone: estudiante.phone,
      guardian: estudiante.guardian,
      guardianEmail: estudiante.guardianEmail,
      registrationDate: estudiante.registrationDate,
      token,
    });
  } catch (err: any) {
    return c.json({ error: err.message }, 401);
  }
});

studentsController.get('/', async (c) => {
  try {
    const estudiantes = await service.getAllStudents();
    return c.json(estudiantes.map(e => ({ id: e.id, rut: e.rut, dv: e.dv, firstName: e.firstName, lastName: e.lastName, email: e.email, phone: e.phone, courses: e.courses, guardian: e.guardian, guardianEmail: e.guardianEmail, registrationDate: e.registrationDate })));
  } catch (err: any) {
    return c.json({ error: err.message }, 500);
  }
});

studentsController.get('/:rut', async (c) => {
  try {
    const rut = c.req.param('rut');
    const e = await service.getStudentByRut(rut);
    return c.json({ id: e.id, rut: e.rut, dv: e.dv, firstName: e.firstName, lastName: e.lastName, email: e.email, phone: e.phone, courses: e.courses, guardian: e.guardian, guardianEmail: e.guardianEmail, registrationDate: e.registrationDate });
  } catch (err: any) {
    return c.json({ error: err.message }, 404);
  }
});

studentsController.post('/', async (c) => {
  try {
    const data = await c.req.json();
    const parsed = createStudentSchema.safeParse(data);
    if (!parsed.success) {
      const msgs = parsed.error.issues.map(i => i.message).join(', ');
      return c.json({ error: msgs }, 400);
    }
    await service.createStudent(parsed.data);
    return c.json({ message: 'Student created successfully', data: parsed.data }, 201);
  } catch (err: any) {
    return c.json({ error: err.message }, 400);
  }
});

studentsController.put('/:rut', async (c) => {
  try {
    const rut = c.req.param('rut');
    const data = await c.req.json();
    const parsed = updateStudentSchema.safeParse(data);
    if (!parsed.success) {
      const msgs = parsed.error.issues.map(i => i.message).join(', ');
      return c.json({ error: msgs }, 400);
    }
    await service.updateStudent(rut, parsed.data);
    return c.json({ message: 'Student updated successfully', data: parsed.data });
  } catch (err: any) {
    return c.json({ error: err.message }, 400);
  }
});

studentsController.delete('/:rut', async (c) => {
  try {
    const rut = c.req.param('rut');
    await service.deleteStudent(rut);
    return c.json({ message: 'Student deleted successfully' });
  } catch (err: any) {
    return c.json({ error: err.message }, 400);
  }
});

studentsController.get('/course/:course', async (c) => {
  try {
    const course = c.req.param('course');
    const estudiantes = await service.getStudentsByCourse(course);
    return c.json(estudiantes.map(e => ({ id: e.id, rut: e.rut, dv: e.dv, firstName: e.firstName, lastName: e.lastName, email: e.email, phone: e.phone, courses: e.courses, guardian: e.guardian, guardianEmail: e.guardianEmail, registrationDate: e.registrationDate })));
  } catch (err: any) {
    return c.json({ error: err.message }, 400);
  }
});
