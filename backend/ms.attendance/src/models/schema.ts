import { sql } from 'drizzle-orm';
import { pgSchema, serial, integer, text, boolean } from 'drizzle-orm/pg-core';

export const asistenicaSchema = pgSchema('asistencia');

export const asistencia = asistenicaSchema.table('asistencia', {
  id: serial('id').primaryKey(),
  claseId: integer('clase_id').notNull(),
  cursoAsignaturaId: integer('curso_asignatura_id').notNull(),
  estudianteRut: text('estudiante_rut').notNull(),
  estudianteNombre: text('estudiante_nombre').notNull(),
  presente: boolean('presente').notNull().default(false),
  justificacion: text('justificacion'),
  fecha: text('fecha').default(sql`now()::text`),
  createdAt: text('created_at').default(sql`now()::text`),
});
