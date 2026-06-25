import { sql } from 'drizzle-orm';
import { pgSchema, serial, text } from 'drizzle-orm/pg-core';

const studentsSchema = pgSchema('students');

export const students = studentsSchema.table('students', {
  id: serial('id').primaryKey(),
  rut: text('rut').notNull().unique(),
  dv: text('dv').notNull(),
  name: text('nombre').notNull(),
  lastName: text('apellido').notNull(),
  courses: text('cursos').notNull(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  phone: text('telefono'),
  guardian: text('apoderado'),
  guardianEmail: text('apoderado_email'),
  fechaRegistro: text('fecha_registro').default(sql`now()::text`),
});
