import { sql } from 'drizzle-orm';
import { pgSchema, serial, integer, text } from 'drizzle-orm/pg-core';

export const horarioSchema = pgSchema('horario');

export const horarios = horarioSchema.table('horarios', {
  id: serial('id').primaryKey(),
  cursoAsignaturaId: integer('curso_asignatura_id').notNull(),
  diaSemana: integer('dia_semana').notNull(),
  horaInicio: text('hora_inicio').notNull(),
  horaTermino: text('hora_termino').notNull(),
  createdAt: text('created_at').default(sql`now()::text`),
});
