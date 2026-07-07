import postgres from 'postgres';

declare const process: { env: { DATABASE_URL?: string } };

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error('DATABASE_URL is required');

const sql = postgres(connectionString, { max: 1 });

const NEW_CLASSES = [
  { caId: 6, title: 'Matemáticas - Álgebra', date: '2026-07-01', startTime: '11:30', endTime: '12:15', status: 'completed' },
  { caId: 6, title: 'Matemáticas - Ecuaciones', date: '2026-07-03', startTime: '11:30', endTime: '12:15', status: 'completed' },
  { caId: 6, title: 'Matemáticas - Geometría', date: '2026-07-09', startTime: '11:30', endTime: '12:15', status: 'pending' },
  { caId: 6, title: 'Matemáticas - Estadística', date: '2026-07-13', startTime: '11:30', endTime: '12:15', status: 'pending' },
  { caId: 7, title: 'Lenguaje - Análisis literario', date: '2026-07-02', startTime: '09:45', endTime: '10:30', status: 'completed' },
  { caId: 7, title: 'Lenguaje - Redacción', date: '2026-07-07', startTime: '09:45', endTime: '10:30', status: 'completed' },
  { caId: 7, title: 'Lenguaje - Ortografía', date: '2026-07-10', startTime: '09:45', endTime: '10:30', status: 'pending' },
  { caId: 7, title: 'Lenguaje - Comprensión', date: '2026-07-14', startTime: '09:45', endTime: '10:30', status: 'pending' },
  { caId: 8, title: 'Inglés - Vocabulario básico', date: '2026-07-02', startTime: '08:00', endTime: '08:45', status: 'completed' },
  { caId: 8, title: 'Inglés - Comprensión lectora', date: '2026-07-07', startTime: '08:00', endTime: '08:45', status: 'completed' },
  { caId: 8, title: 'Inglés - Gramática', date: '2026-07-10', startTime: '08:00', endTime: '08:45', status: 'pending' },
  { caId: 8, title: 'Inglés - Conversación', date: '2026-07-14', startTime: '08:00', endTime: '08:45', status: 'pending' },
  { caId: 9, title: 'Historia - Civilizaciones', date: '2026-07-02', startTime: '11:30', endTime: '12:15', status: 'completed' },
  { caId: 9, title: 'Historia - Mapas', date: '2026-07-07', startTime: '11:30', endTime: '12:15', status: 'completed' },
  { caId: 9, title: 'Historia - Revoluciones', date: '2026-07-10', startTime: '11:30', endTime: '12:15', status: 'pending' },
  { caId: 9, title: 'Historia - Geografía', date: '2026-07-14', startTime: '11:30', endTime: '12:15', status: 'pending' },
  { caId: 10, title: 'Ciencias - Biología', date: '2026-07-02', startTime: '08:00', endTime: '08:45', status: 'completed' },
  { caId: 10, title: 'Ciencias - Química', date: '2026-07-07', startTime: '08:00', endTime: '08:45', status: 'completed' },
  { caId: 10, title: 'Ciencias - Física', date: '2026-07-10', startTime: '08:00', endTime: '08:45', status: 'pending' },
  { caId: 10, title: 'Ciencias - Laboratorio', date: '2026-07-14', startTime: '08:00', endTime: '08:45', status: 'pending' },
  { caId: 11, title: 'Matemáticas - Funciones', date: '2026-07-01', startTime: '08:00', endTime: '08:45', status: 'completed' },
  { caId: 11, title: 'Matemáticas - Derivadas', date: '2026-07-03', startTime: '08:00', endTime: '08:45', status: 'completed' },
  { caId: 11, title: 'Matemáticas - Integrales', date: '2026-07-09', startTime: '08:00', endTime: '08:45', status: 'pending' },
  { caId: 11, title: 'Matemáticas - Probabilidad', date: '2026-07-13', startTime: '08:00', endTime: '08:45', status: 'pending' },
  { caId: 12, title: 'Lenguaje - Poesía', date: '2026-07-01', startTime: '09:45', endTime: '10:30', status: 'completed' },
  { caId: 12, title: 'Lenguaje - Narrativa', date: '2026-07-08', startTime: '09:45', endTime: '10:30', status: 'completed' },
  { caId: 12, title: 'Lenguaje - Ensayo', date: '2026-07-13', startTime: '09:45', endTime: '10:30', status: 'pending' },
  { caId: 12, title: 'Lenguaje - Debate', date: '2026-07-15', startTime: '09:45', endTime: '10:30', status: 'pending' },
  { caId: 13, title: 'Inglés - Listening', date: '2026-07-01', startTime: '14:00', endTime: '14:45', status: 'completed' },
  { caId: 13, title: 'Inglés - Speaking', date: '2026-07-03', startTime: '14:00', endTime: '14:45', status: 'completed' },
  { caId: 13, title: 'Inglés - Reading', date: '2026-07-09', startTime: '14:00', endTime: '14:45', status: 'pending' },
  { caId: 13, title: 'Inglés - Writing', date: '2026-07-13', startTime: '14:00', endTime: '14:45', status: 'pending' },
  { caId: 14, title: 'Historia - Antigua', date: '2026-07-02', startTime: '08:00', endTime: '08:45', status: 'completed' },
  { caId: 14, title: 'Historia - Medieval', date: '2026-07-07', startTime: '08:00', endTime: '08:45', status: 'completed' },
  { caId: 14, title: 'Historia - Moderna', date: '2026-07-10', startTime: '08:00', endTime: '08:45', status: 'pending' },
  { caId: 14, title: 'Historia - Contemporánea', date: '2026-07-14', startTime: '08:00', endTime: '08:45', status: 'pending' },
  { caId: 15, title: 'Ciencias - Ecología', date: '2026-07-02', startTime: '14:00', endTime: '14:45', status: 'completed' },
  { caId: 15, title: 'Ciencias - Genética', date: '2026-07-07', startTime: '14:00', endTime: '14:45', status: 'completed' },
  { caId: 15, title: 'Ciencias - Energía', date: '2026-07-10', startTime: '14:00', endTime: '14:45', status: 'pending' },
  { caId: 15, title: 'Ciencias - Universo', date: '2026-07-14', startTime: '14:00', endTime: '14:45', status: 'pending' },
  { caId: 16, title: 'Matemáticas - Repaso', date: '2026-07-01', startTime: '11:30', endTime: '12:15', status: 'completed' },
  { caId: 16, title: 'Matemáticas - Ejercicios', date: '2026-07-03', startTime: '11:30', endTime: '12:15', status: 'completed' },
  { caId: 16, title: 'Matemáticas - Evaluación', date: '2026-07-09', startTime: '11:30', endTime: '12:15', status: 'pending' },
  { caId: 16, title: 'Matemáticas - Proyecto', date: '2026-07-13', startTime: '11:30', endTime: '12:15', status: 'pending' },
  { caId: 17, title: 'Lenguaje - Textos', date: '2026-07-02', startTime: '09:45', endTime: '10:30', status: 'completed' },
  { caId: 17, title: 'Lenguaje - Argumentación', date: '2026-07-07', startTime: '09:45', endTime: '10:30', status: 'completed' },
  { caId: 17, title: 'Lenguaje - Informes', date: '2026-07-10', startTime: '09:45', endTime: '10:30', status: 'pending' },
  { caId: 17, title: 'Lenguaje - Exposición', date: '2026-07-14', startTime: '09:45', endTime: '10:30', status: 'pending' },
  { caId: 18, title: 'Inglés - Review', date: '2026-07-01', startTime: '14:00', endTime: '14:45', status: 'completed' },
  { caId: 18, title: 'Inglés - Practice', date: '2026-07-08', startTime: '14:00', endTime: '14:45', status: 'completed' },
  { caId: 18, title: 'Inglés - Test prep', date: '2026-07-13', startTime: '14:00', endTime: '14:45', status: 'pending' },
  { caId: 18, title: 'Inglés - Final project', date: '2026-07-15', startTime: '14:00', endTime: '14:45', status: 'pending' },
];

async function seed() {
  try {
    const existing = await sql`SELECT COUNT(*) as count FROM "classes"."classes"`;
    if (existing[0].count > 23) {
      console.log('Ya hay clases cargadas, saltando seed.');
      return;
    }

    for (const c of NEW_CLASSES) {
      await sql`
        INSERT INTO "classes"."classes" (course_subject_id, title, date, start_time, end_time, status)
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
