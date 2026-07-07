import postgres from 'postgres';

declare const process: { env: { DATABASE_URL?: string } };

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error('DATABASE_URL is required');

const sql = postgres(connectionString, { max: 1 });

try {
  await sql.unsafe('CREATE SCHEMA IF NOT EXISTS "messaging";');

  await sql.unsafe(`CREATE TABLE IF NOT EXISTS "messaging"."conversations" (
    "id" serial PRIMARY KEY NOT NULL,
    "created_at" text DEFAULT (now()::text)
  );`);

  await sql.unsafe(`CREATE TABLE IF NOT EXISTS "messaging"."conversation_participants" (
    "id" serial PRIMARY KEY NOT NULL,
    "conversation_id" integer NOT NULL,
    "user_id" text NOT NULL,
    "user_name" text NOT NULL,
    "user_last_name" text NOT NULL,
    "user_role" text NOT NULL
  );`);

  await sql.unsafe(`CREATE TABLE IF NOT EXISTS "messaging"."messages" (
    "id" serial PRIMARY KEY NOT NULL,
    "conversation_id" integer NOT NULL,
    "sender_id" text NOT NULL,
    "sender_name" text NOT NULL,
    "sender_last_name" text NOT NULL,
    "sender_role" text NOT NULL,
    "content" text NOT NULL,
    "read" boolean DEFAULT false,
    "created_at" text DEFAULT (now()::text)
  );`);

  console.log('Migraciones de mensajeria ejecutadas correctamente');
} finally {
  await sql.end();
}
