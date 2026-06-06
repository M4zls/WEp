import { sql } from 'drizzle-orm';
import { pgSchema, serial, integer, text } from 'drizzle-orm/pg-core';

const profesoresSchema = pgSchema('profesores');

export const profesores = profesoresSchema.table('profesores', {
  id: serial('id').primaryKey(),
  rut: text('rut').notNull().unique(),
  dv: text('dv').notNull(),
  nombre: text('nombre').notNull(),
  apellido: text('apellido').notNull(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  telefono: text('telefono'),
  materia: text('materia').notNull(),
  fechaIngreso: text('fecha_ingreso').default(sql`now()::text`),
});

export const clases = profesoresSchema.table('clases', {
  id: serial('id').primaryKey(),
  profesorId: integer('profesor_id').notNull().references(() => profesores.id, { onDelete: 'cascade' }),
  cursoId: text('curso_id').notNull(),
  materia: text('materia').notNull(),
  fecha: text('fecha').notNull(),
  tema: text('tema'),
  descripcion: text('descripcion'),
  sala: text('sala'),
});

export const horarios = profesoresSchema.table('horarios', {
  id: serial('id').primaryKey(),
  profesorId: integer('profesor_id').notNull().references(() => profesores.id, { onDelete: 'cascade' }),
  dia: text('dia').notNull(),
  horaInicio: text('hora_inicio').notNull(),
  horaFin: text('hora_fin').notNull(),
  sala: text('sala'),
  cursoId: text('curso_id').notNull(),
});

export const disponibilidad = profesoresSchema.table('disponibilidad', {
  id: serial('id').primaryKey(),
  profesorId: integer('profesor_id').notNull().references(() => profesores.id, { onDelete: 'cascade' }),
  dia: text('dia').notNull(),
  horaInicio: text('hora_inicio').notNull(),
  horaFin: text('hora_fin').notNull(),
  tipo: text('tipo').notNull(),
  ubicacion: text('ubicacion'),
});
