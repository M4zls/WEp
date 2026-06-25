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
	"nombre" text NOT NULL,
	"apellido" text NOT NULL,
	"email" text NOT NULL,
	"password" text NOT NULL,
	"telefono" text,
	"materia" text NOT NULL,
	"fecha_ingreso" text DEFAULT (now()::text),
	CONSTRAINT "teachers_rut_unique" UNIQUE ("rut"),
	CONSTRAINT "teachers_email_unique" UNIQUE ("email")
  );`);
  await sql.unsafe(`CREATE TABLE IF NOT EXISTS "teachers"."disponibilidad" (
	"id" serial PRIMARY KEY NOT NULL,
	"profesor_id" integer NOT NULL,
	"dia" text NOT NULL,
	"hora_inicio" text NOT NULL,
	"hora_fin" text NOT NULL,
	"tipo" text NOT NULL,
	"ubicacion" text
  );`);
  await sql.unsafe(`CREATE TABLE IF NOT EXISTS "teachers"."horarios" (
	"id" serial PRIMARY KEY NOT NULL,
	"profesor_id" integer NOT NULL,
	"dia" text NOT NULL,
	"hora_inicio" text NOT NULL,
	"hora_fin" text NOT NULL,
	"sala" text,
	"curso_id" text NOT NULL
  );`);
  await sql.unsafe(`CREATE TABLE IF NOT EXISTS "teachers"."clases" (
	"id" serial PRIMARY KEY NOT NULL,
	"profesor_id" integer NOT NULL,
	"curso_id" text NOT NULL,
	"materia" text NOT NULL,
	"fecha" text NOT NULL,
	"tema" text,
	"descripcion" text,
	"sala" text
  );`);
  const addFk = async (query: string) => {
    try {
      await sql.unsafe(query);
    } catch (err: any) {
      if (err.code !== '42710') throw err;
    }
  };

  await addFk(`ALTER TABLE "teachers"."disponibilidad"
	ADD CONSTRAINT "disponibilidad_profesor_id_teachers_id_fk"
	FOREIGN KEY ("profesor_id") REFERENCES "teachers"."teachers"("id") ON DELETE cascade ON UPDATE no action;`);
  await addFk(`ALTER TABLE "teachers"."horarios"
	ADD CONSTRAINT "horarios_profesor_id_teachers_id_fk"
	FOREIGN KEY ("profesor_id") REFERENCES "teachers"."teachers"("id") ON DELETE cascade ON UPDATE no action;`);
  await addFk(`ALTER TABLE "teachers"."clases"
	ADD CONSTRAINT "clases_profesor_id_teachers_id_fk"
	FOREIGN KEY ("profesor_id") REFERENCES "teachers"."teachers"("id") ON DELETE cascade ON UPDATE no action;`);

  console.log('Migraciones de profesores ejecutadas correctamente');
} finally {
  await sql.end();
}
