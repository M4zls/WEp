import { Hono } from 'hono';
import { NotificationsService } from '../services/notifications.service.js';
import { absenceAlertSchema, gradeAlertSchema, messageAlertSchema } from '../dtos/notification.dto.js';

const service = new NotificationsService();

export const notificationsController = new Hono();

notificationsController.post('/aviso-inasistencia', async (c) => {
  try {
    const datos = await c.req.json();
    const parsed = absenceAlertSchema.safeParse(datos);
    if (!parsed.success) {
      const msgs = parsed.error.issues.map((i) => i.message).join(', ');
      return c.json({ error: msgs }, 400);
    }
    await service.sendAttendanceNotice(parsed.data);
    return c.json({ message: 'Notificación enviada' });
  } catch (err: any) {
    return c.json({ error: err.message }, 500);
  }
});

notificationsController.post('/aviso-nota', async (c) => {
  try {
    const datos = await c.req.json();
    const parsed = gradeAlertSchema.safeParse(datos);
    if (!parsed.success) {
      const msgs = parsed.error.issues.map((i) => i.message).join(', ');
      return c.json({ error: msgs }, 400);
    }
    await service.sendGradeNotice(parsed.data);
    return c.json({ message: 'Notificación de nota enviada' });
  } catch (err: any) {
    return c.json({ error: err.message }, 500);
  }
});

notificationsController.post('/aviso-mensaje', async (c) => {
  try {
    const datos = await c.req.json();
    const parsed = messageAlertSchema.safeParse(datos);
    if (!parsed.success) {
      const msgs = parsed.error.issues.map((i) => i.message).join(', ');
      return c.json({ error: msgs }, 400);
    }
    await service.sendMessageNotice(parsed.data);
    return c.json({ message: 'Notificación de mensaje enviada' });
  } catch (err: any) {
    return c.json({ error: err.message }, 500);
  }
});

notificationsController.get('/usuario/:usuarioId', async (c) => {
  try {
    const usuarioId = parseInt(c.req.param('usuarioId'), 10);
    if (isNaN(usuarioId)) return c.json({ error: 'ID de usuario inválido' }, 400);
    const result = await service.getUserNotifications(usuarioId);
    return c.json(result);
  } catch (err: any) {
    return c.json({ error: err.message }, 500);
  }
});

notificationsController.get('/usuario/:usuarioId/no-leidas', async (c) => {
  try {
    const usuarioId = parseInt(c.req.param('usuarioId'), 10);
    if (isNaN(usuarioId)) return c.json({ error: 'ID de usuario inválido' }, 400);
    const result = await service.getUnreadCount(usuarioId);
    return c.json(result);
  } catch (err: any) {
    return c.json({ error: err.message }, 500);
  }
});

notificationsController.put('/:id/leer', async (c) => {
  try {
    const id = parseInt(c.req.param('id'), 10);
    if (isNaN(id)) return c.json({ error: 'ID inválido' }, 400);
    await service.markAsRead(id);
    return c.json({ message: 'Notificación marcada como leída' });
  } catch (err: any) {
    return c.json({ error: err.message }, 500);
  }
});
