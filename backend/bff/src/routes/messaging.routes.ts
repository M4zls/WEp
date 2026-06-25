import { Hono } from 'hono';
import { MessagingService } from '../services/messaging.service.js';

const app = new Hono();

const MS_MESSAGING_SERVICE = process.env.MS_MESSAGING_SERVICE || 'http://localhost:3009';
const messagingService = new MessagingService();

const esToEn: Record<string, string> = {
  conversacionId: 'conversationId',
  remitenteId: 'senderId',
  remitenteNombre: 'senderName',
  remitenteApellido: 'senderLastName',
  remitenteRol: 'senderRole',
  contenido: 'content',
  participanteIds: 'participantIds',
  participanteNombres: 'participantNames',
  participanteApellidos: 'participantLastNames',
  participanteRoles: 'participantRoles',
  ultimoMensaje: 'lastMessage',
  noLeidos: 'unreadCount',
  usuarioId: 'userId',
  usuarioNombre: 'userName',
  usuarioApellido: 'userLastName',
  usuarioRol: 'userRole',
};

const enToEs: Record<string, string> = {};
for (const [es, en] of Object.entries(esToEn)) {
  enToEs[en] = es;
}

function mapKeys(obj: any, mapping: Record<string, string>): any {
  if (Array.isArray(obj)) return obj.map(i => mapKeys(i, mapping));
  if (obj && typeof obj === 'object') {
    const mapped: any = {};
    for (const [key, value] of Object.entries(obj)) {
      const newKey = mapping[key] ?? key;
      mapped[newKey] = mapKeys(value, mapping);
    }
    return mapped;
  }
  return obj;
}

app.post('/conversaciones', async (c) => {
  try {
    const body = await c.req.json();
    const payload = mapKeys(body, esToEn);
    const response = await fetch(`${MS_MESSAGING_SERVICE}/messaging/conversations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await response.json();
    return c.json(data, response.status as any);
  } catch (error) {
    return c.json({ error: 'Error creating conversation' }, 500);
  }
});

app.get('/conversaciones/:usuarioId', async (c) => {
  try {
    const usuarioId = c.req.param('usuarioId');
    const response = await fetch(`${MS_MESSAGING_SERVICE}/messaging/conversations/${usuarioId}`);
    const data = await response.json();
    return c.json(mapKeys(data, enToEs), response.status as any);
  } catch (error) {
    return c.json({ error: 'Error fetching conversations' }, 500);
  }
});

app.post('/mensajes', async (c) => {
  try {
    const body = await c.req.json();
    const payload = mapKeys(body, esToEn);
    const response = await fetch(`${MS_MESSAGING_SERVICE}/messaging/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await response.json();
    if (!response.ok) {
      return c.json(data, response.status as any);
    }

    messagingService.sendMessageNotification(body);

    return c.json(data, response.status as any);
  } catch (error) {
    return c.json({ error: 'Error sending message' }, 500);
  }
});

app.get('/mensajes/:conversacionId', async (c) => {
  try {
    const conversacionId = c.req.param('conversacionId');
    const response = await fetch(`${MS_MESSAGING_SERVICE}/messaging/messages/${conversacionId}`);
    const data = await response.json();
    return c.json(mapKeys(data, enToEs), response.status as any);
  } catch (error) {
    return c.json({ error: 'Error fetching messages' }, 500);
  }
});

app.put('/mensajes/leer/:conversacionId/:usuarioId', async (c) => {
  try {
    const conversacionId = c.req.param('conversacionId');
    const usuarioId = c.req.param('usuarioId');
    const response = await fetch(`${MS_MESSAGING_SERVICE}/messaging/messages/read/${conversacionId}/${usuarioId}`, {
      method: 'PUT',
    });
    const data = await response.json();
    return c.json(data, response.status as any);
  } catch (error) {
    return c.json({ error: 'Error marking messages as read' }, 500);
  }
});

export default app;
