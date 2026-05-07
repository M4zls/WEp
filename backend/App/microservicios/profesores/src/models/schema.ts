import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core';

// Tabla de Profesores
export const profesores = sqliteTable('profesores', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  rut: text('rut').notNull().unique(),
  dv: text('dv').notNull(),
  nombre: text('nombre').notNull(),
  apellido: text('apellido').notNull(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  telefono: text('telefono'),
  materia: text('materia').notNull(),
  fechaIngreso: text('fecha_ingreso').default(new Date().toISOString()),
});

// Tabla de Clases
export const clases = sqliteTable('clases', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  profesorId: integer('profesor_id')
    .notNull()
    .references(() => profesores.id, { onDelete: 'cascade' }),
  cursoId: text('curso_id').notNull(),
  asignatura: text('asignatura').notNull(),
  fecha: text('fecha').notNull(),
  tema: text('tema'),
  descripcion: text('descripcion'),
  sala: text('sala'),
});

