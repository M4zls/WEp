import postgres from 'postgres';

declare const process: { env: { DATABASE_URL?: string } };

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error('DATABASE_URL is required');

const sql = postgres(connectionString, { max: 1 });

try {
  await sql.unsafe('CREATE SCHEMA IF NOT EXISTS "profesores";');
  await sql.unsafe(`CREATE TABLE IF NOT EXISTS "profesores"."profesores" (
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
	CONSTRAINT "profesores_rut_unique" UNIQUE ("rut"),
	CONSTRAINT "profesores_email_unique" UNIQUE ("email")
  );`);
  await sql.unsafe(`CREATE TABLE IF NOT EXISTS "profesores"."disponibilidad" (
	"id" serial PRIMARY KEY NOT NULL,
	"profesor_id" integer NOT NULL,
	"dia" text NOT NULL,
	"hora_inicio" text NOT NULL,
	"hora_fin" text NOT NULL,
	"tipo" text NOT NULL,
	"ubicacion" text
  );`);
  await sql.unsafe(`CREATE TABLE IF NOT EXISTS "profesores"."horarios" (
	"id" serial PRIMARY KEY NOT NULL,
	"profesor_id" integer NOT NULL,
	"dia" text NOT NULL,
	"hora_inicio" text NOT NULL,
	"hora_fin" text NOT NULL,
	"sala" text,
	"curso_id" text NOT NULL
  );`);
  await sql.unsafe(`CREATE TABLE IF NOT EXISTS "profesores"."clases" (
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

  await addFk(`ALTER TABLE "profesores"."disponibilidad"
	ADD CONSTRAINT "disponibilidad_profesor_id_profesores_id_fk"
	FOREIGN KEY ("profesor_id") REFERENCES "profesores"."profesores"("id") ON DELETE cascade ON UPDATE no action;`);
  await addFk(`ALTER TABLE "profesores"."horarios"
	ADD CONSTRAINT "horarios_profesor_id_profesores_id_fk"
	FOREIGN KEY ("profesor_id") REFERENCES "profesores"."profesores"("id") ON DELETE cascade ON UPDATE no action;`);
  await addFk(`ALTER TABLE "profesores"."clases"
	ADD CONSTRAINT "clases_profesor_id_profesores_id_fk"
	FOREIGN KEY ("profesor_id") REFERENCES "profesores"."profesores"("id") ON DELETE cascade ON UPDATE no action;`);

  console.log('Migraciones de profesores ejecutadas correctamente');
} finally {
  await sql.end();
}