import { sql } from 'drizzle-orm';
import { pgSchema, serial, integer, text } from 'drizzle-orm/pg-core';

const coursesSchema = pgSchema('courses');

export const courses = coursesSchema.table('courses', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  level: text('level').notNull(),
  letter: text('letter').notNull(),
  year: text('year').default(new Date().getFullYear().toString()),
  createdAt: text('created_at').default(sql`now()::text`),
});

export const subjects = coursesSchema.table('subjects', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  code: text('code').notNull().unique(),
  description: text('description'),
  createdAt: text('created_at').default(sql`now()::text`),
});

export const courseSubject = coursesSchema.table('course_subject', {
  id: serial('id').primaryKey(),
  courseId: integer('course_id').notNull(),
  subjectId: integer('subject_id').notNull(),
  professorId: integer('professor_id'),
  createdAt: text('created_at').default(sql`now()::text`),
});
