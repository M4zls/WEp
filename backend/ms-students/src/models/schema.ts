import { sql } from 'drizzle-orm';
import { pgSchema, serial, text } from 'drizzle-orm/pg-core';

const studentsSchema = pgSchema('students');

export const students = studentsSchema.table('students', {
  id: serial('id').primaryKey(),
  rut: text('rut').notNull().unique(),
  dv: text('dv').notNull(),
  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),
  courses: text('courses').notNull(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  phone: text('phone'),
  guardian: text('guardian'),
  guardianEmail: text('guardian_email'),
  registrationDate: text('registration_date').default(sql`now()::text`),
});
