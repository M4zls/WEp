import postgres from 'postgres';

declare const process: { env: { DATABASE_URL?: string } };

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error('DATABASE_URL is required');

const sql = postgres(connectionString, { max: 1 });

async function seed() {
  console.log('--- seeding notifications ---');

  const existing = await sql`SELECT COUNT(*) as count FROM "notifications"."notificaciones"`;
  if (existing[0].count > 0) {
    console.log('notifications already exist, skipping.');
    return;
  }

  await sql`
    INSERT INTO "notifications"."notificaciones" (usuario_id, tipo, titulo, mensaje, leida, fecha_creacion) VALUES
    (23232323, 'asistencia', 'Inasistencia', 'Su hijo Mateo Sánchez faltó a clase de Matemáticas', false, now()::text),
    (23232323, 'nota', 'Nueva Nota', 'Se ha registrado una nueva calificación para Mateo Sánchez', false, (now() + interval '1 hour')::text),
    (23232323, 'mensaje', 'Nuevo Mensaje', 'Tiene un nuevo mensaje del profesor Carlos Muñoz', false, (now() + interval '2 hours')::text)
  `;

  console.log('notifications seeded successfully.');
}

try {
  await seed();
} finally {
  await sql.end();
}
