import postgres from 'postgres';

declare const process: { env: { DATABASE_URL?: string } };

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error('DATABASE_URL is required');

const dbName = connectionString.split('/').pop();
const adminUrl = connectionString.replace(/\/[^/]+$/, '/postgres');
const adminSql = postgres(adminUrl, { max: 1 });
try {
  await adminSql.unsafe(`CREATE DATABASE "${dbName}"`);
  console.log(`[db] Database "${dbName}" created`);
} catch (err: any) {
  if (err.code !== '42P04') throw err;
}
await adminSql.end();

const sql = postgres(connectionString, { max: 1 });

try {
  await sql.unsafe('CREATE SCHEMA IF NOT EXISTS "grades";');
  await sql.unsafe(`CREATE TABLE IF NOT EXISTS "grades"."grades" (
	"id" serial PRIMARY KEY NOT NULL,
	"student_rut" text NOT NULL,
	"subject" text NOT NULL,
	"course" text NOT NULL,
	"grade" numeric(4,1) NOT NULL,
	"evaluation_type" text NOT NULL,
	"date" text NOT NULL,
	"professor_rut" text NOT NULL,
	"coefficient" integer NOT NULL DEFAULT 1
  );`);

  try {
    await sql.unsafe(`ALTER TABLE "grades"."grades" ADD COLUMN "coefficient" integer NOT NULL DEFAULT 1;`);
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
