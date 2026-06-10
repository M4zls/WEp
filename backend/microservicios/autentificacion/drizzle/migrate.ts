import postgres from 'postgres';

declare const process: { env: { DATABASE_URL?: string } };

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error('DATABASE_URL is required');

const sql = postgres(connectionString, { max: 1 });

try {
  await sql.unsafe('CREATE SCHEMA IF NOT EXISTS "autentificacion";');
  await sql.unsafe(`CREATE TABLE IF NOT EXISTS "autentificacion"."usuarios" (
	"id" serial PRIMARY KEY NOT NULL,
	"rut" text NOT NULL,
	"dv" text NOT NULL,
	"nombre" text NOT NULL,
	"apellido" text NOT NULL,
	"email" text NOT NULL,
	"password" text NOT NULL,
	"rol" text NOT NULL DEFAULT 'estudiante',
	"activo" boolean DEFAULT true,
	"fecha_creacion" text DEFAULT (now()::text),
	CONSTRAINT "usuarios_rut_unique" UNIQUE ("rut"),
	CONSTRAINT "usuarios_email_unique" UNIQUE ("email")
  );`);
  await sql.unsafe(`CREATE TABLE IF NOT EXISTS "autentificacion"."sesiones" (
	"id" serial PRIMARY KEY NOT NULL,
	"usuario_id" integer NOT NULL,
	"token" text NOT NULL,
	"expires_at" text NOT NULL,
	"created_at" text DEFAULT (now()::text),
	CONSTRAINT "sesiones_token_unique" UNIQUE ("token")
  );`);
  await sql.unsafe(`CREATE TABLE IF NOT EXISTS "autentificacion"."tokens_recuperacion" (
	"id" serial PRIMARY KEY NOT NULL,
	"usuario_id" integer NOT NULL,
	"token" text NOT NULL,
	"expires_at" text NOT NULL,
	"usado" boolean DEFAULT false,
	"created_at" text DEFAULT (now()::text),
	CONSTRAINT "tokens_recuperacion_token_unique" UNIQUE ("token")
  );`);
  await sql.unsafe(`CREATE TABLE IF NOT EXISTS "autentificacion"."permisos" (
	"id" serial PRIMARY KEY NOT NULL,
	"usuario_id" integer NOT NULL,
	"modulo" text NOT NULL,
	"lectura" boolean DEFAULT false,
	"escritura" boolean DEFAULT false,
	"eliminacion" boolean DEFAULT false
  );`);
  const addFk = async (query: string) => {
    try {
      await sql.unsafe(query);
    } catch (err: any) {
      if (err.code !== '42710') throw err;
    }
  };

  await addFk(`ALTER TABLE "autentificacion"."sesiones"
	ADD CONSTRAINT "sesiones_usuario_id_usuarios_id_fk"
	FOREIGN KEY ("usuario_id") REFERENCES "autentificacion"."usuarios"("id") ON DELETE cascade ON UPDATE no action;`);
  await addFk(`ALTER TABLE "autentificacion"."tokens_recuperacion"
	ADD CONSTRAINT "tokens_recuperacion_usuario_id_usuarios_id_fk"
	FOREIGN KEY ("usuario_id") REFERENCES "autentificacion"."usuarios"("id") ON DELETE cascade ON UPDATE no action;`);
  await addFk(`ALTER TABLE "autentificacion"."permisos"
	ADD CONSTRAINT "permisos_usuario_id_usuarios_id_fk"
	FOREIGN KEY ("usuario_id") REFERENCES "autentificacion"."usuarios"("id") ON DELETE cascade ON UPDATE no action;`);

  console.log('Migraciones de autentificacion ejecutadas correctamente');
} finally {
  await sql.end();
}