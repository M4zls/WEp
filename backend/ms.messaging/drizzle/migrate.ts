import postgres from 'postgres';

declare const process: { env: { DATABASE_URL?: string } };

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error('DATABASE_URL is required');

const sql = postgres(connectionString, { max: 1 });

try {
  await sql.unsafe('CREATE SCHEMA IF NOT EXISTS "mensajeria";');

  await sql.unsafe(`CREATE TABLE IF NOT EXISTS "mensajeria"."conversaciones" (
    "id" serial PRIMARY KEY NOT NULL,
    "created_at" text DEFAULT (now()::text)
  );`);

  await sql.unsafe(`CREATE TABLE IF NOT EXISTS "mensajeria"."conversacion_participantes" (
    "id" serial PRIMARY KEY NOT NULL,
    "conversacion_id" integer NOT NULL,
    "usuario_id" text NOT NULL,
    "usuario_nombre" text NOT NULL,
    "usuario_apellido" text NOT NULL,
    "usuario_rol" text NOT NULL
  );`);

  await sql.unsafe(`CREATE TABLE IF NOT EXISTS "mensajeria"."mensajes" (
    "id" serial PRIMARY KEY NOT NULL,
    "conversacion_id" integer NOT NULL,
    "remitente_id" text NOT NULL,
    "remitente_nombre" text NOT NULL,
    "remitente_apellido" text NOT NULL,
    "remitente_rol" text NOT NULL,
    "contenido" text NOT NULL,
    "leido" boolean DEFAULT false,
    "created_at" text DEFAULT (now()::text)
  );`);

  console.log('Migraciones de mensajeria ejecutadas correctamente');
} finally {
  await sql.end();
}
