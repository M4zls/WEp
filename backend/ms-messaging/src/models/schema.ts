import { sql } from 'drizzle-orm';
import { pgSchema, serial, text, integer, boolean } from 'drizzle-orm/pg-core';

/** Schema de PostgreSQL específico para el microservicio de mensajería. */
export const messagingSchema = pgSchema('messaging');

/** Tabla de conversaciones (cabecera). */
export const conversations = messagingSchema.table('conversaciones', {
  id: serial('id').primaryKey(),
  createdAt: text('created_at').default(sql`now()::text`),
});

/** Tabla de mensajes individuales dentro de una conversación. */
export const messages = messagingSchema.table('mensajes', {
  id: serial('id').primaryKey(),
  conversationId: integer('conversacion_id').notNull(),
  senderId: text('remitente_id').notNull(),
  senderName: text('remitente_nombre').notNull(),
  senderLastName: text('remitente_apellido').notNull(),
  senderRole: text('remitente_rol').notNull(),
  content: text('contenido').notNull(),
  read: boolean('leido').default(false),
  createdAt: text('created_at').default(sql`now()::text`),
});

/** Tabla de participantes asociados a cada conversación. */
export const conversationParticipants = messagingSchema.table('conversacion_participantes', {
  id: serial('id').primaryKey(),
  conversationId: integer('conversacion_id').notNull(),
  userId: text('usuario_id').notNull(),
  userName: text('usuario_nombre').notNull(),
  userLastName: text('usuario_apellido').notNull(),
  userRole: text('usuario_rol').notNull(),
});
