import postgres from 'postgres';

declare const process: { env: { DATABASE_URL?: string } };

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error('DATABASE_URL is required');

const sql = postgres(connectionString, { max: 1 });

async function seed() {
  const existingConversaciones = await sql.unsafe('SELECT COUNT(*) as count FROM "messaging"."conversaciones"');
  if (Number(existingConversaciones[0]?.count) > 0) {
    console.log('Seed mensajeria: ya existen datos, se omite');
    return;
  }

  const estudiantes = await sql.unsafe('SELECT rut, nombre, apellido FROM "students"."students" LIMIT 1');
  if (estudiantes.length === 0) {
    console.log('Seed mensajeria: no se encontró estudiante');
    return;
  }
  const estudiante = estudiantes[0];

  const profesores = await sql.unsafe('SELECT rut, nombre, apellido FROM "teachers"."teachers" LIMIT 1');
  if (profesores.length === 0) {
    console.log('Seed mensajeria: no se encontró profesor');
    return;
  }
  const profesor = profesores[0];

  const conv = await sql.unsafe(`INSERT INTO "messaging"."conversaciones" ("created_at") VALUES (now()::text) RETURNING id`);
  const convId = conv[0].id;

  await sql.unsafe(`INSERT INTO "messaging"."conversacion_participantes" ("conversacion_id", "usuario_id", "usuario_nombre", "usuario_apellido", "usuario_rol") VALUES
    (${convId}, '${estudiante.rut}', '${estudiante.nombre}', '${estudiante.apellido}', 'estudiante'),
    (${convId}, '${profesor.rut}', '${profesor.nombre}', '${profesor.apellido}', 'profesor')
  `);

  await sql.unsafe(`INSERT INTO "messaging"."mensajes" ("conversacion_id", "remitente_id", "remitente_nombre", "remitente_apellido", "remitente_rol", "contenido", "created_at") VALUES
    (${convId}, '${estudiante.rut}', '${estudiante.nombre}', '${estudiante.apellido}', 'estudiante', 'Hola profesor, tengo una consulta sobre la tarea', (now()::text)),
    (${convId}, '${profesor.rut}', '${profesor.nombre}', '${profesor.apellido}', 'profesor', 'Hola, claro dime cu�l es tu duda', ((now() + interval '1 minute')::text)),
    (${convId}, '${estudiante.rut}', '${estudiante.nombre}', '${estudiante.apellido}', 'estudiante', 'No entendi el ejercicio 3, podria explicarmelo?', ((now() + interval '2 minutes')::text)),
    (${convId}, '${profesor.rut}', '${profesor.nombre}', '${profesor.apellido}', 'profesor', 'Claro, mañana despues de clases te explico.', ((now() + interval '3 minutes')::text))
  `);

  console.log('Seed mensajeria: datos de ejemplo insertados correctamente');
}

try {
  await seed();
} finally {
  await sql.end();
}
