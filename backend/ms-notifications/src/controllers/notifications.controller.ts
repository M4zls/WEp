import { Hono } from 'hono';
import { NotificationsService } from '../services/notifications.service.js';
import { absenceAlertSchema, gradeAlertSchema, messageAlertSchema } from '../dtos/notification.dto.js';

const service = new NotificationsService();

export const notificationsController = new Hono();

notificationsController.post('/absence-notice', async (c) => {
  try {
    const datos = await c.req.json();
    const parsed = absenceAlertSchema.safeParse(datos);
    if (!parsed.success) {
      const msgs = parsed.error.issues.map((i) => i.message).join(', ');
      return c.json({ error: msgs }, 400);
    }
    await service.sendAttendanceNotice(parsed.data);
    return c.json({ message: 'Notification sent' });
  } catch (err: any) {
    return c.json({ error: err.message }, 500);
  }
});

notificationsController.post('/grade-notice', async (c) => {
  try {
    const datos = await c.req.json();
    const parsed = gradeAlertSchema.safeParse(datos);
    if (!parsed.success) {
      const msgs = parsed.error.issues.map((i) => i.message).join(', ');
      return c.json({ error: msgs }, 400);
    }
    await service.sendGradeNotice(parsed.data);
    return c.json({ message: 'Grade notification sent' });
  } catch (err: any) {
    return c.json({ error: err.message }, 500);
  }
});

notificationsController.post('/message-notice', async (c) => {
  try {
    const datos = await c.req.json();
    const parsed = messageAlertSchema.safeParse(datos);
    if (!parsed.success) {
      const msgs = parsed.error.issues.map((i) => i.message).join(', ');
      return c.json({ error: msgs }, 400);
    }
    await service.sendMessageNotice(parsed.data);
    return c.json({ message: 'Message notification sent' });
  } catch (err: any) {
    return c.json({ error: err.message }, 500);
  }
});

notificationsController.get('/user/:userId', async (c) => {
  try {
    const userId = parseInt(c.req.param('userId'), 10);
    if (isNaN(userId)) return c.json({ error: 'ID de usuario inválido' }, 400);
    const result = await service.getUserNotifications(userId);
    return c.json(result);
  } catch (err: any) {
    return c.json({ error: err.message }, 500);
  }
});

notificationsController.get('/user/:userId/unread', async (c) => {
  try {
    const userId = parseInt(c.req.param('userId'), 10);
    if (isNaN(userId)) return c.json({ error: 'ID de usuario inválido' }, 400);
    const result = await service.getUnreadCount(userId);
    return c.json(result);
  } catch (err: any) {
    return c.json({ error: err.message }, 500);
  }
});

notificationsController.put('/:id/read', async (c) => {
  try {
    const id = parseInt(c.req.param('id'), 10);
    if (isNaN(id)) return c.json({ error: 'Invalid ID' }, 400);
    await service.markAsRead(id);
    return c.json({ message: 'Notification marked as read' });
  } catch (err: any) {
    return c.json({ error: err.message }, 500);
  }
});
