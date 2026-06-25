import postgres from 'postgres';

declare const process: { env: { DATABASE_URL?: string } };

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error('DATABASE_URL is required');

const sql = postgres(connectionString, { max: 1 });

const ASSIGNMENTS: [number, number][] = [
  [1, 1],
  [2, 2],
  [3, 3],
  [4, 4],
  [5, 5],
  [6, 3],
  [7, 4],
  [8, 5],
  [9, 3],
  [10, 1],
  [11, 2],
  [12, 3],
  [13, 4],
  [14, 5],
  [15, 3],
  [16, 1],
  [17, 2],
  [18, 3],
];

async function seed() {
  try {
    let updated = 0;
    for (const [caId, profId] of ASSIGNMENTS) {
      const result = await sql`
        UPDATE "cursos"."course_subject"
        SET professor_id = ${profId}
        WHERE id = ${caId}
      `;
      updated += result.count;
    }
    console.log(`Seed completado: ${updated} course_subject actualizados.`);
  } catch (error) {
    console.error('Error en seed:', error);
  } finally {
    await sql.end();
  }
}

await seed();
