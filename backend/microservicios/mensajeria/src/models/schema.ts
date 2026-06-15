import { sql } from 'drizzle-orm';
import { pgSchema, serial, text, integer, boolean } from 'drizzle-orm/pg-core';

/** Schema de PostgreSQL específico para el microservicio de mensajería. */
export const mensajeriaSchema = pgSchema('mensajeria');

/** Tabla de conversaciones (cabecera). */
export const conversaciones = mensajeriaSchema.table('conversaciones', {
  id: serial('id').primaryKey(),
  createdAt: text('created_at').default(sql`now()::text`),
});

/** Tabla de mensajes individuales dentro de una conversación. */
export const mensajes = mensajeriaSchema.table('mensajes', {
  id: serial('id').primaryKey(),
  conversacionId: integer('conversacion_id').notNull(),
  remitenteId: text('remitente_id').notNull(),
  remitenteNombre: text('remitente_nombre').notNull(),
  remitenteApellido: text('remitente_apellido').notNull(),
  remitenteRol: text('remitente_rol').notNull(),
  contenido: text('contenido').notNull(),
  leido: boolean('leido').default(false),
  createdAt: text('created_at').default(sql`now()::text`),
});

/** Tabla de participantes asociados a cada conversación. */
export const conversacionParticipantes = mensajeriaSchema.table('conversacion_participantes', {
  id: serial('id').primaryKey(),
  conversacionId: integer('conversacion_id').notNull(),
  usuarioId: text('usuario_id').notNull(),
  usuarioNombre: text('usuario_nombre').notNull(),
  usuarioApellido: text('usuario_apellido').notNull(),
  usuarioRol: text('usuario_rol').notNull(),
});
