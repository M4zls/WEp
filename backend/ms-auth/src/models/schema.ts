
import { sql } from 'drizzle-orm';
import { pgSchema, serial, integer, text, boolean } from 'drizzle-orm/pg-core';

const authSchema = pgSchema('auth');

export const users = authSchema.table('users', {
  id: serial('id').primaryKey(),
  rut: text('rut').notNull().unique(),
  dv: text('dv').notNull(),
  name: text('nombre').notNull(),
  lastName: text('apellido').notNull(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  rol: text('rol').notNull().default('estudiante'),
  activo: boolean('activo').default(true),
  createdAt: text('created_at').default(sql`now()::text`),
});

export const sessions = authSchema.table('sessions', {
  id: serial('id').primaryKey(),
  userId: integer('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  token: text('token').notNull().unique(),
  expiresAt: text('expires_at').notNull(),
  createdAt: text('created_at').default(sql`now()::text`),
});

export const recoveryTokens = authSchema.table('recovery_tokens', {
  id: serial('id').primaryKey(),
  userId: integer('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  token: text('token').notNull().unique(),
  expiresAt: text('expires_at').notNull(),
  usado: boolean('usado').default(false),
  createdAt: text('created_at').default(sql`now()::text`),
});

export const permissions = authSchema.table('permissions', {
  id: serial('id').primaryKey(),
  userId: integer('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  modulo: text('modulo').notNull(),
  read: boolean('read').default(false),
  write: boolean('write').default(false),
  delete: boolean('delete').default(false),
});
