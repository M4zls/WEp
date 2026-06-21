import { Hono } from 'hono';
import { NotificacionesService } from '../services/NotificacionesService.js';
import { avisoInasistenciaSchema, avisoNotaSchema } from '../dtos/NotificacionDto.js';

const service = new NotificacionesService();

/**
 * Controller HTTP para el envío de notificaciones.
 */
export const notificacionesController = new Hono();

/**
 * Envía una notificación de aviso de inasistencia.
 * @route POST /notificaciones/aviso-inasistencia
 */
notificacionesController.post('/aviso-inasistencia', async (c) => {
  try {
    const datos = await c.req.json();
    const parsed = avisoInasistenciaSchema.safeParse(datos);
    if (!parsed.success) {
      return c.json({ error: 'Datos inválidos' }, { status: 400 });
    }
    await service.sendAttendanceNotice(parsed.data);
    return c.json({ message: 'Notificación enviada' }, { status: 200 });
  } catch (e) {
    console.error('[aviso-inasistencia]', e);
    return c.json({ error: 'Error al enviar notificación' }, { status: 500 });
  }
});

/**
 * Envía una notificación de nueva calificación.
 * @route POST /notificaciones/aviso-nota
 */
notificacionesController.post('/aviso-nota', async (c) => {
  try {
    const datos = await c.req.json();
    const parsed = avisoNotaSchema.safeParse(datos);
    if (!parsed.success) {
      return c.json({ error: 'Datos inválidos', errors: parsed.error.issues }, { status: 400 });
    }
    await service.sendGradeNotice(parsed.data);
    return c.json({ message: 'Notificación de nota enviada' }, { status: 200 });
  } catch (e) {
    console.error('[aviso-nota]', e);
    return c.json({ error: 'Error al enviar notificación de nota' }, { status: 500 });
  }
});

/**
 * Obtiene las notificaciones de un usuario.
 * @route GET /notificaciones/usuario/:usuarioId
 */
notificacionesController.get('/usuario/:usuarioId', async (c) => {
  try {
    const usuarioId = parseInt(c.req.param('usuarioId'), 10);
    if (isNaN(usuarioId)) {
      return c.json({ error: 'ID de usuario inválido' }, { status: 400 });
    }
    const result = await service.getUserNotifications(usuarioId);
    return c.json(result);
  } catch (e) {
    console.error('[getUserNotifications]', e);
    return c.json({ error: 'Error al obtener notificaciones' }, { status: 500 });
  }
});

/**
 * Obtiene el conteo de notificaciones no leídas de un usuario.
 * @route GET /notificaciones/usuario/:usuarioId/no-leidas
 */
notificacionesController.get('/usuario/:usuarioId/no-leidas', async (c) => {
  try {
    const usuarioId = parseInt(c.req.param('usuarioId'), 10);
    if (isNaN(usuarioId)) {
      return c.json({ error: 'ID de usuario inválido' }, { status: 400 });
    }
    const result = await service.getUnreadCount(usuarioId);
    return c.json(result);
  } catch (e) {
    console.error('[getUnreadCount]', e);
    return c.json({ error: 'Error al obtener conteo' }, { status: 500 });
  }
});

/**
 * Marca una notificación como leída.
 * @route PUT /notificaciones/:id/leer
 */
notificacionesController.put('/:id/leer', async (c) => {
  try {
    const id = parseInt(c.req.param('id'), 10);
    if (isNaN(id)) {
      return c.json({ error: 'ID inválido' }, { status: 400 });
    }
    await service.markAsRead(id);
    return c.json({ message: 'Notificación marcada como leída' });
  } catch (e) {
    console.error('[markAsRead]', e);
    return c.json({ error: 'Error al marcar notificación' }, { status: 500 });
  }
});