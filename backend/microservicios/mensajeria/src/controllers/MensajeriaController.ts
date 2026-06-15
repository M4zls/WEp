import { Hono } from 'hono';
import { MensajeriaService } from '../services/MensajeriaService.js';
import { crearConversacionSchema, enviarMensajeSchema } from '../dtos/MensajeriaDto.js';

const service = new MensajeriaService();

/** Controlador REST del microservicio de mensajería. Montado en /mensajeria. */
export const mensajeriaController = new Hono();

/**
 * POST /mensajeria/conversaciones
 * Crea una nueva conversación o devuelve una existente si ya hay una con los mismos participantes.
 * Body: CrearConversacionDto
 */
mensajeriaController.post('/conversaciones', async (c) => {
  try {
    const data = await c.req.json();
    const parsed = crearConversacionSchema.safeParse(data);
    if (!parsed.success) {
      const msgs = parsed.error.issues.map((i: any) => i.message).join(', ');
      return c.json({ error: msgs }, 400);
    }
    const conv = await service.crearObtenerConversacion(parsed.data);
    return c.json(conv, 201);
  } catch (err: any) {
    return c.json({ error: err.message }, 400);
  }
});

/**
 * GET /mensajeria/conversaciones/:usuarioId
 * Lista todas las conversaciones de un usuario, incluyendo participantes, último mensaje y no leídos.
 */
mensajeriaController.get('/conversaciones/:usuarioId', async (c) => {
  try {
    const usuarioId = c.req.param('usuarioId');
    const conversaciones = await service.listarConversaciones(usuarioId);
    const result = await Promise.all(
      conversaciones.map(async (conv) => {
        const participantes = await service.obtenerParticipantes(conv.id);
        return { ...conv, participantes };
      })
    );
    return c.json(result);
  } catch (err: any) {
    return c.json({ error: err.message }, 500);
  }
});

/**
 * POST /mensajeria/mensajes
 * Envía un mensaje en una conversación existente.
 * Body: EnviarMensajeDto
 */
mensajeriaController.post('/mensajes', async (c) => {
  try {
    const data = await c.req.json();
    const parsed = enviarMensajeSchema.safeParse(data);
    if (!parsed.success) {
      const msgs = parsed.error.issues.map((i: any) => i.message).join(', ');
      return c.json({ error: msgs }, 400);
    }
    const mensaje = await service.enviarMensaje(parsed.data);
    return c.json(mensaje, 201);
  } catch (err: any) {
    return c.json({ error: err.message }, 400);
  }
});

/**
 * GET /mensajeria/mensajes/:conversacionId
 * Obtiene todos los mensajes de una conversación ordenados por fecha ascendente.
 */
mensajeriaController.get('/mensajes/:conversacionId', async (c) => {
  try {
    const conversacionId = parseInt(c.req.param('conversacionId'));
    const mensajes = await service.obtenerMensajes(conversacionId);
    return c.json(mensajes);
  } catch (err: any) {
    return c.json({ error: err.message }, 500);
  }
});

/**
 * PUT /mensajeria/mensajes/leer/:conversacionId/:usuarioId
 * Marca como leídos los mensajes de otros participantes en una conversación.
 */
mensajeriaController.put('/mensajes/leer/:conversacionId/:usuarioId', async (c) => {
  try {
    const conversacionId = parseInt(c.req.param('conversacionId'));
    const usuarioId = c.req.param('usuarioId');
    await service.marcarLeidos(conversacionId, usuarioId);
    return c.json({ message: 'Mensajes marcados como leídos' });
  } catch (err: any) {
    return c.json({ error: err.message }, 400);
  }
});
