import { defineConfig } from 'drizzle-kit';


declare const process: { env: { DATABASE_URL?: string } };

export default defineConfig({
  schema: [
    'microservicios/autentificacion/src/models/schema.ts',
    'microservicios/estudiantes/src/models/schema.ts',
    'microservicios/profesores/src/models/schema.ts',
    'microservicios/notificaciones/src/models/schema.ts',
    'microservicios/cursos/src/models/schema.ts',
  ],
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL || 'postgresql://postgres:jLbLVgY8ukMzlvxQ@db.jcuqsvuovbhwyetwxrgu.supabase.co:5432/postgres',
  },
});