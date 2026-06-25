import { z } from 'zod';

/** Esquema de validación para crear una conversación entre dos o más participantes. */
export const crearConversacionSchema = z.object({
  participanteIds: z.array(z.string({ error: 'ID de participante inválido' }))
    .min(2, 'Se requieren al menos 2 participantes'),
  participanteNombres: z.array(z.string())
    .min(2, 'Se requieren nombres para los participantes'),
  participanteApellidos: z.array(z.string())
    .min(2, 'Se requieren apellidos para los participantes'),
  participanteRoles: z.array(z.enum(['estudiante', 'profesor']))
    .min(2, 'Se requieren roles para los participantes'),
});

/** Esquema de validación para enviar un mensaje en una conversación existente. */
export const enviarMensajeSchema = z.object({
  conversacionId: z.number({ error: 'ID de conversación requerido' }).int().positive(),
  remitenteId: z.string({ error: 'ID del remitente requerido' }),
  remitenteNombre: z.string({ error: 'Nombre del remitente requerido' }),
  remitenteApellido: z.string({ error: 'Apellido del remitente requerido' }),
  remitenteRol: z.enum(['estudiante', 'profesor']),
  contenido: z.string({ error: 'El mensaje no puede estar vacío' }).min(1, 'El mensaje no puede estar vacío'),
});

export type CrearConversacionDto = z.infer<typeof crearConversacionSchema>;
export type EnviarMensajeDto = z.infer<typeof enviarMensajeSchema>;
