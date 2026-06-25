import { Hono } from 'hono';
import { AsistenciaService } from '../services/AsistenciaService.js';
import { marcarAsistenciaSchema, actualizarAsistenciaSchema } from '../dtos/AsistenciaDto.js';

const service = new AsistenciaService();

export const asistenciaController = new Hono();

asistenciaController.get('/clase/:claseId', async (c) => {
  try {
    const claseId = parseInt(c.req.param('claseId'));
    const registros = await service.listarPorClase(claseId);
    return c.json(registros);
  } catch (err: any) {
    return c.json({ error: err.message }, 500);
  }
});

asistenciaController.get('/estudiante/:rut', async (c) => {
  try {
    const rut = c.req.param('rut');
    const registros = await service.listarPorEstudiante(rut);
    return c.json(registros);
  } catch (err: any) {
    return c.json({ error: err.message }, 500);
  }
});

asistenciaController.get('/curso-asignatura/:id', async (c) => {
  try {
    const id = parseInt(c.req.param('id'));
    const registros = await service.listarPorCursoAsignatura(id);
    return c.json(registros);
  } catch (err: any) {
    return c.json({ error: err.message }, 500);
  }
});

asistenciaController.post('/marcar', async (c) => {
  try {
    const data = await c.req.json();
    const parsed = marcarAsistenciaSchema.safeParse(data);
    if (!parsed.success) {
      const msgs = parsed.error.issues.map(i => i.message).join(', ');
      return c.json({ error: msgs }, 400);
    }
    const results = await service.marcarBatch(parsed.data);
    return c.json(results, 201);
  } catch (err: any) {
    return c.json({ error: err.message }, 400);
  }
});

asistenciaController.put('/:id', async (c) => {
  try {
    const id = parseInt(c.req.param('id'));
    const data = await c.req.json();
    const parsed = actualizarAsistenciaSchema.safeParse(data);
    if (!parsed.success) {
      const msgs = parsed.error.issues.map(i => i.message).join(', ');
      return c.json({ error: msgs }, 400);
    }
    await service.actualizar(id, parsed.data);
    return c.json({ message: 'Asistencia actualizada correctamente' });
  } catch (err: any) {
    return c.json({ error: err.message }, 400);
  }
});
