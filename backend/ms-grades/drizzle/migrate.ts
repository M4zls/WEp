import postgres from 'postgres';

declare const process: { env: { DATABASE_URL?: string } };

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error('DATABASE_URL is required');

const sql = postgres(connectionString, { max: 1 });

try {
  await sql.unsafe('CREATE SCHEMA IF NOT EXISTS "grades";');
  await sql.unsafe(`CREATE TABLE IF NOT EXISTS "grades"."grades" (
	"id" serial PRIMARY KEY NOT NULL,
	"estudiante_rut" text NOT NULL,
	"asignatura" text NOT NULL,
	"curso" text NOT NULL,
	"nota" numeric(4,1) NOT NULL,
	"tipo_evaluacion" text NOT NULL,
	"fecha" text NOT NULL,
	"profesor_rut" text NOT NULL,
	"coeficiente" integer NOT NULL DEFAULT 1
  );`);

  try {
    await sql.unsafe(`ALTER TABLE "grades"."grades" ADD COLUMN "coeficiente" integer NOT NULL DEFAULT 1;`);
  } catch {
    // la columna ya existe, ignorar
  }

  try {
    await sql.unsafe(`DROP INDEX IF EXISTS "grades"."uq_notas_estudiante_asignatura";`);
    console.log('Índice único eliminado correctamente');
  } catch {
    // no existe, ignorar
  }

  console.log('Migraciones de notas ejecutadas correctamente');
} finally {
  await sql.end();
}
