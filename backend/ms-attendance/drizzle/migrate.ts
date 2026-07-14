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
  await sql.unsafe('CREATE SCHEMA IF NOT EXISTS "attendance";');

  await sql.unsafe(`CREATE TABLE IF NOT EXISTS "attendance"."attendance" (
    "id" serial PRIMARY KEY NOT NULL,
    "class_id" integer NOT NULL,
    "course_subject_id" integer NOT NULL,
    "student_rut" text NOT NULL,
    "student_name" text NOT NULL,
    "present" boolean NOT NULL DEFAULT false,
    "justification" text,
    "date" text NOT NULL DEFAULT (now()::text),
    "created_at" text DEFAULT (now()::text),
    UNIQUE("class_id", "student_rut")
  );`);

  console.log('Migraciones de asistencia ejecutadas correctamente');
} finally {
  await sql.end();
}
