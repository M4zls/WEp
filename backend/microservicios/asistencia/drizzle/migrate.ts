import postgres from 'postgres';

declare const process: { env: { DATABASE_URL?: string } };

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error('DATABASE_URL is required');

const sql = postgres(connectionString, { max: 1 });

try {
  await sql.unsafe('CREATE SCHEMA IF NOT EXISTS "asistencia";');

  await sql.unsafe(`CREATE TABLE IF NOT EXISTS "asistencia"."asistencia" (
    "id" serial PRIMARY KEY NOT NULL,
    "clase_id" integer NOT NULL,
    "curso_asignatura_id" integer NOT NULL,
    "estudiante_rut" text NOT NULL,
    "estudiante_nombre" text NOT NULL,
    "presente" boolean NOT NULL DEFAULT false,
    "justificacion" text,
    "fecha" text NOT NULL DEFAULT (now()::text),
    "created_at" text DEFAULT (now()::text),
    UNIQUE("clase_id", "estudiante_rut")
  );`);

  console.log('Migraciones de asistencia ejecutadas correctamente');
} finally {
  await sql.end();
}
