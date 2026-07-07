import { sql } from 'drizzle-orm';
import { pgSchema, serial, integer, text, boolean } from 'drizzle-orm/pg-core';

const schema = pgSchema('notifications');

export const notifications = schema.table('notifications', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull(),
  title: text('title').notNull(),
  message: text('message').notNull(),
  type: text('type').notNull(),
  read: boolean('read').default(false),
  url: text('url'),
  createdAt: text('created_at').default(sql`now()::text`),
  readAt: text('read_at'),
});

export const events = schema.table('events', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description'),
  type: text('type').notNull(),
  data: text('data'),
  active: boolean('active').default(true),
  createdAt: text('created_at').default(sql`now()::text`),
  scheduledAt: text('scheduled_at'),
});

export const logs = schema.table('logs', {
  id: serial('id').primaryKey(),
  userId: integer('user_id'),
  action: text('action').notNull(),
  module: text('module').notNull(),
  details: text('details'),
  ip: text('ip'),
  status: text('status').notNull(),
  createdAt: text('created_at').default(sql`now()::text`),
});
