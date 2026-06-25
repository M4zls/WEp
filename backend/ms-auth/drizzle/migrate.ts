import postgres from 'postgres';

declare const process: { env: { DATABASE_URL?: string } };

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error('DATABASE_URL is required');

const sql = postgres(connectionString, { max: 1 });

try {
  await sql.unsafe('CREATE SCHEMA IF NOT EXISTS "auth";');
  await sql.unsafe(`CREATE TABLE IF NOT EXISTS "auth"."users" (
	"id" serial PRIMARY KEY NOT NULL,
	"rut" text NOT NULL,
	"dv" text NOT NULL,
	"nombre" text NOT NULL,
	"apellido" text NOT NULL,
	"email" text NOT NULL,
	"password" text NOT NULL,
	"rol" text NOT NULL DEFAULT 'estudiante',
	"activo" boolean DEFAULT true,
	"created_at" text DEFAULT (now()::text),
	CONSTRAINT "users_rut_unique" UNIQUE ("rut"),
	CONSTRAINT "users_email_unique" UNIQUE ("email")
  );`);
  await sql.unsafe(`CREATE TABLE IF NOT EXISTS "auth"."sessions" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"token" text NOT NULL,
	"expires_at" text NOT NULL,
	"created_at" text DEFAULT (now()::text),
	CONSTRAINT "sessions_token_unique" UNIQUE ("token")
  );`);
  await sql.unsafe(`CREATE TABLE IF NOT EXISTS "auth"."recovery_tokens" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"token" text NOT NULL,
	"expires_at" text NOT NULL,
	"usado" boolean DEFAULT false,
	"created_at" text DEFAULT (now()::text),
	CONSTRAINT "recovery_tokens_token_unique" UNIQUE ("token")
  );`);
  await sql.unsafe(`CREATE TABLE IF NOT EXISTS "auth"."permissions" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"modulo" text NOT NULL,
	"read" boolean DEFAULT false,
	"write" boolean DEFAULT false,
	"delete" boolean DEFAULT false
  );`);
  const addFk = async (query: string) => {
    try {
      await sql.unsafe(query);
    } catch (err: any) {
      if (err.code !== '42710') throw err;
    }
  };

  await addFk(`ALTER TABLE "auth"."sessions"
	ADD CONSTRAINT "sessions_user_id_users_id_fk"
	FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE no action;`);
  await addFk(`ALTER TABLE "auth"."recovery_tokens"
	ADD CONSTRAINT "recovery_tokens_user_id_users_id_fk"
	FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE no action;`);
  await addFk(`ALTER TABLE "auth"."permissions"
	ADD CONSTRAINT "permissions_user_id_users_id_fk"
	FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE no action;`);

  console.log('Migraciones de auth ejecutadas correctamente');
} finally {
  await sql.end();
}
