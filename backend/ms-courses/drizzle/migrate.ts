import postgres from 'postgres';

declare const process: { env: { DATABASE_URL?: string } };

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error('DATABASE_URL is required');

const sql = postgres(connectionString, { max: 1 });

try {
  await sql.unsafe('CREATE SCHEMA IF NOT EXISTS "cursos";');
  await sql.unsafe(`CREATE TABLE IF NOT EXISTS "cursos"."courses" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"level" text NOT NULL,
	"letter" text NOT NULL,
	"year" text DEFAULT '2026',
	"created_at" text DEFAULT (now()::text)
  );`);
  await sql.unsafe(`CREATE TABLE IF NOT EXISTS "cursos"."subjects" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"code" text NOT NULL,
	"description" text,
	"created_at" text DEFAULT (now()::text),
	CONSTRAINT "subjects_code_unique" UNIQUE ("code")
  );`);
  await sql.unsafe(`CREATE TABLE IF NOT EXISTS "cursos"."course_subject" (
	"id" serial PRIMARY KEY NOT NULL,
	"course_id" integer NOT NULL,
	"subject_id" integer NOT NULL,
	"professor_id" integer,
	"created_at" text DEFAULT (now()::text)
  );`);

  console.log('Migraciones de cursos ejecutadas correctamente');
} finally {
  await sql.end();
}
