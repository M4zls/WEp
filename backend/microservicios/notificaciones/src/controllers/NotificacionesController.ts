import { Hono } from 'hono';
import { NotificacionesService } from '../services/NotificacionesService.js';
import { avisoInasistenciaSchema } from '../dtos/NotificacionDto.js';

const service = new NotificacionesService();

/**
 * Controller HTTP para el envío de notificaciones.
 */
export const notificacionesController = new Hono();

/**
 * Envía una notificación de aviso de inasistencia.
 * @route POST /notificaciones/aviso-inasistencia
 * @param {import('hono').Context} c - Contexto HTTP de Hono.
 * @returns {Promise<Response>} Confirmación de envío de notificación.
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
  } catch {
    return c.json({ error: 'Error al enviar notificación' }, { status: 500 });
  }
});