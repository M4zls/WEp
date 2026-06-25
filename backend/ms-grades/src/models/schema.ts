import { sql } from 'drizzle-orm';
import { pgSchema, serial, text, numeric, integer } from 'drizzle-orm/pg-core';

const gradesSchema = pgSchema('notas');

export const grades = gradesSchema.table('notas', {
  id: serial('id').primaryKey(),
  studentRut: text('estudiante_rut').notNull(),
  subject: text('asignatura').notNull(),
  curso: text('curso').notNull(),
  grade: numeric('nota', { precision: 4, scale: 1 }).notNull(),
  evaluationType: text('tipo_evaluacion').notNull(),
  date: text('fecha').notNull(),
  professorRut: text('profesor_rut').notNull(),
  coefficient: integer('coeficiente').notNull().default(1),
});
