import { pgSchema, serial, integer, text } from 'drizzle-orm/pg-core';

const cursosSchema = pgSchema('cursos');
const profesoresSchema = pgSchema('profesores');

export const cursos = cursosSchema.table('cursos', {
  id: serial('id').primaryKey(),
  nombre: text('nombre').notNull(),
  nivel: text('nivel').notNull(),
  letra: text('letra').notNull(),
  anio: text('anio').default(new Date().getFullYear().toString()),
  fechaCreacion: text('fecha_creacion').default(new Date().toISOString()),
});

export const asignaturas = cursosSchema.table('asignaturas', {
  id: serial('id').primaryKey(),
  nombre: text('nombre').notNull(),
  codigo: text('codigo').notNull().unique(),
  descripcion: text('descripcion'),
  fechaCreacion: text('fecha_creacion').default(new Date().toISOString()),
});

export const profesores = profesoresSchema.table('profesores', {
  id: serial('id').primaryKey(),
  rut: text('rut').notNull(),
  nombre: text('nombre').notNull(),
  apellido: text('apellido').notNull(),
});

export const cursoAsignatura = cursosSchema.table('curso_asignatura', {
  id: serial('id').primaryKey(),
  cursoId: integer('curso_id').notNull(),
  asignaturaId: integer('asignatura_id').notNull(),
  profesorId: integer('profesor_id'),
  fechaCreacion: text('fecha_creacion').default(new Date().toISOString()),
});
