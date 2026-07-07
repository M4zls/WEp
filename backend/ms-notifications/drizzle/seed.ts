import postgres from 'postgres';

declare const process: { env: { DATABASE_URL?: string } };

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error('DATABASE_URL is required');

const sql = postgres(connectionString, { max: 1 });

async function seed() {
  console.log('--- seeding notifications ---');

  const existing = await sql`SELECT COUNT(*) as count FROM "notifications"."notifications"`;
  if (existing[0].count > 0) {
    console.log('notifications already exist, skipping.');
    return;
  }

  const studentId = 1;

  await sql`
    INSERT INTO "notifications"."notifications" (user_id, type, title, message, read, created_at) VALUES
    (${studentId}, 'attendance', 'Inasistencia', 'Su hijo Mateo Sánchez faltó a clase de Matemáticas', false, now()::text),
    (${studentId}, 'grade', 'Nueva Nota', 'Se ha registrado una nueva calificación para Mateo Sánchez', false, (now() + interval '1 hour')::text),
    (${studentId}, 'message', 'Nuevo Mensaje', 'Tiene un nuevo mensaje del profesor Carlos Muñoz', false, (now() + interval '2 hours')::text)
  `;

  console.log('notifications seeded successfully.');
}

try {
  await seed();
} finally {
  await sql.end();
}
