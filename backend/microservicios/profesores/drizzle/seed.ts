import postgres from 'postgres';

declare const process: { env: { DATABASE_URL?: string } };

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error('DATABASE_URL is required');

const sql = postgres(connectionString, { max: 1 });

async function seed() {
  const result = await sql`
    UPDATE "profesores"."profesores" SET materia = data.materia_nueva
    FROM (VALUES
      (1, 'Matemáticas'),
      (2, 'Lenguaje'),
      (3, 'Inglés'),
      (4, 'Matemáticas'),
      (5, 'Lenguaje')
    ) AS data(id_prof, materia_nueva)
    WHERE "profesores"."profesores".id = data.id_prof
    RETURNING id, nombre, apellido, materia
  `;
  console.log(`Seed completado: ${result.length} profesores actualizados con su materia.`);
  await sql.end();
}

seed();
