import { sqliteTable, integer, text, real } from 'drizzle-orm/sqlite-core';

// Tabla de Estudiantes
export const estudiantes = sqliteTable('estudiantes', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  rut: text('rut').notNull().unique(),  
  dv: text('dv').notNull(),  
  nombre: text('nombre').notNull(),
  apellido: text('apellido').notNull(),
  cursos: text('cursos').notNull(),
  email: text('email'),
  telefono: text('telefono'),
  apoderado: text('apoderado'),
  fechaRegistro: text('fecha_registro').default(new Date().toISOString()),
});

// Tabla de Asistencias (solo referencia RUT)
export const asistencias = sqliteTable('asistencias', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  rut: text('rut')
    .notNull()
    .references(() => estudiantes.rut, { onDelete: 'cascade' }),
  fecha: text('fecha').notNull(),
  presente: integer('presente', { mode: 'boolean' }).notNull(),
  justificacion: text('justificacion'),
});

// Tabla de Calificaciones (solo referencia RUT)
export const calificaciones = sqliteTable('calificaciones', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  rut: text('rut')
    .notNull()
    .references(() => estudiantes.rut, { onDelete: 'cascade' }),
  asignatura: text('asignatura').notNull(),
  nota: real('nota').notNull(),
  fecha: text('fecha').notNull(),
  descripcion: text('descripcion'),
});

// Tabla de Profesores
export const profesores = sqliteTable('profesores', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  rut: text('rut').notNull().unique(),
  dv: text('dv').notNull(),
  nombre: text('nombre').notNull(),
  apellido: text('apellido').notNull(),
  email: text('email').notNull().unique(),
  asignatura: text('asignatura').notNull(),
  curso: text('curso').notNull(),
});