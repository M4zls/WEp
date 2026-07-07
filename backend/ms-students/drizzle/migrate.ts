import postgres from 'postgres';

declare const process: { env: { DATABASE_URL?: string } };

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error('DATABASE_URL is required');

const sql = postgres(connectionString, { max: 1 });

try {
  await sql.unsafe('CREATE SCHEMA IF NOT EXISTS "students";');
  await sql.unsafe(`CREATE TABLE IF NOT EXISTS "students"."students" (
	"id" serial PRIMARY KEY NOT NULL,
	"rut" text NOT NULL,
	"dv" text NOT NULL,
  "first_name" text NOT NULL,
	"last_name" text NOT NULL,
	"courses" text NOT NULL,
	"email" text NOT NULL,
	"password" text NOT NULL,
	"phone" text,
	"guardian" text,
	"registration_date" text DEFAULT (now()::text),
	CONSTRAINT "students_rut_unique" UNIQUE ("rut"),
	CONSTRAINT "students_email_unique" UNIQUE ("email")
  );`);

  try {
    await sql.unsafe(`ALTER TABLE "students"."students" ADD COLUMN "guardian_email" text;`);
  } catch {
    // la columna ya existe, ignorar
  }

  console.log('Migraciones de estudiantes ejecutadas correctamente');
} finally {
  await sql.end();
}
