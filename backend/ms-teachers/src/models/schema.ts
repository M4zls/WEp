import { sql } from 'drizzle-orm';
import { pgSchema, serial, integer, text } from 'drizzle-orm/pg-core';

const profesoresSchema = pgSchema('teachers');

export const teachers = profesoresSchema.table('teachers', {
  id: serial('id').primaryKey(),
  rut: text('rut').notNull().unique(),
  dv: text('dv').notNull(),
  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  phone: text('phone'),
  subject: text('subject').notNull(),
  createdAt: text('hire_date').default(sql`now()::text`),
});

export const lessons = profesoresSchema.table('lessons', {
  id: serial('id').primaryKey(),
  professorId: integer('professor_id').notNull().references(() => teachers.id, { onDelete: 'cascade' }),
  courseId: text('course_id').notNull(),
  subject: text('subject').notNull(),
  date: text('date').notNull(),
  topic: text('topic'),
  description: text('description'),
  room: text('room'),
});

export const schedules = profesoresSchema.table('schedules', {
  id: serial('id').primaryKey(),
  professorId: integer('professor_id').notNull().references(() => teachers.id, { onDelete: 'cascade' }),
  day: text('day').notNull(),
  startTime: text('start_time').notNull(),
  endTime: text('end_time').notNull(),
  room: text('room'),
  courseId: text('course_id').notNull(),
});

export const availability = profesoresSchema.table('availability', {
  id: serial('id').primaryKey(),
  professorId: integer('professor_id').notNull().references(() => teachers.id, { onDelete: 'cascade' }),
  day: text('day').notNull(),
  startTime: text('start_time').notNull(),
  endTime: text('end_time').notNull(),
  type: text('type').notNull(),
  location: text('location'),
});
