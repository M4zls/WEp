import postgres from 'postgres';

declare const process: { env: { DATABASE_URL?: string } };

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error('DATABASE_URL is required');

const sql = postgres(connectionString, { max: 1 });

const NEW_CLASSES = [
  { caId: 6, title: 'Inglés - Vocabulario básico', date: '2026-06-02', startTime: '08:00', endTime: '08:45', status: 'completed' },
  { caId: 6, title: 'Inglés - Comprensión lectora', date: '2026-06-04', startTime: '08:00', endTime: '08:45', status: 'completed' },
  { caId: 6, title: 'Inglés - Gramática', date: '2026-06-09', startTime: '08:00', endTime: '08:45', status: 'pending' },
  { caId: 6, title: 'Inglés - Conversación', date: '2026-06-11', startTime: '08:00', endTime: '08:45', status: 'pending' },
  { caId: 7, title: 'Matemáticas - Álgebra', date: '2026-06-01', startTime: '11:30', endTime: '12:15', status: 'completed' },
  { caId: 7, title: 'Matemáticas - Ecuaciones', date: '2026-06-03', startTime: '11:30', endTime: '12:15', status: 'completed' },
  { caId: 7, title: 'Matemáticas - Geometría', date: '2026-06-08', startTime: '11:30', endTime: '12:15', status: 'pending' },
  { caId: 7, title: 'Matemáticas - Estadística', date: '2026-06-10', startTime: '11:30', endTime: '12:15', status: 'pending' },
  { caId: 8, title: 'Lenguaje - Análisis literario', date: '2026-06-02', startTime: '09:45', endTime: '10:30', status: 'completed' },
  { caId: 8, title: 'Lenguaje - Redacción', date: '2026-06-04', startTime: '09:45', endTime: '10:30', status: 'completed' },
  { caId: 8, title: 'Lenguaje - Ortografía', date: '2026-06-09', startTime: '09:45', endTime: '10:30', status: 'pending' },
  { caId: 8, title: 'Lenguaje - Comprensión', date: '2026-06-11', startTime: '09:45', endTime: '10:30', status: 'pending' },
  { caId: 9, title: 'Inglés - Verbos', date: '2026-06-01', startTime: '08:00', endTime: '08:45', status: 'completed' },
  { caId: 9, title: 'Inglés - Lectura', date: '2026-06-03', startTime: '08:00', endTime: '08:45', status: 'completed' },
  { caId: 9, title: 'Inglés - Escritura', date: '2026-06-08', startTime: '08:00', endTime: '08:45', status: 'pending' },
  { caId: 9, title: 'Inglés - Evaluación', date: '2026-06-10', startTime: '08:00', endTime: '08:45', status: 'pending' },
  { caId: 10, title: 'Matemáticas - Fracciones', date: '2026-06-02', startTime: '08:00', endTime: '08:45', status: 'completed' },
  { caId: 10, title: 'Matemáticas - Decimales', date: '2026-06-04', startTime: '08:00', endTime: '08:45', status: 'completed' },
  { caId: 10, title: 'Matemáticas - Porcentajes', date: '2026-06-09', startTime: '08:00', endTime: '08:45', status: 'pending' },
  { caId: 10, title: 'Matemáticas - Razones', date: '2026-06-11', startTime: '08:00', endTime: '08:45', status: 'pending' },
  { caId: 11, title: 'Lenguaje - Poesía', date: '2026-06-01', startTime: '09:45', endTime: '10:30', status: 'completed' },
  { caId: 11, title: 'Lenguaje - Narrativa', date: '2026-06-05', startTime: '09:45', endTime: '10:30', status: 'completed' },
  { caId: 11, title: 'Lenguaje - Ensayo', date: '2026-06-10', startTime: '09:45', endTime: '10:30', status: 'pending' },
  { caId: 11, title: 'Lenguaje - Debate', date: '2026-06-12', startTime: '09:45', endTime: '10:30', status: 'pending' },
  { caId: 12, title: 'Inglés - Listening', date: '2026-06-01', startTime: '14:00', endTime: '14:45', status: 'completed' },
  { caId: 12, title: 'Inglés - Speaking', date: '2026-06-03', startTime: '14:00', endTime: '14:45', status: 'completed' },
  { caId: 12, title: 'Inglés - Reading', date: '2026-06-08', startTime: '14:00', endTime: '14:45', status: 'pending' },
  { caId: 12, title: 'Inglés - Writing', date: '2026-06-10', startTime: '14:00', endTime: '14:45', status: 'pending' },
  { caId: 13, title: 'Matemáticas - Funciones', date: '2026-06-01', startTime: '08:00', endTime: '08:45', status: 'completed' },
  { caId: 13, title: 'Matemáticas - Derivadas', date: '2026-06-03', startTime: '08:00', endTime: '08:45', status: 'completed' },
  { caId: 13, title: 'Matemáticas - Integrales', date: '2026-06-08', startTime: '08:00', endTime: '08:45', status: 'pending' },
  { caId: 13, title: 'Matemáticas - Probabilidad', date: '2026-06-10', startTime: '08:00', endTime: '08:45', status: 'pending' },
  { caId: 14, title: 'Lenguaje - Literatura', date: '2026-06-02', startTime: '08:00', endTime: '08:45', status: 'completed' },
  { caId: 14, title: 'Lenguaje - Gramática', date: '2026-06-04', startTime: '08:00', endTime: '08:45', status: 'completed' },
  { caId: 14, title: 'Lenguaje - Sintaxis', date: '2026-06-09', startTime: '08:00', endTime: '08:45', status: 'pending' },
  { caId: 14, title: 'Lenguaje - Vocabulario', date: '2026-06-11', startTime: '08:00', endTime: '08:45', status: 'pending' },
  { caId: 15, title: 'Inglés - Advanced vocab', date: '2026-06-02', startTime: '08:00', endTime: '08:45', status: 'completed' },
  { caId: 15, title: 'Inglés - Grammar advanced', date: '2026-06-05', startTime: '08:00', endTime: '08:45', status: 'completed' },
  { caId: 15, title: 'Inglés - Essay writing', date: '2026-06-10', startTime: '08:00', endTime: '08:45', status: 'pending' },
  { caId: 15, title: 'Inglés - Presentation', date: '2026-06-12', startTime: '08:00', endTime: '08:45', status: 'pending' },
  { caId: 16, title: 'Matemáticas - Repaso', date: '2026-06-01', startTime: '11:30', endTime: '12:15', status: 'completed' },
  { caId: 16, title: 'Matemáticas - Ejercicios', date: '2026-06-03', startTime: '11:30', endTime: '12:15', status: 'completed' },
  { caId: 16, title: 'Matemáticas - Evaluación', date: '2026-06-08', startTime: '11:30', endTime: '12:15', status: 'pending' },
  { caId: 16, title: 'Matemáticas - Proyecto', date: '2026-06-10', startTime: '11:30', endTime: '12:15', status: 'pending' },
  { caId: 17, title: 'Lenguaje - Textos', date: '2026-06-02', startTime: '09:45', endTime: '10:30', status: 'completed' },
  { caId: 17, title: 'Lenguaje - Argumentación', date: '2026-06-04', startTime: '09:45', endTime: '10:30', status: 'completed' },
  { caId: 17, title: 'Lenguaje - Informes', date: '2026-06-09', startTime: '09:45', endTime: '10:30', status: 'pending' },
  { caId: 17, title: 'Lenguaje - Exposición', date: '2026-06-11', startTime: '09:45', endTime: '10:30', status: 'pending' },
  { caId: 18, title: 'Inglés - Review', date: '2026-06-01', startTime: '14:00', endTime: '14:45', status: 'completed' },
  { caId: 18, title: 'Inglés - Practice', date: '2026-06-05', startTime: '14:00', endTime: '14:45', status: 'completed' },
  { caId: 18, title: 'Inglés - Test prep', date: '2026-06-10', startTime: '14:00', endTime: '14:45', status: 'pending' },
  { caId: 18, title: 'Inglés - Final project', date: '2026-06-12', startTime: '14:00', endTime: '14:45', status: 'pending' },
];

async function seed() {
  try {
    const existing = await sql`SELECT COUNT(*) as count FROM "clases"."classes"`;
    if (existing[0].count > 23) {
      console.log('Ya hay clases cargadas, saltando seed.');
      return;
    }

    for (const c of NEW_CLASSES) {
      await sql`
        INSERT INTO "clases"."classes" (course_subject_id, title, date, start_time, end_time, status)
        VALUES (${c.caId}, ${c.title}, ${c.date}, ${c.startTime}, ${c.endTime}, ${c.status})
      `;
    }

    console.log(`Seed completado: ${NEW_CLASSES.length} nuevas clases creadas.`);
  } catch (error) {
    console.error('Error en seed:', error);
  } finally {
    await sql.end();
  }
}

await seed();
