import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core';

// Tabla de Notificaciones
export const notificaciones = sqliteTable('notificaciones', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  usuarioId: integer('usuario_id').notNull(), // Referencia a usuarios en autentificacion
  titulo: text('titulo').notNull(),
  mensaje: text('mensaje').notNull(),
  tipo: text('tipo').notNull(), // info, advertencia, error, exito
  leida: integer('leida', { mode: 'boolean' }).default(false),
  url: text('url'), // Link a la que la notificación redirige
  fechaCreacion: text('fecha_creacion').default(new Date().toISOString()),
  fechaLectura: text('fecha_lectura'),
});

// Tabla de Eventos
export const eventos = sqliteTable('eventos', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  titulo: text('titulo').notNull(),
  descripcion: text('descripcion'),
  tipo: text('tipo').notNull(), // reunion, evento, recordatorio, cambio
  datos: text('datos'), // JSON con datos del evento
  activo: integer('activo', { mode: 'boolean' }).default(true),
  fechaCreacion: text('fecha_creacion').default(new Date().toISOString()),
  fechaProgramada: text('fecha_programada'),
});

// Tabla de Logs
export const logs = sqliteTable('logs', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  usuarioId: integer('usuario_id'),
  accion: text('accion').notNull(),
  modulo: text('modulo').notNull(),
  detalles: text('detalles'), // JSON con detalles adicionales
  ip: text('ip'),
  estado: text('estado').notNull(), // exito, error
  fechaCreacion: text('fecha_creacion').default(new Date().toISOString()),
});
