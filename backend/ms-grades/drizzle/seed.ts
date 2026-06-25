import postgres from 'postgres';

declare const process: { env: { DATABASE_URL?: string } };

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error('DATABASE_URL is required');

const sql = postgres(connectionString, { max: 1 });

const NOTAS_SEED = [
  // 3-A - Matemáticas (profesor: Carlos 22222222)
  { studentRut: '23232323', subject: 'Matemáticas', curso: '3°A', grade: '6.5', evaluationType: 'prueba', date: '2026-03-15', professorRut: '22222222', coefficient: 1 },
  { studentRut: '23232323', subject: 'Matemáticas', curso: '3°A', grade: '5.0', evaluationType: 'tarea', date: '2026-04-01', professorRut: '22222222', coefficient: 1 },
  { studentRut: '23232323', subject: 'Matemáticas', curso: '3°A', grade: '4.5', evaluationType: 'prueba_sintesis', date: '2026-06-15', professorRut: '22222222', coefficient: 2 },
  { studentRut: '24242424', subject: 'Matemáticas', curso: '3°A', grade: '4.0', evaluationType: 'prueba', date: '2026-03-15', professorRut: '22222222', coefficient: 1 },
  { studentRut: '24242424', subject: 'Matemáticas', curso: '3°A', grade: '6.0', evaluationType: 'tarea', date: '2026-04-01', professorRut: '22222222', coefficient: 1 },
  { studentRut: '24242424', subject: 'Matemáticas', curso: '3°A', grade: '5.0', evaluationType: 'prueba_sintesis', date: '2026-06-15', professorRut: '22222222', coefficient: 2 },
  { studentRut: '25252525', subject: 'Matemáticas', curso: '3°A', grade: '7.0', evaluationType: 'prueba', date: '2026-03-15', professorRut: '22222222', coefficient: 1 },
  { studentRut: '25252525', subject: 'Matemáticas', curso: '3°A', grade: '6.8', evaluationType: 'tarea', date: '2026-04-01', professorRut: '22222222', coefficient: 1 },
  { studentRut: '25252525', subject: 'Matemáticas', curso: '3°A', grade: '6.0', evaluationType: 'prueba_sintesis', date: '2026-06-15', professorRut: '22222222', coefficient: 2 },
  // 3-A - Lenguaje (profesor: María 33333333)
  { studentRut: '23232323', subject: 'Lenguaje', curso: '3°A', grade: '5.5', evaluationType: 'prueba', date: '2026-03-20', professorRut: '33333333', coefficient: 1 },
  { studentRut: '23232323', subject: 'Lenguaje', curso: '3°A', grade: '6.0', evaluationType: 'trabajo', date: '2026-04-10', professorRut: '33333333', coefficient: 1 },
  { studentRut: '23232323', subject: 'Lenguaje', curso: '3°A', grade: '5.0', evaluationType: 'prueba_sintesis', date: '2026-06-20', professorRut: '33333333', coefficient: 2 },
  { studentRut: '24242424', subject: 'Lenguaje', curso: '3°A', grade: '4.5', evaluationType: 'prueba', date: '2026-03-20', professorRut: '33333333', coefficient: 1 },
  { studentRut: '24242424', subject: 'Lenguaje', curso: '3°A', grade: '5.0', evaluationType: 'trabajo', date: '2026-04-10', professorRut: '33333333', coefficient: 1 },
  { studentRut: '24242424', subject: 'Lenguaje', curso: '3°A', grade: '4.0', evaluationType: 'prueba_sintesis', date: '2026-06-20', professorRut: '33333333', coefficient: 2 },
  { studentRut: '25252525', subject: 'Lenguaje', curso: '3°A', grade: '6.5', evaluationType: 'prueba', date: '2026-03-20', professorRut: '33333333', coefficient: 1 },
  { studentRut: '25252525', subject: 'Lenguaje', curso: '3°A', grade: '7.0', evaluationType: 'trabajo', date: '2026-04-10', professorRut: '33333333', coefficient: 1 },
  { studentRut: '25252525', subject: 'Lenguaje', curso: '3°A', grade: '6.5', evaluationType: 'prueba_sintesis', date: '2026-06-20', professorRut: '33333333', coefficient: 2 },
  // 3-B - Matemáticas (profesor: Ana 55555555)
  { studentRut: '26262626', subject: 'Matemáticas', curso: '3°B', grade: '4.0', evaluationType: 'prueba', date: '2026-03-15', professorRut: '55555555', coefficient: 1 },
  { studentRut: '26262626', subject: 'Matemáticas', curso: '3°B', grade: '5.5', evaluationType: 'tarea', date: '2026-04-01', professorRut: '55555555', coefficient: 1 },
  { studentRut: '27272727', subject: 'Matemáticas', curso: '3°B', grade: '3.5', evaluationType: 'prueba', date: '2026-03-15', professorRut: '55555555', coefficient: 1 },
  { studentRut: '28282828', subject: 'Matemáticas', curso: '3°B', grade: '6.0', evaluationType: 'prueba', date: '2026-03-15', professorRut: '55555555', coefficient: 1 },
  // 4-B - Matemáticas (profesor: Carlos 22222222)
  { studentRut: '32323232', subject: 'Matemáticas', curso: '4°B', grade: '5.5', evaluationType: 'prueba', date: '2026-03-15', professorRut: '22222222', coefficient: 1 },
  { studentRut: '32323232', subject: 'Matemáticas', curso: '4°B', grade: '6.0', evaluationType: 'tarea', date: '2026-04-01', professorRut: '22222222', coefficient: 1 },
  { studentRut: '32323232', subject: 'Matemáticas', curso: '4°B', grade: '4.5', evaluationType: 'prueba_sintesis', date: '2026-06-15', professorRut: '22222222', coefficient: 2 },
  { studentRut: '33333333', subject: 'Matemáticas', curso: '4°B', grade: '4.0', evaluationType: 'prueba', date: '2026-03-15', professorRut: '22222222', coefficient: 1 },
  { studentRut: '33333333', subject: 'Matemáticas', curso: '4°B', grade: '5.0', evaluationType: 'tarea', date: '2026-04-01', professorRut: '22222222', coefficient: 1 },
  { studentRut: '33333333', subject: 'Matemáticas', curso: '4°B', grade: '5.5', evaluationType: 'prueba_sintesis', date: '2026-06-15', professorRut: '22222222', coefficient: 2 },
  { studentRut: '34343434', subject: 'Matemáticas', curso: '4°B', grade: '6.5', evaluationType: 'prueba', date: '2026-03-15', professorRut: '22222222', coefficient: 1 },
  { studentRut: '34343434', subject: 'Matemáticas', curso: '4°B', grade: '7.0', evaluationType: 'tarea', date: '2026-04-01', professorRut: '22222222', coefficient: 1 },
  { studentRut: '34343434', subject: 'Matemáticas', curso: '4°B', grade: '6.0', evaluationType: 'prueba_sintesis', date: '2026-06-15', professorRut: '22222222', coefficient: 2 },
  // 4-B - Lenguaje (profesor: María 33333333)
  { studentRut: '32323232', subject: 'Lenguaje', curso: '4°B', grade: '6.0', evaluationType: 'prueba', date: '2026-03-20', professorRut: '33333333', coefficient: 1 },
  { studentRut: '32323232', subject: 'Lenguaje', curso: '4°B', grade: '5.5', evaluationType: 'trabajo', date: '2026-04-10', professorRut: '33333333', coefficient: 1 },
  { studentRut: '33333333', subject: 'Lenguaje', curso: '4°B', grade: '3.5', evaluationType: 'prueba', date: '2026-03-20', professorRut: '33333333', coefficient: 1 },
  { studentRut: '33333333', subject: 'Lenguaje', curso: '4°B', grade: '4.0', evaluationType: 'trabajo', date: '2026-04-10', professorRut: '33333333', coefficient: 1 },
  { studentRut: '34343434', subject: 'Lenguaje', curso: '4°B', grade: '5.0', evaluationType: 'prueba', date: '2026-03-20', professorRut: '33333333', coefficient: 1 },
  { studentRut: '34343434', subject: 'Lenguaje', curso: '4°B', grade: '6.0', evaluationType: 'trabajo', date: '2026-04-10', professorRut: '33333333', coefficient: 1 },
];

async function seed() {
  try {
    const existing = await sql`SELECT COUNT(*) as count FROM "grades"."grades"`;
    if (existing[0].count > 10) {
      console.log('Ya hay notas cargadas, saltando seed.');
      return;
    }
    for (const n of NOTAS_SEED) {
      await sql`
        INSERT INTO "grades"."grades" (estudiante_rut, asignatura, curso, nota, tipo_evaluacion, fecha, profesor_rut, coeficiente)
        VALUES (${n.studentRut}, ${n.subject}, ${n.curso}, ${n.grade}, ${n.evaluationType}, ${n.date}, ${n.professorRut}, ${n.coefficient})
      `;
    }
    console.log(`Seed completado: ${NOTAS_SEED.length} notas creadas.`);
  } catch (error) {
    console.error('Error en seed:', error);
  } finally {
    await sql.end();
  }
}

await seed();
