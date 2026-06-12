import postgres from 'postgres';

declare const process: { env: { DATABASE_URL?: string } };

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error('DATABASE_URL is required');

const sql = postgres(connectionString, { max: 1 });

const NUEVAS_CLASES = [
  // ca_id 6 - 3°B Inglés (bloque 0: 08:00-08:45)
  { caId: 6, titulo: 'Inglés - Vocabulario básico', fecha: '2026-06-02', horaInicio: '08:00', horaTermino: '08:45', estado: 'realizada' },
  { caId: 6, titulo: 'Inglés - Comprensión lectora', fecha: '2026-06-04', horaInicio: '08:00', horaTermino: '08:45', estado: 'realizada' },
  { caId: 6, titulo: 'Inglés - Gramática', fecha: '2026-06-09', horaInicio: '08:00', horaTermino: '08:45', estado: 'pendiente' },
  { caId: 6, titulo: 'Inglés - Conversación', fecha: '2026-06-11', horaInicio: '08:00', horaTermino: '08:45', estado: 'pendiente' },
  // ca_id 7 - 4°A Matemáticas (bloque 4: 11:30-12:15)
  { caId: 7, titulo: 'Matemáticas - Álgebra', fecha: '2026-06-01', horaInicio: '11:30', horaTermino: '12:15', estado: 'realizada' },
  { caId: 7, titulo: 'Matemáticas - Ecuaciones', fecha: '2026-06-03', horaInicio: '11:30', horaTermino: '12:15', estado: 'realizada' },
  { caId: 7, titulo: 'Matemáticas - Geometría', fecha: '2026-06-08', horaInicio: '11:30', horaTermino: '12:15', estado: 'pendiente' },
  { caId: 7, titulo: 'Matemáticas - Estadística', fecha: '2026-06-10', horaInicio: '11:30', horaTermino: '12:15', estado: 'pendiente' },
  // ca_id 8 - 4°A Lenguaje (bloque 2: 09:45-10:30)
  { caId: 8, titulo: 'Lenguaje - Análisis literario', fecha: '2026-06-02', horaInicio: '09:45', horaTermino: '10:30', estado: 'realizada' },
  { caId: 8, titulo: 'Lenguaje - Redacción', fecha: '2026-06-04', horaInicio: '09:45', horaTermino: '10:30', estado: 'realizada' },
  { caId: 8, titulo: 'Lenguaje - Ortografía', fecha: '2026-06-09', horaInicio: '09:45', horaTermino: '10:30', estado: 'pendiente' },
  { caId: 8, titulo: 'Lenguaje - Comprensión', fecha: '2026-06-11', horaInicio: '09:45', horaTermino: '10:30', estado: 'pendiente' },
  // ca_id 9 - 4°A Inglés (bloque 0: 08:00-08:45)
  { caId: 9, titulo: 'Inglés - Verbos', fecha: '2026-06-01', horaInicio: '08:00', horaTermino: '08:45', estado: 'realizada' },
  { caId: 9, titulo: 'Inglés - Lectura', fecha: '2026-06-03', horaInicio: '08:00', horaTermino: '08:45', estado: 'realizada' },
  { caId: 9, titulo: 'Inglés - Escritura', fecha: '2026-06-08', horaInicio: '08:00', horaTermino: '08:45', estado: 'pendiente' },
  { caId: 9, titulo: 'Inglés - Evaluación', fecha: '2026-06-10', horaInicio: '08:00', horaTermino: '08:45', estado: 'pendiente' },
  // ca_id 10 - 4°B Matemáticas (bloque 0: 08:00-08:45)
  { caId: 10, titulo: 'Matemáticas - Fracciones', fecha: '2026-06-02', horaInicio: '08:00', horaTermino: '08:45', estado: 'realizada' },
  { caId: 10, titulo: 'Matemáticas - Decimales', fecha: '2026-06-04', horaInicio: '08:00', horaTermino: '08:45', estado: 'realizada' },
  { caId: 10, titulo: 'Matemáticas - Porcentajes', fecha: '2026-06-09', horaInicio: '08:00', horaTermino: '08:45', estado: 'pendiente' },
  { caId: 10, titulo: 'Matemáticas - Razones', fecha: '2026-06-11', horaInicio: '08:00', horaTermino: '08:45', estado: 'pendiente' },
  // ca_id 11 - 4°B Lenguaje (bloque 2: 09:45-10:30)
  { caId: 11, titulo: 'Lenguaje - Poesía', fecha: '2026-06-01', horaInicio: '09:45', horaTermino: '10:30', estado: 'realizada' },
  { caId: 11, titulo: 'Lenguaje - Narrativa', fecha: '2026-06-05', horaInicio: '09:45', horaTermino: '10:30', estado: 'realizada' },
  { caId: 11, titulo: 'Lenguaje - Ensayo', fecha: '2026-06-10', horaInicio: '09:45', horaTermino: '10:30', estado: 'pendiente' },
  { caId: 11, titulo: 'Lenguaje - Debate', fecha: '2026-06-12', horaInicio: '09:45', horaTermino: '10:30', estado: 'pendiente' },
  // ca_id 12 - 4°B Inglés (bloque 6: 14:00-14:45)
  { caId: 12, titulo: 'Inglés - Listening', fecha: '2026-06-01', horaInicio: '14:00', horaTermino: '14:45', estado: 'realizada' },
  { caId: 12, titulo: 'Inglés - Speaking', fecha: '2026-06-03', horaInicio: '14:00', horaTermino: '14:45', estado: 'realizada' },
  { caId: 12, titulo: 'Inglés - Reading', fecha: '2026-06-08', horaInicio: '14:00', horaTermino: '14:45', estado: 'pendiente' },
  { caId: 12, titulo: 'Inglés - Writing', fecha: '2026-06-10', horaInicio: '14:00', horaTermino: '14:45', estado: 'pendiente' },
  // ca_id 13 - 5°A Matemáticas (bloque 0: 08:00-08:45)
  { caId: 13, titulo: 'Matemáticas - Funciones', fecha: '2026-06-01', horaInicio: '08:00', horaTermino: '08:45', estado: 'realizada' },
  { caId: 13, titulo: 'Matemáticas - Derivadas', fecha: '2026-06-03', horaInicio: '08:00', horaTermino: '08:45', estado: 'realizada' },
  { caId: 13, titulo: 'Matemáticas - Integrales', fecha: '2026-06-08', horaInicio: '08:00', horaTermino: '08:45', estado: 'pendiente' },
  { caId: 13, titulo: 'Matemáticas - Probabilidad', fecha: '2026-06-10', horaInicio: '08:00', horaTermino: '08:45', estado: 'pendiente' },
  // ca_id 14 - 5°A Lenguaje (bloque 0: 08:00-08:45)
  { caId: 14, titulo: 'Lenguaje - Literatura', fecha: '2026-06-02', horaInicio: '08:00', horaTermino: '08:45', estado: 'realizada' },
  { caId: 14, titulo: 'Lenguaje - Gramática', fecha: '2026-06-04', horaInicio: '08:00', horaTermino: '08:45', estado: 'realizada' },
  { caId: 14, titulo: 'Lenguaje - Sintaxis', fecha: '2026-06-09', horaInicio: '08:00', horaTermino: '08:45', estado: 'pendiente' },
  { caId: 14, titulo: 'Lenguaje - Vocabulario', fecha: '2026-06-11', horaInicio: '08:00', horaTermino: '08:45', estado: 'pendiente' },
  // ca_id 15 - 5°A Inglés (bloque 0: 08:00-08:45)
  { caId: 15, titulo: 'Inglés - Advanced vocab', fecha: '2026-06-02', horaInicio: '08:00', horaTermino: '08:45', estado: 'realizada' },
  { caId: 15, titulo: 'Inglés - Grammar advanced', fecha: '2026-06-05', horaInicio: '08:00', horaTermino: '08:45', estado: 'realizada' },
  { caId: 15, titulo: 'Inglés - Essay writing', fecha: '2026-06-10', horaInicio: '08:00', horaTermino: '08:45', estado: 'pendiente' },
  { caId: 15, titulo: 'Inglés - Presentation', fecha: '2026-06-12', horaInicio: '08:00', horaTermino: '08:45', estado: 'pendiente' },
  // ca_id 16 - 5°B Matemáticas (bloque 4: 11:30-12:15)
  { caId: 16, titulo: 'Matemáticas - Repaso', fecha: '2026-06-01', horaInicio: '11:30', horaTermino: '12:15', estado: 'realizada' },
  { caId: 16, titulo: 'Matemáticas - Ejercicios', fecha: '2026-06-03', horaInicio: '11:30', horaTermino: '12:15', estado: 'realizada' },
  { caId: 16, titulo: 'Matemáticas - Evaluación', fecha: '2026-06-08', horaInicio: '11:30', horaTermino: '12:15', estado: 'pendiente' },
  { caId: 16, titulo: 'Matemáticas - Proyecto', fecha: '2026-06-10', horaInicio: '11:30', horaTermino: '12:15', estado: 'pendiente' },
  // ca_id 17 - 5°B Lenguaje (bloque 2: 09:45-10:30)
  { caId: 17, titulo: 'Lenguaje - Textos', fecha: '2026-06-02', horaInicio: '09:45', horaTermino: '10:30', estado: 'realizada' },
  { caId: 17, titulo: 'Lenguaje - Argumentación', fecha: '2026-06-04', horaInicio: '09:45', horaTermino: '10:30', estado: 'realizada' },
  { caId: 17, titulo: 'Lenguaje - Informes', fecha: '2026-06-09', horaInicio: '09:45', horaTermino: '10:30', estado: 'pendiente' },
  { caId: 17, titulo: 'Lenguaje - Exposición', fecha: '2026-06-11', horaInicio: '09:45', horaTermino: '10:30', estado: 'pendiente' },
  // ca_id 18 - 5°B Inglés (bloque 6: 14:00-14:45)
  { caId: 18, titulo: 'Inglés - Review', fecha: '2026-06-01', horaInicio: '14:00', horaTermino: '14:45', estado: 'realizada' },
  { caId: 18, titulo: 'Inglés - Practice', fecha: '2026-06-05', horaInicio: '14:00', horaTermino: '14:45', estado: 'realizada' },
  { caId: 18, titulo: 'Inglés - Test prep', fecha: '2026-06-10', horaInicio: '14:00', horaTermino: '14:45', estado: 'pendiente' },
  { caId: 18, titulo: 'Inglés - Final project', fecha: '2026-06-12', horaInicio: '14:00', horaTermino: '14:45', estado: 'pendiente' },
];

async function seed() {
  const existing = await sql`SELECT COUNT(*) as count FROM "clases"."clases"`;
  if (existing[0].count > 23) {
    console.log('Ya hay clases cargadas, saltando seed.');
    await sql.end();
    return;
  }

  for (const c of NUEVAS_CLASES) {
    await sql`
      INSERT INTO "clases"."clases" (curso_asignatura_id, titulo, fecha, hora_inicio, hora_termino, estado)
      VALUES (${c.caId}, ${c.titulo}, ${c.fecha}, ${c.horaInicio}, ${c.horaTermino}, ${c.estado})
    `;
  }

  console.log(`Seed completado: ${NUEVAS_CLASES.length} nuevas clases creadas.`);
  await sql.end();
}

seed();
