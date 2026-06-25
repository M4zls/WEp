import { sql } from 'drizzle-orm';
import { pgSchema, serial, integer, text } from 'drizzle-orm/pg-core';

export const classesSchema = pgSchema('classes');

export const classes = classesSchema.table('classes', {
  id: serial('id').primaryKey(),
  courseSubjectId: integer('course_subject_id').notNull(),
  title: text('title').notNull(),
  description: text('description'),
  date: text('date').notNull(),
  startTime: text('start_time').notNull(),
  endTime: text('end_time').notNull(),
  status: text('status').default('pending'),
  createdAt: text('created_at').default(sql`now()::text`),
});
