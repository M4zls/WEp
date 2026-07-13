import { sql } from 'drizzle-orm';
import { pgSchema, serial, text, integer, boolean } from 'drizzle-orm/pg-core';

/** Schema de PostgreSQL específico para el microservicio de mensajería. */
export const messagingSchema = pgSchema('messaging');

/** Tabla de conversaciones (cabecera). */
export const conversations = messagingSchema.table('conversations', {
  id: serial('id').primaryKey(),
  createdAt: text('created_at').default(sql`now()::text`),
});

/** Tabla de mensajes individuales dentro de una conversación. */
export const messages = messagingSchema.table('messages', {
  id: serial('id').primaryKey(),
  conversationId: integer('conversation_id').notNull(),
  senderId: text('sender_id').notNull(),
  senderFirstName: text('sender_name').notNull(),
  senderLastName: text('sender_last_name').notNull(),
  senderRole: text('sender_role').notNull(),
  content: text('content').notNull(),
  read: boolean('read').default(false),
  createdAt: text('created_at').default(sql`now()::text`),
});

/** Tabla de participantes asociados a cada conversación. */
export const conversationParticipants = messagingSchema.table('conversation_participants', {
  id: serial('id').primaryKey(),
  conversationId: integer('conversation_id').notNull(),
  userId: text('user_id').notNull(),
  userFirstName: text('user_name').notNull(),
  userLastName: text('user_last_name').notNull(),
  userRole: text('user_role').notNull(),
});
