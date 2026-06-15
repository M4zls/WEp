import postgres from 'postgres';

declare const process: { env: { DATABASE_URL?: string } };

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error('DATABASE_URL is required');

const sql = postgres(connectionString, { max: 1 });

try {
  const existingConversaciones = await sql.unsafe('SELECT COUNT(*) as count FROM "mensajeria"."conversaciones"');
  if (Number(existingConversaciones[0]?.count) > 0) {
    console.log('Seed mensajeria: ya existen datos, se omite');
    return;
  }

  // Get student: Benjamin Soto (12121212)
  const estudiantes = await sql.unsafe('SELECT rut, nombre, apellido FROM "estudiantes"."estudiantes" WHERE rut = \'12121212\' LIMIT 1');
  if (estudiantes.length === 0) {
    console.log('Seed mensajeria: no se encontró estudiante de prueba');
    return;
  }
  const estudiante = estudiantes[0];

  // Get professor: Carlos Muñoz (who teaches Matematicas)
  const profesores = await sql.unsafe('SELECT rut, nombre, apellido FROM "profesores"."profesores" WHERE materia ILIKE \'%matem%\' LIMIT 1');
  if (profesores.length === 0) {
    console.log('Seed mensajeria: no se encontró profesor de matemáticas');
    return;
  }
  const profesor = profesores[0];

  // Create conversation
  const conv = await sql.unsafe(`INSERT INTO "mensajeria"."conversaciones" ("created_at") VALUES (now()::text) RETURNING id`);
  const convId = conv[0].id;

  // Add participants
  await sql.unsafe(`INSERT INTO "mensajeria"."conversacion_participantes" ("conversacion_id", "usuario_id", "usuario_nombre", "usuario_apellido", "usuario_rol") VALUES
    (${convId}, '${estudiante.rut}', '${estudiante.nombre}', '${estudiante.apellido}', 'estudiante'),
    (${convId}, '${profesor.rut}', '${profesor.nombre}', '${profesor.apellido}', 'profesor')
  `);

  // Add some sample messages
  await sql.unsafe(`INSERT INTO "mensajeria"."mensajes" ("conversacion_id", "remitente_id", "remitente_nombre", "remitente_apellido", "remitente_rol", "contenido", "created_at") VALUES
    (${convId}, '${estudiante.rut}', '${estudiante.nombre}', '${estudiante.apellido}', 'estudiante', 'Hola profesor, tengo una consulta sobre la tarea de matemáticas', (now()::text)),
    (${convId}, '${profesor.rut}', '${profesor.nombre}', '${profesor.apellido}', 'profesor', 'Hola Benjamin, claro dime cuál es tu duda', (now()::text + ' interval '1 minute')),
    (${convId}, '${estudiante.rut}', '${estudiante.nombre}', '${estudiante.apellido}', 'estudiante', 'No entendí el ejercicio 3 de la guía, podría explicármelo?', (now()::text + ' interval '2 minutes')),
    (${convId}, '${profesor.rut}', '${profesor.nombre}', '${profesor.apellido}', 'profesor', 'Claro, mañana después de clases te explico. Tráeme la guía.', (now()::text + ' interval '3 minutes'))
  `);

  console.log('Seed mensajeria: datos de ejemplo insertados correctamente');
} finally {
  await sql.end();
}
