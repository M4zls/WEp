import { sql } from 'drizzle-orm';
import { pgSchema, serial, integer, text } from 'drizzle-orm/pg-core';

export const clasesSchema = pgSchema('clases');

export const clases = clasesSchema.table('clases', {
  id: serial('id').primaryKey(),
  cursoAsignaturaId: integer('curso_asignatura_id').notNull(),
  titulo: text('titulo').notNull(),
  descripcion: text('descripcion'),
  fecha: text('fecha').notNull(),
  horaInicio: text('hora_inicio').notNull(),
  horaTermino: text('hora_termino').notNull(),
  estado: text('estado').default('pendiente'),
  createdAt: text('created_at').default(sql`now()::text`),
});

export const horarios = clasesSchema.table('horarios', {
  id: serial('id').primaryKey(),
  cursoAsignaturaId: integer('curso_asignatura_id').notNull(),
  diaSemana: integer('dia_semana').notNull(),
  horaInicio: text('hora_inicio').notNull(),
  horaTermino: text('hora_termino').notNull(),
  createdAt: text('created_at').default(sql`now()::text`),
});
