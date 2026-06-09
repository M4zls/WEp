import postgres from 'postgres';

declare const process: { env: { DATABASE_URL?: string } };

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error('DATABASE_URL is required');

const sql = postgres(connectionString, { max: 1 });

try {
  await sql.unsafe('CREATE SCHEMA IF NOT EXISTS "estudiantes";');
  await sql.unsafe(`CREATE TABLE IF NOT EXISTS "estudiantes"."estudiantes" (
	"id" serial PRIMARY KEY NOT NULL,
	"rut" text NOT NULL,
	"dv" text NOT NULL,
	"nombre" text NOT NULL,
	"apellido" text NOT NULL,
	"cursos" text NOT NULL,
	"email" text NOT NULL,
	"password" text NOT NULL,
	"telefono" text,
	"apoderado" text,
	"fecha_registro" text DEFAULT (now()::text),
	CONSTRAINT "estudiantes_rut_unique" UNIQUE ("rut"),
	CONSTRAINT "estudiantes_email_unique" UNIQUE ("email")
  );`);

  console.log('Migraciones de estudiantes ejecutadas correctamente');
} finally {
  await sql.end();
}