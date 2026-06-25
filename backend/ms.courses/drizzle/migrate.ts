import postgres from 'postgres';

declare const process: { env: { DATABASE_URL?: string } };

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error('DATABASE_URL is required');

const sql = postgres(connectionString, { max: 1 });

try {
  await sql.unsafe('CREATE SCHEMA IF NOT EXISTS "cursos";');
  await sql.unsafe(`CREATE TABLE IF NOT EXISTS "cursos"."cursos" (
	"id" serial PRIMARY KEY NOT NULL,
	"nombre" text NOT NULL,
	"nivel" text NOT NULL,
	"letra" text NOT NULL,
	"anio" text DEFAULT '2026',
	"fecha_creacion" text DEFAULT (now()::text)
  );`);
  await sql.unsafe(`CREATE TABLE IF NOT EXISTS "cursos"."asignaturas" (
	"id" serial PRIMARY KEY NOT NULL,
	"nombre" text NOT NULL,
	"codigo" text NOT NULL,
	"descripcion" text,
	"fecha_creacion" text DEFAULT (now()::text),
	CONSTRAINT "asignaturas_codigo_unique" UNIQUE ("codigo")
  );`);
  await sql.unsafe(`CREATE TABLE IF NOT EXISTS "cursos"."curso_asignatura" (
	"id" serial PRIMARY KEY NOT NULL,
	"curso_id" integer NOT NULL,
	"asignatura_id" integer NOT NULL,
	"profesor_id" integer,
	"fecha_creacion" text DEFAULT (now()::text)
  );`);

  console.log('Migraciones de cursos ejecutadas correctamente');
} finally {
  await sql.end();
}