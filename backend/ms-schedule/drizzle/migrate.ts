import postgres from 'postgres';

declare const process: { env: { DATABASE_URL?: string } };

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error('DATABASE_URL is required');

const sql = postgres(connectionString, { max: 1 });

try {
  await sql.unsafe('CREATE SCHEMA IF NOT EXISTS "schedule";');

  await sql.unsafe(`CREATE TABLE IF NOT EXISTS "schedule"."schedules" (
    "id" serial PRIMARY KEY NOT NULL,
    "course_subject_id" integer NOT NULL,
    "week_day" integer NOT NULL,
    "start_time" text NOT NULL,
    "end_time" text NOT NULL,
    "created_at" text DEFAULT (now()::text)
  );`);

  console.log('Migraciones de horario ejecutadas correctamente');
} finally {
  await sql.end();
}
