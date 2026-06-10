import postgres from 'postgres';

declare const process: { env: { DATABASE_URL?: string } };

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error('DATABASE_URL is required');

const sql = postgres(connectionString, { max: 1 });

try {
  await sql.unsafe('CREATE SCHEMA IF NOT EXISTS "clases";');
  await sql.unsafe(`CREATE TABLE IF NOT EXISTS "clases"."clases" (
    "id" serial PRIMARY KEY NOT NULL,
    "curso_asignatura_id" integer NOT NULL,
    "titulo" text NOT NULL,
    "descripcion" text,
    "fecha" text NOT NULL,
    "hora_inicio" text NOT NULL,
    "hora_termino" text NOT NULL,
    "estado" text DEFAULT 'pendiente',
    "created_at" text DEFAULT (now()::text)
  );`);

  await sql.unsafe(`CREATE TABLE IF NOT EXISTS "clases"."horarios" (
    "id" serial PRIMARY KEY NOT NULL,
    "curso_asignatura_id" integer NOT NULL,
    "dia_semana" integer NOT NULL,
    "hora_inicio" text NOT NULL,
    "hora_termino" text NOT NULL,
    "created_at" text DEFAULT (now()::text)
  );`);

  console.log('Migraciones de clases ejecutadas correctamente');
} finally {
  await sql.end();
}
