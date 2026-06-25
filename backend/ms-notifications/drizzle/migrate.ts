import postgres from 'postgres';

declare const process: { env: { DATABASE_URL?: string } };

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error('DATABASE_URL is required');

const sql = postgres(connectionString, { max: 1 });

try {
  await sql.unsafe('CREATE SCHEMA IF NOT EXISTS "notifications";');
  await sql.unsafe(`CREATE TABLE IF NOT EXISTS "notifications"."eventos" (
	"id" serial PRIMARY KEY NOT NULL,
	"titulo" text NOT NULL,
	"descripcion" text,
	"tipo" text NOT NULL,
	"datos" text,
	"activo" boolean DEFAULT true,
	"fecha_creacion" text DEFAULT (now()::text),
	"fecha_programada" text
  );`);
  await sql.unsafe(`CREATE TABLE IF NOT EXISTS "notifications"."logs" (
	"id" serial PRIMARY KEY NOT NULL,
	"usuario_id" integer,
	"accion" text NOT NULL,
	"modulo" text NOT NULL,
	"detalles" text,
	"ip" text,
	"estado" text NOT NULL,
	"fecha_creacion" text DEFAULT (now()::text)
  );`);
  await sql.unsafe(`CREATE TABLE IF NOT EXISTS "notifications"."notificaciones" (
	"id" serial PRIMARY KEY NOT NULL,
	"usuario_id" integer NOT NULL,
	"titulo" text NOT NULL,
	"mensaje" text NOT NULL,
	"tipo" text NOT NULL,
	"leida" boolean DEFAULT false,
	"url" text,
	"fecha_creacion" text DEFAULT (now()::text),
  "fecha_lectura" text
  );`);

  await sql.unsafe(`DROP TABLE IF EXISTS "notifications"."notifications" CASCADE;`);

  console.log('Migraciones de notificaciones ejecutadas correctamente');
} finally {
  await sql.end();
}
