import { Hono } from 'hono';
import { StudentsService } from '../services/students.service.js';
import { loginStudentSchema, createStudentSchema, updateStudentSchema } from '../dtos/student.dto.js';

const service = new StudentsService();

export const studentsController = new Hono();

studentsController.post('/login', async (c) => {
  try {
    const datos = await c.req.json();
    const parsed = loginStudentSchema.safeParse(datos);
    if (!parsed.success) {
      const msgs = parsed.error.issues.map(i => i.message).join(', ');
      return c.json({ error: msgs }, 400);
    }

    const { email, password } = parsed.data;
    const { estudiante, token } = await service.authenticateStudent(email, password);
    return c.json({ ...estudiante, token });
  } catch (err: any) {
    return c.json({ error: err.message }, 401);
  }
});

studentsController.get('/', async (c) => {
  try {
    const estudiantes = await service.getAllStudents();
    return c.json(estudiantes);
  } catch (err: any) {
    return c.json({ error: err.message }, 500);
  }
});

studentsController.get('/:rut', async (c) => {
  try {
    const rut = c.req.param('rut');
    const estudiante = await service.getStudentByRut(rut);
    return c.json(estudiante);
  } catch (err: any) {
    return c.json({ error: err.message }, 404);
  }
});

studentsController.post('/', async (c) => {
  try {
    const datos = await c.req.json();
    const parsed = createStudentSchema.safeParse(datos);
    if (!parsed.success) {
      const msgs = parsed.error.issues.map(i => i.message).join(', ');
      return c.json({ error: msgs }, 400);
    }
    await service.createStudent(parsed.data);
    return c.json({ message: 'Estudiante creado correctamente', datos: parsed.data }, 201);
  } catch (err: any) {
    return c.json({ error: err.message }, 400);
  }
});

studentsController.put('/:rut', async (c) => {
  try {
    const rut = c.req.param('rut');
    const datos = await c.req.json();
    const parsed = updateStudentSchema.safeParse(datos);
    if (!parsed.success) {
      const msgs = parsed.error.issues.map(i => i.message).join(', ');
      return c.json({ error: msgs }, 400);
    }
    await service.updateStudent(rut, parsed.data);
    return c.json({ message: 'Estudiante actualizado correctamente', datos: parsed.data });
  } catch (err: any) {
    return c.json({ error: err.message }, 400);
  }
});

studentsController.delete('/:rut', async (c) => {
  try {
    const rut = c.req.param('rut');
    await service.deleteStudent(rut);
    return c.json({ message: 'Estudiante eliminado correctamente' });
  } catch (err: any) {
    return c.json({ error: err.message }, 400);
  }
});

studentsController.get('/curso/:curso', async (c) => {
  try {
    const curso = c.req.param('curso');
    const estudiantes = await service.getStudentsByCourse(curso);
    return c.json(estudiantes);
  } catch (err: any) {
    return c.json({ error: err.message }, 400);
  }
});
