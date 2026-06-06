import { sql } from 'drizzle-orm';
import { pgSchema, serial, text } from 'drizzle-orm/pg-core';

const estudiantesSchema = pgSchema('estudiantes');

export const estudiantes = estudiantesSchema.table('estudiantes', {
  id: serial('id').primaryKey(),
  rut: text('rut').notNull().unique(),
  dv: text('dv').notNull(),
  nombre: text('nombre').notNull(),
  apellido: text('apellido').notNull(),
  cursos: text('cursos').notNull(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  telefono: text('telefono'),
  apoderado: text('apoderado'),
  fechaRegistro: text('fecha_registro').default(sql`now()::text`),
});
