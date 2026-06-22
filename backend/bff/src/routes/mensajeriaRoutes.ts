import { Hono } from 'hono';

const app = new Hono();

const MENSAJERIA_SERVICE = process.env.MENSAJERIA_SERVICE || 'http://localhost:3009';
const NOTIFICACIONES_SERVICE = process.env.NOTIFICACIONES_SERVICE || 'http://localhost:3003';

/**
 * POST /mensajeria/conversaciones
 * Crea o reutiliza una conversación entre participantes.
 * Delega al microservicio de mensajería.
 */
app.post('/conversaciones', async (c) => {
  try {
    const body = await c.req.json();
    const response = await fetch(`${MENSAJERIA_SERVICE}/mensajeria/conversaciones`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = await response.json();
    return c.json(data, response.status as any);
  } catch (error) {
    return c.json({ error: 'Error creating conversation' }, 500);
  }
});

/**
 * GET /mensajeria/conversaciones/:usuarioId
 * Lista las conversaciones de un usuario.
 */
app.get('/conversaciones/:usuarioId', async (c) => {
  try {
    const usuarioId = c.req.param('usuarioId');
    const response = await fetch(`${MENSAJERIA_SERVICE}/mensajeria/conversaciones/${usuarioId}`);
    const data = await response.json();
    return c.json(data, response.status as any);
  } catch (error) {
    return c.json({ error: 'Error fetching conversations' }, 500);
  }
});

/**
 * POST /mensajeria/mensajes
 * Envía un mensaje en una conversación existente
 * y dispara una notificación in-app al destinatario.
 */
app.post('/mensajes', async (c) => {
  try {
    const body = await c.req.json();
    const response = await fetch(`${MENSAJERIA_SERVICE}/mensajeria/mensajes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = await response.json();
    if (!response.ok) {
      return c.json(data, response.status as any);
    }

    // Notificar al destinatario del mensaje
    try {
      const participantesRes = await fetch(
        `${MENSAJERIA_SERVICE}/mensajeria/conversaciones/${body.remitenteId}`
      );
      if (participantesRes.ok) {
        const conversaciones: any[] = await participantesRes.json();
        const conv = conversaciones.find((c: any) => c.id === body.conversacionId);
        if (conv && conv.otherParticipant) {
          const dest = conv.otherParticipant;
          fetch(`${NOTIFICACIONES_SERVICE}/notificaciones/aviso-mensaje`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              destinatarioRut: dest.usuarioId,
              destinatarioRol: dest.usuarioRol,
              remitenteNombre: body.remitenteNombre,
              remitenteApellido: body.remitenteApellido,
              contenidoPreview: body.contenido,
              conversacionId: body.conversacionId,
            }),
          }).catch(() => {});
        }
      }
    } catch {
      // fallback silencioso si falla la notificación
    }

    return c.json(data, response.status as any);
  } catch (error) {
    return c.json({ error: 'Error sending message' }, 500);
  }
});

/**
 * GET /mensajeria/mensajes/:conversacionId
 * Obtiene los mensajes de una conversación.
 */
app.get('/mensajes/:conversacionId', async (c) => {
  try {
    const conversacionId = c.req.param('conversacionId');
    const response = await fetch(`${MENSAJERIA_SERVICE}/mensajeria/mensajes/${conversacionId}`);
    const data = await response.json();
    return c.json(data, response.status as any);
  } catch (error) {
    return c.json({ error: 'Error fetching messages' }, 500);
  }
});

/**
 * PUT /mensajeria/mensajes/leer/:conversacionId/:usuarioId
 * Marca como leídos los mensajes de una conversación para un usuario.
 */
app.put('/mensajes/leer/:conversacionId/:usuarioId', async (c) => {
  try {
    const conversacionId = c.req.param('conversacionId');
    const usuarioId = c.req.param('usuarioId');
    const response = await fetch(`${MENSAJERIA_SERVICE}/mensajeria/mensajes/leer/${conversacionId}/${usuarioId}`, {
      method: 'PUT',
    });
    const data = await response.json();
    return c.json(data, response.status as any);
  } catch (error) {
    return c.json({ error: 'Error marking messages as read' }, 500);
  }
});

export default app;
