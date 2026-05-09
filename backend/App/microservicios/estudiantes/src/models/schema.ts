import { pgSchema, serial, text } from 'drizzle-orm/pg-core';

const est = pgSchema('estudiantes');

export const estudiantes = est.table('estudiantes', {
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
  fechaRegistro: text('fecha_registro').default(new Date().toISOString()),
});
