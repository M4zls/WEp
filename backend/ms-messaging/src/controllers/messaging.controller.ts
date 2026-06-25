import { Hono } from 'hono';
import { MessagingService } from '../services/messaging.service.js';
import { createConversationSchema, sendMessageSchema } from '../dtos/messaging.dto.js';

const service = new MessagingService();

/** Controlador REST del microservicio de mensajería. Montado en /messaging. */
export const messagingController = new Hono();

/**
 * POST /messaging/conversations
 * Crea una nueva conversación o devuelve una existente si ya hay una con los mismos participantes.
 * Body: CreateConversationDto
 */
messagingController.post('/conversations', async (c) => {
  try {
    const data = await c.req.json();
    const parsed = createConversationSchema.safeParse(data);
    if (!parsed.success) {
      const msgs = parsed.error.issues.map((i) => i.message).join(', ');
      return c.json({ error: msgs }, 400);
    }
    const conv = await service.getOrCreateConversation(parsed.data);
    return c.json(conv, 201);
  } catch (err: any) {
    return c.json({ error: err.message }, 400);
  }
});

/**
 * GET /messaging/conversations/:userId
 * Lista todas las conversaciones de un usuario, incluyendo participantes, último mensaje y no leídos.
 */
messagingController.get('/conversations/:userId', async (c) => {
  try {
    const userId = c.req.param('userId');
    const result = await service.listConversations(userId);
    return c.json(result);
  } catch (err: any) {
    return c.json({ error: err.message }, 500);
  }
});

/**
 * POST /messaging/messages
 * Envía un mensaje en una conversación existente.
 * Body: SendMessageDto
 */
messagingController.post('/messages', async (c) => {
  try {
    const data = await c.req.json();
    const parsed = sendMessageSchema.safeParse(data);
    if (!parsed.success) {
      const msgs = parsed.error.issues.map((i) => i.message).join(', ');
      return c.json({ error: msgs }, 400);
    }
    const message = await service.sendMessage(parsed.data);
    return c.json(message, 201);
  } catch (err: any) {
    return c.json({ error: err.message }, 400);
  }
});

/**
 * GET /messaging/messages/:conversationId
 * Obtiene todos los mensajes de una conversación ordenados por fecha ascendente.
 */
messagingController.get('/messages/:conversationId', async (c) => {
  try {
    const conversationId = parseInt(c.req.param('conversationId'));
    const messages = await service.getMessages(conversationId);
    return c.json(messages);
  } catch (err: any) {
    return c.json({ error: err.message }, 500);
  }
});

/**
 * PUT /messaging/messages/read/:conversationId/:userId
 * Marca como leídos los mensajes de otros participantes en una conversación.
 */
messagingController.put('/messages/read/:conversationId/:userId', async (c) => {
  try {
    const conversationId = parseInt(c.req.param('conversationId'));
    const userId = c.req.param('userId');
    await service.markAsRead(conversationId, userId);
    return c.json({ message: 'Mensajes marcados como leídos' });
  } catch (err: any) {
    return c.json({ error: err.message }, 400);
  }
});
