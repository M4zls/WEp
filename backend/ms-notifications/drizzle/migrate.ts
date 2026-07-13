import postgres from 'postgres';

declare const process: { env: { DATABASE_URL?: string } };

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error('DATABASE_URL is required');

const sql = postgres(connectionString, { max: 1 });

try {
  await sql.unsafe('CREATE SCHEMA IF NOT EXISTS "notifications";');
  await sql.unsafe(`CREATE TABLE IF NOT EXISTS "notifications"."events" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"type" text NOT NULL,
	"data" text,
	"active" boolean DEFAULT true,
	"created_at" text DEFAULT (now()::text),
	"scheduled_at" text
  );`);
  await sql.unsafe(`CREATE TABLE IF NOT EXISTS "notifications"."logs" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer,
	"action" text NOT NULL,
	"module" text NOT NULL,
	"details" text,
	"ip" text,
	"status" text NOT NULL,
	"created_at" text DEFAULT (now()::text)
  );`);
  await sql.unsafe(`CREATE TABLE IF NOT EXISTS "notifications"."notifications" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"title" text NOT NULL,
	"message" text NOT NULL,
	"type" text NOT NULL,
	"read" boolean DEFAULT false,
	"url" text,
	"created_at" text DEFAULT (now()::text),
  "read_at" text
  );`);

  await sql.unsafe(`DROP TABLE IF EXISTS "notifications"."notificaciones" CASCADE;`);

  console.log('Migraciones de notificaciones ejecutadas correctamente');
} finally {
  await sql.end();
}
