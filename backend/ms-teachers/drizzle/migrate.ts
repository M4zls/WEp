import postgres from 'postgres';

declare const process: { env: { DATABASE_URL?: string } };

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error('DATABASE_URL is required');

const sql = postgres(connectionString, { max: 1 });

try {
  await sql.unsafe('CREATE SCHEMA IF NOT EXISTS "teachers";');
  await sql.unsafe(`CREATE TABLE IF NOT EXISTS "teachers"."teachers" (
	"id" serial PRIMARY KEY NOT NULL,
	"rut" text NOT NULL,
	"dv" text NOT NULL,
  "first_name" text NOT NULL,
	"last_name" text NOT NULL,
	"email" text NOT NULL,
	"password" text NOT NULL,
	"phone" text,
	"subject" text NOT NULL,
	"hire_date" text DEFAULT (now()::text),
	CONSTRAINT "teachers_rut_unique" UNIQUE ("rut"),
	CONSTRAINT "teachers_email_unique" UNIQUE ("email")
  );`);
  await sql.unsafe(`CREATE TABLE IF NOT EXISTS "teachers"."availability" (
	"id" serial PRIMARY KEY NOT NULL,
	"professor_id" integer NOT NULL,
	"day" text NOT NULL,
	"start_time" text NOT NULL,
	"end_time" text NOT NULL,
	"type" text NOT NULL,
	"location" text
  );`);
  await sql.unsafe(`CREATE TABLE IF NOT EXISTS "teachers"."schedules" (
	"id" serial PRIMARY KEY NOT NULL,
	"professor_id" integer NOT NULL,
	"day" text NOT NULL,
	"start_time" text NOT NULL,
	"end_time" text NOT NULL,
	"room" text,
	"course_id" text NOT NULL
  );`);
  await sql.unsafe(`CREATE TABLE IF NOT EXISTS "teachers"."lessons" (
	"id" serial PRIMARY KEY NOT NULL,
	"professor_id" integer NOT NULL,
	"course_id" text NOT NULL,
	"subject" text NOT NULL,
	"date" text NOT NULL,
	"topic" text,
	"description" text,
	"room" text
  );`);
  const addFk = async (query: string) => {
    try {
      await sql.unsafe(query);
    } catch (err: any) {
      if (err.code !== '42710') throw err;
    }
  };

  await addFk(`ALTER TABLE "teachers"."availability"
	ADD CONSTRAINT "availability_professor_id_teachers_id_fk"
	FOREIGN KEY ("professor_id") REFERENCES "teachers"."teachers"("id") ON DELETE cascade ON UPDATE no action;`);
  await addFk(`ALTER TABLE "teachers"."schedules"
	ADD CONSTRAINT "schedules_professor_id_teachers_id_fk"
	FOREIGN KEY ("professor_id") REFERENCES "teachers"."teachers"("id") ON DELETE cascade ON UPDATE no action;`);
  await addFk(`ALTER TABLE "teachers"."lessons"
	ADD CONSTRAINT "lessons_professor_id_teachers_id_fk"
	FOREIGN KEY ("professor_id") REFERENCES "teachers"."teachers"("id") ON DELETE cascade ON UPDATE no action;`);

  console.log('Migraciones de profesores ejecutadas correctamente');
} finally {
  await sql.end();
}
