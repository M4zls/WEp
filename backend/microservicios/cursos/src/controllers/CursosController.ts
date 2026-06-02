import { Hono } from 'hono';
import { CursosService } from '../services/CursosService.js';
import { crearCursoSchema, crearAsignaturaSchema, asignarMateriaSchema } from '../dtos/CursoDto.js';

const service = new CursosService();
export const cursosController = new Hono();

// Rutas fijas de asignaturas (deben ir ANTES de /:id)
cursosController.get('/asignaturas', async (c) => {
  try {
    const asignaturas = await service.listarAsignaturas();
    return c.json(asignaturas);
  } catch (err: any) {
    return c.json({ error: err.message }, 500);
  }
});

cursosController.post('/asignaturas', async (c) => {
  try {
    const data = await c.req.json();
    const parsed = crearAsignaturaSchema.safeParse(data);
    if (!parsed.success) {
      const msgs = parsed.error.issues.map(i => i.message).join(', ');
      return c.json({ error: msgs }, 400);
    }
    const asignatura = await service.crearAsignatura(parsed.data);
    return c.json(asignatura, 201);
  } catch (err: any) {
    return c.json({ error: err.message }, 400);
  }
});

cursosController.put('/asignaturas/:id', async (c) => {
  try {
    const id = parseInt(c.req.param('id'));
    const data = await c.req.json();
    const parsed = crearAsignaturaSchema.partial().safeParse(data);
    if (!parsed.success) {
      const msgs = parsed.error.issues.map(i => i.message).join(', ');
      return c.json({ error: msgs }, 400);
    }
    await service.actualizarAsignatura(id, parsed.data);
    return c.json({ message: 'Asignatura actualizada correctamente' });
  } catch (err: any) {
    return c.json({ error: err.message }, 400);
  }
});

cursosController.delete('/asignaturas/:id', async (c) => {
  try {
    const id = parseInt(c.req.param('id'));
    await service.eliminarAsignatura(id);
    return c.json({ message: 'Asignatura eliminada correctamente' });
  } catch (err: any) {
    return c.json({ error: err.message }, 400);
  }
});

// Rutas fijas de asignar-materia (deben ir ANTES de /:cursoId/materias)
cursosController.post('/asignar-materia', async (c) => {
  try {
    const data = await c.req.json();
    const parsed = asignarMateriaSchema.safeParse(data);
    if (!parsed.success) {
      const msgs = parsed.error.issues.map(i => i.message).join(', ');
      return c.json({ error: msgs }, 400);
    }
    const result = await service.asignarMateriaACurso(parsed.data);
    return c.json(result, 201);
  } catch (err: any) {
    return c.json({ error: err.message }, 400);
  }
});

cursosController.put('/asignar-materia/:id', async (c) => {
  try {
    const id = parseInt(c.req.param('id'));
    const data = await c.req.json();
    const parsed = asignarMateriaSchema.partial().safeParse(data);
    if (!parsed.success) {
      const msgs = parsed.error.issues.map(i => i.message).join(', ');
      return c.json({ error: msgs }, 400);
    }
    await service.actualizarAsignacion(id, parsed.data);
    return c.json({ message: 'Asignación actualizada correctamente' });
  } catch (err: any) {
    return c.json({ error: err.message }, 400);
  }
});

cursosController.delete('/asignar-materia/:id', async (c) => {
  try {
    const id = parseInt(c.req.param('id'));
    await service.eliminarAsignacion(id);
    return c.json({ message: 'Asignación eliminada correctamente' });
  } catch (err: any) {
    return c.json({ error: err.message }, 400);
  }
});

// Cursos
cursosController.get('/', async (c) => {
  try {
    const cursos = await service.listarCursos();
    return c.json(cursos);
  } catch (err: any) {
    return c.json({ error: err.message }, 500);
  }
});

cursosController.get('/:id', async (c) => {
  try {
    const id = parseInt(c.req.param('id'));
    const curso = await service.obtenerCurso(id);
    return c.json(curso);
  } catch (err: any) {
    return c.json({ error: err.message }, 404);
  }
});

cursosController.post('/', async (c) => {
  try {
    const data = await c.req.json();
    const parsed = crearCursoSchema.safeParse(data);
    if (!parsed.success) {
      const msgs = parsed.error.issues.map(i => i.message).join(', ');
      return c.json({ error: msgs }, 400);
    }
    const curso = await service.crearCurso(parsed.data);
    return c.json(curso, 201);
  } catch (err: any) {
    return c.json({ error: err.message }, 400);
  }
});

cursosController.put('/:id', async (c) => {
  try {
    const id = parseInt(c.req.param('id'));
    const data = await c.req.json();
    const parsed = crearCursoSchema.partial().safeParse(data);
    if (!parsed.success) {
      const msgs = parsed.error.issues.map(i => i.message).join(', ');
      return c.json({ error: msgs }, 400);
    }
    await service.actualizarCurso(id, parsed.data);
    return c.json({ message: 'Curso actualizado correctamente' });
  } catch (err: any) {
    return c.json({ error: err.message }, 400);
  }
});

cursosController.delete('/:id', async (c) => {
  try {
    const id = parseInt(c.req.param('id'));
    await service.eliminarCurso(id);
    return c.json({ message: 'Curso eliminado correctamente' });
  } catch (err: any) {
    return c.json({ error: err.message }, 400);
  }
});

// Curso-Asignatura (parametrizada, va al final)
cursosController.get('/:cursoId/materias', async (c) => {
  try {
    const cursoId = parseInt(c.req.param('cursoId'));
    const materias = await service.obtenerMateriasDelCurso(cursoId);
    return c.json(materias);
  } catch (err: any) {
    return c.json({ error: err.message }, 400);
  }
});
