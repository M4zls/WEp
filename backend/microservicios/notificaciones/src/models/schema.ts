import { sql } from 'drizzle-orm';
import { pgSchema, serial, integer, text, boolean } from 'drizzle-orm/pg-core';

const notificacionesSchema = pgSchema('notificaciones');
const estudiantesSchema = pgSchema('estudiantes');

export const notificaciones = notificacionesSchema.table('notificaciones', {
  id: serial('id').primaryKey(),
  usuarioId: integer('usuario_id').notNull(),
  titulo: text('titulo').notNull(),
  mensaje: text('mensaje').notNull(),
  tipo: text('tipo').notNull(),
  leida: boolean('leida').default(false),
  url: text('url'),
  fechaCreacion: text('fecha_creacion').default(sql`now()::text`),
  fechaLectura: text('fecha_lectura'),
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
