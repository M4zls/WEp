import { sql } from 'drizzle-orm';
import { pgSchema, serial, integer, text } from 'drizzle-orm/pg-core';

export const scheduleSchema = pgSchema('schedule');

export const schedules = scheduleSchema.table('schedules', {
  id: serial('id').primaryKey(),
  courseSubjectId: integer('course_subject_id').notNull(),
  weekDay: integer('week_day').notNull(),
  startTime: text('start_time').notNull(),
  endTime: text('end_time').notNull(),
  createdAt: text('created_at').default(sql`now()::text`),
});
