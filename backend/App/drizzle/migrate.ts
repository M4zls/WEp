import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error('DATABASE_URL is required');

const sql = postgres(connectionString, { max: 1 });
const db = drizzle(sql);

await sql\CREATE SCHEMA IF NOT EXISTS autentificacion\;
await sql\CREATE SCHEMA IF NOT EXISTS estudiantes\;
await sql\CREATE SCHEMA IF NOT EXISTS profesores\;
await sql\CREATE SCHEMA IF NOT EXISTS cursos\;
await sql\CREATE SCHEMA IF NOT EXISTS notificaciones\;

await migrate(db, { migrationsFolder: './drizzle' });
console.log('Migraciones ejecutadas correctamente');
await sql.end();
