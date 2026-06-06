
import { sql } from 'drizzle-orm';
import { pgSchema, serial, integer, text, boolean } from 'drizzle-orm/pg-core';

const autentificacionSchema = pgSchema('autentificacion');

export const usuarios = autentificacionSchema.table('usuarios', {
  id: serial('id').primaryKey(),
  rut: text('rut').notNull().unique(),
  dv: text('dv').notNull(),
  nombre: text('nombre').notNull(),
  apellido: text('apellido').notNull(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  rol: text('rol').notNull().default('estudiante'), // estudiante, profesor, admin
  activo: boolean('activo').default(true),
  fechaCreacion: text('fecha_creacion').default(sql`now()::text`),
});

export const sesiones = autentificacionSchema.table('sesiones', {
  id: serial('id').primaryKey(),
  usuarioId: integer('usuario_id')
    .notNull()
    .references(() => usuarios.id, { onDelete: 'cascade' }),
  token: text('token').notNull().unique(),
  expiresAt: text('expires_at').notNull(),
  createdAt: text('created_at').default(sql`now()::text`),
});

export const tokensRecuperacion = autentificacionSchema.table('tokens_recuperacion', {
  id: serial('id').primaryKey(),
  usuarioId: integer('usuario_id')
    .notNull()
    .references(() => usuarios.id, { onDelete: 'cascade' }),
  token: text('token').notNull().unique(),
  expiresAt: text('expires_at').notNull(),
  usado: boolean('usado').default(false),
  createdAt: text('created_at').default(sql`now()::text`),
});

export const permisos = autentificacionSchema.table('permisos', {
  id: serial('id').primaryKey(),
  usuarioId: integer('usuario_id')
    .notNull()
    .references(() => usuarios.id, { onDelete: 'cascade' }),
  modulo: text('modulo').notNull(),
  lectura: boolean('lectura').default(false),
  escritura: boolean('escritura').default(false),
  eliminacion: boolean('eliminacion').default(false),
});
