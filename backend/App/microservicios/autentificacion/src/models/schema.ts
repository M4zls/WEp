import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core';

// Tabla de Usuarios
export const usuarios = sqliteTable('usuarios', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  rut: text('rut').notNull().unique(),
  dv: text('dv').notNull(),
  nombre: text('nombre').notNull(),
  apellido: text('apellido').notNull(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  rol: text('rol').notNull().default('estudiante'), // estudiante, profesor, admin
  activo: integer('activo', { mode: 'boolean' }).default(true),
  fechaCreacion: text('fecha_creacion').default(new Date().toISOString()),
});

// Tabla de Sesiones
export const sesiones = sqliteTable('sesiones', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  usuarioId: integer('usuario_id')
    .notNull()
    .references(() => usuarios.id, { onDelete: 'cascade' }),
  token: text('token').notNull().unique(),
  expiresAt: text('expires_at').notNull(),
  createdAt: text('created_at').default(new Date().toISOString()),
});

// Tabla de Tokens de Recuperación
export const tokensRecuperacion = sqliteTable('tokens_recuperacion', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  usuarioId: integer('usuario_id')
    .notNull()
    .references(() => usuarios.id, { onDelete: 'cascade' }),
  token: text('token').notNull().unique(),
  expiresAt: text('expires_at').notNull(),
  usado: integer('usado', { mode: 'boolean' }).default(false),
  createdAt: text('created_at').default(new Date().toISOString()),
});

// Tabla de Permisos
export const permisos = sqliteTable('permisos', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  usuarioId: integer('usuario_id')
    .notNull()
    .references(() => usuarios.id, { onDelete: 'cascade' }),
  modulo: text('modulo').notNull(), // estudiantes, profesores, etc
  lectura: integer('lectura', { mode: 'boolean' }).default(false),
  escritura: integer('escritura', { mode: 'boolean' }).default(false),
  eliminacion: integer('eliminacion', { mode: 'boolean' }).default(false),
});
