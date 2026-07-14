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
  await sql.unsafe('CREATE SCHEMA IF NOT EXISTS "classes";');
  await sql.unsafe(`CREATE TABLE IF NOT EXISTS "classes"."classes" (
    "id" serial PRIMARY KEY NOT NULL,
    "course_subject_id" integer NOT NULL,
    "title" text NOT NULL,
    "description" text,
    "date" text NOT NULL,
    "start_time" text NOT NULL,
    "end_time" text NOT NULL,
    "status" text DEFAULT 'pending',
    "created_at" text DEFAULT (now()::text)
  );`);

  await sql.unsafe(`CREATE TABLE IF NOT EXISTS "classes"."schedules" (
    "id" serial PRIMARY KEY NOT NULL,
    "course_subject_id" integer NOT NULL,
    "week_day" integer NOT NULL,
    "start_time" text NOT NULL,
    "end_time" text NOT NULL,
    "created_at" text DEFAULT (now()::text)
  );`);

  console.log('Migraciones de clases ejecutadas correctamente');
} finally {
  await sql.end();
}
