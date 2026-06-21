import { sql } from 'drizzle-orm';
import { pgSchema, serial, text, numeric, integer } from 'drizzle-orm/pg-core';

const notasSchema = pgSchema('notas');

export const notas = notasSchema.table('notas', {
  id: serial('id').primaryKey(),
  estudianteRut: text('estudiante_rut').notNull(),
  asignatura: text('asignatura').notNull(),
  curso: text('curso').notNull(),
  nota: numeric('nota', { precision: 4, scale: 1 }).notNull(),
  tipoEvaluacion: text('tipo_evaluacion').notNull(),
  fecha: text('fecha').notNull(),
  profesorRut: text('profesor_rut').notNull(),
  coeficiente: integer('coeficiente').notNull().default(1),
});
