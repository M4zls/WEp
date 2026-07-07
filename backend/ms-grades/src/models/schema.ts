import { sql } from 'drizzle-orm';
import { pgSchema, serial, text, numeric, integer } from 'drizzle-orm/pg-core';

const gradesSchema = pgSchema('grades');

export const grades = gradesSchema.table('grades', {
  id: serial('id').primaryKey(),
  studentRut: text('student_rut').notNull(),
  subject: text('subject').notNull(),
  course: text('course').notNull(),
  grade: numeric('grade', { precision: 4, scale: 1 }).notNull(),
  evaluationType: text('evaluation_type').notNull(),
  date: text('date').notNull(),
  professorRut: text('professor_rut').notNull(),
  coefficient: integer('coefficient').notNull().default(1),
});
