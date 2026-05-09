import { pgSchema, serial, integer, text, boolean } from 'drizzle-orm/pg-core';

const notif = pgSchema('notificaciones');

export const notificaciones = notif.table('notificaciones', {
  id: serial('id').primaryKey(),
  usuarioId: integer('usuario_id').notNull(),
  titulo: text('titulo').notNull(),
  mensaje: text('mensaje').notNull(),
  tipo: text('tipo').notNull(),
  leida: boolean('leida').default(false),
  url: text('url'),
  fechaCreacion: text('fecha_creacion').default(new Date().toISOString()),
  fechaLectura: text('fecha_lectura'),
});

export const eventos = notif.table('eventos', {
  id: serial('id').primaryKey(),
  titulo: text('titulo').notNull(),
  descripcion: text('descripcion'),
  tipo: text('tipo').notNull(),
  datos: text('datos'),
  activo: boolean('activo').default(true),
  fechaCreacion: text('fecha_creacion').default(new Date().toISOString()),
  fechaProgramada: text('fecha_programada'),
});

export const logs = notif.table('logs', {
  id: serial('id').primaryKey(),
  usuarioId: integer('usuario_id'),
  accion: text('accion').notNull(),
  modulo: text('modulo').notNull(),
  detalles: text('detalles'),
  ip: text('ip'),
  estado: text('estado').notNull(),
  fechaCreacion: text('fecha_creacion').default(new Date().toISOString()),
});
