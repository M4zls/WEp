import { sql } from 'drizzle-orm';
import { pgSchema, serial, integer, text, boolean } from 'drizzle-orm/pg-core';

const notificacionesSchema = pgSchema('notifications');
const estudiantesSchema = pgSchema('students');
const autentificacionSchema = pgSchema('auth');

export const notifications = notificacionesSchema.table('notificaciones', {
  id: serial('id').primaryKey(),
  userId: integer('usuario_id').notNull(),
  title: text('titulo').notNull(),
  message: text('mensaje').notNull(),
  type: text('tipo').notNull(),
  read: boolean('leida').default(false),
  url: text('url'),
  createdAt: text('fecha_creacion').default(sql`now()::text`),
  readAt: text('fecha_lectura'),
});

export const eventos = notificacionesSchema.table('eventos', {
  id: serial('id').primaryKey(),
  titulo: text('titulo').notNull(),
  descripcion: text('descripcion'),
  tipo: text('tipo').notNull(),
  datos: text('datos'),
  activo: boolean('activo').default(true),
  fechaCreacion: text('fecha_creacion').default(sql`now()::text`),
  fechaProgramada: text('fecha_programada'),
});

export const estudiantes = estudiantesSchema.table('estudiantes', {
  id: serial('id').primaryKey(),
  rut: text('rut').notNull(),
});

export const usuarios = autentificacionSchema.table('usuarios', {
  id: serial('id').primaryKey(),
  rut: text('rut').notNull(),
});

export const logs = notificacionesSchema.table('logs', {
  id: serial('id').primaryKey(),
  usuarioId: integer('usuario_id'),
  accion: text('accion').notNull(),
  modulo: text('modulo').notNull(),
  detalles: text('detalles'),
  ip: text('ip'),
  estado: text('estado').notNull(),
  fechaCreacion: text('fecha_creacion').default(sql`now()::text`),
});
