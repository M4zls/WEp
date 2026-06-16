import postgres from 'postgres';

declare const process: { env: { DATABASE_URL?: string } };

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error('DATABASE_URL is required');

const sql = postgres(connectionString, { max: 1 });

const ASIGNACIONES: [number, number][] = [
  [1, 1],   // 3°A Matemáticas → Carlos Muñoz (Matemáticas)
  [2, 2],   // 3°A Lenguaje → María López (Lenguaje)
  [3, 3],   // 3°A Inglés → Pedro Ramírez (Inglés)
  [4, 4],   // 3°B Matemáticas → Ana Martínez (Matemáticas)
  [5, 5],   // 3°B Lenguaje → Luis González (Lenguaje)
  [6, 3],   // 3°B Inglés → Pedro Ramírez (Inglés)
  [7, 4],   // 4°A Matemáticas → Ana Martínez (Matemáticas)
  [8, 5],   // 4°A Lenguaje → Luis González (Lenguaje)
  [9, 3],   // 4°A Inglés → Pedro Ramírez (Inglés)
  [10, 1],  // 4°B Matemáticas → Carlos Muñoz (Matemáticas)
  [11, 2],  // 4°B Lenguaje → María López (Lenguaje)
  [12, 3],  // 4°B Inglés → Pedro Ramírez (Inglés)
  [13, 4],  // 5°A Matemáticas → Ana Martínez (Matemáticas)
  [14, 5],  // 5°A Lenguaje → Luis González (Lenguaje)
  [15, 3],  // 5°A Inglés → Pedro Ramírez (Inglés)
  [16, 1],  // 5°B Matemáticas → Carlos Muñoz (Matemáticas)
  [17, 2],  // 5°B Lenguaje → María López (Lenguaje)
  [18, 3],  // 5°B Inglés → Pedro Ramírez (Inglés)
];

async function seed() {
  try {
    let actualizados = 0;
    for (const [caId, profId] of ASIGNACIONES) {
      const result = await sql`
        UPDATE "cursos"."curso_asignatura"
        SET profesor_id = ${profId}
        WHERE id = ${caId}
      `;
      actualizados += result.count;
    }
    console.log(`Seed completado: ${actualizados} curso_asignatura actualizados.`);
  } catch (error) {
    console.error('Error en seed:', error);
  } finally {
    await sql.end();
  }
}

await seed();
