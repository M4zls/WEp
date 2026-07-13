import postgres from 'postgres';

declare const process: { env: { DATABASE_URL?: string } };

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error('DATABASE_URL is required');

const sql = postgres(connectionString, { max: 1 });

async function seed() {
  const existingConversaciones = await sql.unsafe('SELECT COUNT(*) as count FROM "messaging"."conversations"');
  if (Number(existingConversaciones[0]?.count) > 0) {
    console.log('Seed mensajeria: ya existen datos, se omite');
    return;
  }

  const estudiante = { rut: '11111111', firstName: 'Mateo', lastName: 'Sánchez' };
  const profesor = { rut: '12121212', firstName: 'Carlos', lastName: 'Muñoz' };

  const conv = await sql.unsafe(`INSERT INTO "messaging"."conversations" ("created_at") VALUES (now()::text) RETURNING id`);
  const convId = conv[0].id;

  await sql.unsafe(`INSERT INTO "messaging"."conversation_participants" ("conversation_id", "user_id", "user_name", "user_last_name", "user_role") VALUES
    (${convId}, '${estudiante.rut}', '${estudiante.firstName}', '${estudiante.lastName}', 'student'),
    (${convId}, '${profesor.rut}', '${profesor.firstName}', '${profesor.lastName}', 'teacher')
  `);

  await sql.unsafe(`INSERT INTO "messaging"."messages" ("conversation_id", "sender_id", "sender_name", "sender_last_name", "sender_role", "content", "created_at") VALUES
    (${convId}, '${estudiante.rut}', '${estudiante.firstName}', '${estudiante.lastName}', 'student', 'Hola profesor, tengo una consulta sobre la tarea', (now()::text)),
    (${convId}, '${profesor.rut}', '${profesor.firstName}', '${profesor.lastName}', 'teacher', 'Hola, claro dime cu�l es tu duda', ((now() + interval '1 minute')::text)),
    (${convId}, '${estudiante.rut}', '${estudiante.firstName}', '${estudiante.lastName}', 'student', 'No entendi el ejercicio 3, podria explicarmelo?', ((now() + interval '2 minutes')::text)),
    (${convId}, '${profesor.rut}', '${profesor.firstName}', '${profesor.lastName}', 'teacher', 'Claro, mañana despues de clases te explico.', ((now() + interval '3 minutes')::text))
  `);

  console.log('Seed mensajeria: datos de ejemplo insertados correctamente');
}

try {
  await seed();
} finally {
  await sql.end();
}
