import { Hono } from 'hono';
import { TeachersService } from '../services/teachers.service.js';
import { loginTeacherSchema, createTeacherSchema, updateTeacherSchema } from '../dtos/teacher.dto.js';

const service = new TeachersService();

export const teachersController = new Hono();

teachersController.post('/login', async (c) => {
  try {
    const datos = await c.req.json();
    const parsed = loginTeacherSchema.safeParse(datos);
    if (!parsed.success) {
      const msgs = parsed.error.issues.map(i => i.message).join(', ');
      return c.json({ error: msgs }, 400);
    }
    const profesor = await service.authenticateTeacher(parsed.data.email, parsed.data.password);
    return c.json(profesor);
  } catch (err: any) {
    return c.json({ error: err.message }, 401);
  }
});

teachersController.get('/', async (c) => {
  try {
    const profesores = await service.getAllTeachers();
    return c.json(profesores.map(p => ({ id: p.id, rut: p.rut, dv: p.dv, nombre: p.name, apellido: p.lastName, email: p.email, telefono: p.phone, especialidad: p.subject, createdAt: p.createdAt })));
  } catch (err: any) {
    return c.json({ error: err.message }, 500);
  }
});

teachersController.get('/:rut', async (c) => {
  try {
    const rut = c.req.param('rut');
    const p = await service.getTeacherByRut(rut);
    return c.json({ id: p.id, rut: p.rut, dv: p.dv, nombre: p.name, apellido: p.lastName, email: p.email, telefono: p.phone, especialidad: p.subject, createdAt: p.createdAt });
  } catch (err: any) {
    return c.json({ error: err.message }, 404);
  }
});

teachersController.post('/', async (c) => {
  try {
    const datos = await c.req.json();
    const parsed = createTeacherSchema.safeParse(datos);
    if (!parsed.success) {
      const msgs = parsed.error.issues.map(i => i.message).join(', ');
      return c.json({ error: msgs }, 400);
    }
    await service.createTeacher(parsed.data);
    return c.json({ message: 'Profesor creado correctamente', datos: parsed.data }, 201);
  } catch (err: any) {
    return c.json({ error: err.message }, 400);
  }
});

teachersController.put('/:rut', async (c) => {
  try {
    const rut = c.req.param('rut');
    const datos = await c.req.json();
    const parsed = updateTeacherSchema.safeParse(datos);
    if (!parsed.success) {
      const msgs = parsed.error.issues.map(i => i.message).join(', ');
      return c.json({ error: msgs }, 400);
    }
    await service.updateTeacher(rut, parsed.data);
    return c.json({ message: 'Profesor actualizado correctamente', datos: parsed.data });
  } catch (err: any) {
    return c.json({ error: err.message }, 400);
  }
});

teachersController.delete('/:rut', async (c) => {
  try {
    const rut = c.req.param('rut');
    await service.deleteTeacher(rut);
    return c.json({ message: 'Profesor eliminado correctamente' });
  } catch (err: any) {
    return c.json({ error: err.message }, 400);
  }
});
