import postgres from 'postgres';

declare const process: { env: { DATABASE_URL?: string } };

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error('DATABASE_URL is required');

const sql = postgres(connectionString, { max: 1 });

const BLOQUES = [
  { startTime: '08:00', endTime: '08:45' },
  { startTime: '08:45', endTime: '09:30' },
  { startTime: '09:45', endTime: '10:30' },
  { startTime: '10:30', endTime: '11:15' },
  { startTime: '11:30', endTime: '12:15' },
  { startTime: '12:15', endTime: '13:00' },
  { startTime: '14:00', endTime: '14:45' },
  { startTime: '14:45', endTime: '15:30' },
  { startTime: '15:30', endTime: '16:00' },
];

const SCHEDULE: [number, number, number][] = [
  // 3°A - Matemáticas (ca_id=1): Lun, Mié, Vie bloques 1-2
  [1, 1, 0], [1, 1, 1],
  [1, 3, 0], [1, 3, 1],
  [1, 5, 0], [1, 5, 1],
  // 3°A - Lenguaje (ca_id=2): Lun, Mar, Jue bloques 3-4
  [2, 1, 2], [2, 1, 3],
  [2, 2, 2], [2, 2, 3],
  [2, 4, 2], [2, 4, 3],
  // 3°A - Inglés (ca_id=3): Mar, Mié, Vie bloques 5-6
  [3, 2, 4], [3, 2, 5],
  [3, 3, 4], [3, 3, 5],
  [3, 5, 4], [3, 5, 5],

  // 3°B - Matemáticas (ca_id=4): Mar, Jue, Vie bloques 1-2
  [4, 2, 0], [4, 2, 1],
  [4, 4, 0], [4, 4, 1],
  [4, 5, 2], [4, 5, 3],
  // 3°B - Lenguaje (ca_id=5): Lun, Mié, Vie bloques 5-6
  [5, 1, 4], [5, 1, 5],
  [5, 3, 2], [5, 3, 3],
  [5, 5, 0], [5, 5, 1],
  // 3°B - Inglés (ca_id=6): Lun, Mar, Jue bloques 1-2
  [6, 1, 0], [6, 1, 1],
  [6, 2, 4], [6, 2, 5],
  [6, 4, 4], [6, 4, 5],

  // 4°A - Matemáticas (ca_id=7): Lun, Mié, Vie bloques 5-6 / 1-2 / 3-4
  [7, 1, 4], [7, 1, 5],
  [7, 3, 0], [7, 3, 1],
  [7, 5, 2], [7, 5, 3],
  // 4°A - Lenguaje (ca_id=8): Mar, Jue, Vie bloques 2-3 / 1-2 / 5-6
  [8, 2, 2], [8, 2, 3],
  [8, 4, 0], [8, 4, 1],
  [8, 5, 4], [8, 5, 5],
  // 4°A - Inglés (ca_id=9): Lun, Mié, Jue bloques 1-2 / 5-6 / 3-4
  [9, 1, 0], [9, 1, 1],
  [9, 3, 4], [9, 3, 5],
  [9, 4, 2], [9, 4, 3],

  // 4°B - Matemáticas (ca_id=10): Mar, Jue, Vie bloques 1-2 / 5-6 / 1-2
  [10, 2, 0], [10, 2, 1],
  [10, 4, 4], [10, 4, 5],
  [10, 5, 0], [10, 5, 1],
  // 4°B - Lenguaje (ca_id=11): Lun, Mié, Vie bloques 3-4 / 3-4 / 5-6
  [11, 1, 2], [11, 1, 3],
  [11, 3, 2], [11, 3, 3],
  [11, 5, 4], [11, 5, 5],
  // 4°B - Inglés (ca_id=12): Lun, Mar, Jue bloques 7-8 / 5-6 / 1-2
  [12, 1, 6], [12, 1, 7],
  [12, 2, 4], [12, 2, 5],
  [12, 4, 0], [12, 4, 1],

  // 5°A - Matemáticas (ca_id=13): Mié, Vie, Mar bloques 1-2 / 1-2 / 7-8
  [13, 3, 0], [13, 3, 1],
  [13, 5, 0], [13, 5, 1],
  [13, 2, 6], [13, 2, 7],
  // 5°A - Lenguaje (ca_id=14): Lun, Jue, Mié bloques 1-2 / 3-4 / 5-6
  [14, 1, 0], [14, 1, 1],
  [14, 4, 2], [14, 4, 3],
  [14, 3, 4], [14, 3, 5],
  // 5°A - Inglés (ca_id=15): Mar, Vie, Jue bloques 1-2 / 5-6 / 1-2
  [15, 2, 0], [15, 2, 1],
  [15, 5, 4], [15, 5, 5],
  [15, 4, 0], [15, 4, 1],

  // 5°B - Matemáticas (ca_id=16): Lun, Mié, Vie bloques 5-6 / 3-4 / 3-4
  [16, 1, 4], [16, 1, 5],
  [16, 3, 2], [16, 3, 3],
  [16, 5, 2], [16, 5, 3],
  // 5°B - Lenguaje (ca_id=17): Mar, Jue, Lun bloques 3-4 / 5-6 / 1-2
  [17, 2, 2], [17, 2, 3],
  [17, 4, 4], [17, 4, 5],
  [17, 1, 0], [17, 1, 1],
  // 5°B - Inglés (ca_id=18): Mié, Vie, Mar bloques 7-8 / 7-8 / 1-2
  [18, 3, 6], [18, 3, 7],
  [18, 5, 6], [18, 5, 7],
  [18, 2, 0], [18, 2, 1],
];

async function seed() {
  try {
    const existing = await sql`SELECT COUNT(*) as count FROM "schedule"."schedules"`;
    if (existing[0].count > 0) {
      console.log('Ya hay horarios cargados, saltando seed.');
      return;
    }

    for (const [caId, dia, bloqueIdx] of SCHEDULE) {
      await sql`
        INSERT INTO "schedule"."schedules" (course_subject_id, week_day, start_time, end_time)
        VALUES (${caId}, ${dia}, ${BLOQUES[bloqueIdx].startTime}, ${BLOQUES[bloqueIdx].endTime})
      `;
    }

    console.log(`Seed completado: ${SCHEDULE.length} bloques horarios creados.`);
  } catch (error) {
    console.error('Error en seed:', error);
  } finally {
    await sql.end();
  }
}

await seed();
