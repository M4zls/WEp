
import { pgSchema,serial,integer,text,boolean }from 'drizzle-orm/pg-core';

const autentificacion = pgSchema('autentificacion');

// Tabla de Usuarios
export const usuarios = autentificacion.table('usuarios', {
  id: serial('id').primaryKey(),
  rut: text('rut').notNull().unique(),
  dv: text('dv').notNull(),
  nombre: text('nombre').notNull(),
  apellido: text('apellido').notNull(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  rol: text('rol').notNull().default('estudiante'), // estudiante, profesor, admin
  activo: boolean('activo').default(true),
  fechaCreacion: text('fecha_creacion').default(new Date().toISOString()),
});

// Tabla de Sesiones
export const sesiones = autentificacion.table('sesiones', {
  id: serial('id').primaryKey(),
  usuarioId: integer('usuario_id')
    .notNull()
    .references(() => usuarios.id, { onDelete: 'cascade' }),
  token: text('token').notNull().unique(),
  expiresAt: text('expires_at').notNull(),
  createdAt: text('created_at').default(new Date().toISOString()),
});

// Tabla de Tokens de Recuperación
export const tokensRecuperacion = autentificacion.table('tokens_recuperacion', {
  id: serial('id').primaryKey(),
  usuarioId: integer('usuario_id')
    .notNull()
    .references(() => usuarios.id, { onDelete: 'cascade' }),
  token: text('token').notNull().unique(),
  expiresAt: text('expires_at').notNull(),
  usado: boolean('usado').default(false),
  createdAt: text('created_at').default(new Date().toISOString()),
});

// Tabla de Permisos
export const permisos = autentificacion.table('permisos', {
  id: serial('id').primaryKey(),
  usuarioId: integer('usuario_id')
    .notNull()
    .references(() => usuarios.id, { onDelete: 'cascade' }),
  modulo: text('modulo').notNull(), // estudiantes, profesores, etc
  lectura: boolean('lectura').default(false),
  escritura: boolean('escritura').default(false),
  eliminacion: boolean('eliminacion').default(false),
});
