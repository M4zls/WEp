import { sql } from 'drizzle-orm';
import { pgSchema, serial, integer, text, boolean } from 'drizzle-orm/pg-core';

export const attendanceSchema = pgSchema('attendance');

export const attendance = attendanceSchema.table('attendance', {
  id: serial('id').primaryKey(),
  classId: integer('class_id').notNull(),
  courseSubjectId: integer('course_subject_id').notNull(),
  studentRut: text('student_rut').notNull(),
  studentName: text('student_name').notNull(),
  present: boolean('present').notNull().default(false),
  justification: text('justification'),
  date: text('date').default(sql`now()::text`),
  createdAt: text('created_at').default(sql`now()::text`),
});
