import { z } from 'zod';

/** Esquema de validación para crear una conversación entre dos o más participantes. */
export const createConversationSchema = z.object({
  participantIds: z.array(z.string({ error: 'ID de participante inválido' }))
    .min(2, 'Se requieren al menos 2 participantes'),
  participantFirstNames: z.array(z.string())
    .min(2, 'Se requieren nombres para los participantes'),
  participantLastNames: z.array(z.string())
    .min(2, 'Se requieren apellidos para los participantes'),
  participantRoles: z.array(z.enum(['student', 'professor']))
    .min(2, 'Se requieren roles para los participantes'),
});

/** Esquema de validación para enviar un mensaje en una conversación existente. */
export const sendMessageSchema = z.object({
  conversationId: z.number({ error: 'ID de conversación requerido' }).int().positive(),
  senderId: z.string({ error: 'ID del remitente requerido' }),
  senderFirstName: z.string({ error: 'Nombre del remitente requerido' }),
  senderLastName: z.string({ error: 'Apellido del remitente requerido' }),
  senderRole: z.enum(['student', 'professor']),
  content: z.string({ error: 'El mensaje no puede estar vacío' }).min(1, 'El mensaje no puede estar vacío'),
});

export type CreateConversationDto = z.infer<typeof createConversationSchema>;
export type SendMessageDto = z.infer<typeof sendMessageSchema>;
