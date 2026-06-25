import { sql } from 'drizzle-orm';
import { pgSchema, serial, integer, text } from 'drizzle-orm/pg-core';

export const scheduleSchema = pgSchema('schedule');

export const schedules = scheduleSchema.table('schedules', {
  id: serial('id').primaryKey(),
  courseSubjectId: integer('curso_asignatura_id').notNull(),
  weekDay: integer('dia_semana').notNull(),
  startTime: text('hora_inicio').notNull(),
  endTime: text('hora_termino').notNull(),
  createdAt: text('created_at').default(sql`now()::text`),
});
