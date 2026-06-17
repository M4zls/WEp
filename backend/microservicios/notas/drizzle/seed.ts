import postgres from 'postgres';

declare const process: { env: { DATABASE_URL?: string } };

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error('DATABASE_URL is required');

const sql = postgres(connectionString, { max: 1 });

const NOTAS_SEED = [
  // 3°A - Matemáticas
  { estudianteRut: '23232323', asignatura: 'Matemáticas', curso: '3°A', nota: '6.5', tipoEvaluacion: 'prueba', fecha: '2026-03-15', profesorRut: '11111111', coeficiente: 1 },
  { estudianteRut: '23232323', asignatura: 'Matemáticas', curso: '3°A', nota: '5.0', tipoEvaluacion: 'tarea', fecha: '2026-04-01', profesorRut: '11111111', coeficiente: 1 },
  { estudianteRut: '23232323', asignatura: 'Matemáticas', curso: '3°A', nota: '4.5', tipoEvaluacion: 'prueba_sintesis', fecha: '2026-06-15', profesorRut: '11111111', coeficiente: 2 },
  { estudianteRut: '24242424', asignatura: 'Matemáticas', curso: '3°A', nota: '4.0', tipoEvaluacion: 'prueba', fecha: '2026-03-15', profesorRut: '11111111', coeficiente: 1 },
  { estudianteRut: '24242424', asignatura: 'Matemáticas', curso: '3°A', nota: '6.0', tipoEvaluacion: 'tarea', fecha: '2026-04-01', profesorRut: '11111111', coeficiente: 1 },
  { estudianteRut: '24242424', asignatura: 'Matemáticas', curso: '3°A', nota: '5.0', tipoEvaluacion: 'prueba_sintesis', fecha: '2026-06-15', profesorRut: '11111111', coeficiente: 2 },
  { estudianteRut: '25252525', asignatura: 'Matemáticas', curso: '3°A', nota: '7.0', tipoEvaluacion: 'prueba', fecha: '2026-03-15', profesorRut: '11111111', coeficiente: 1 },
  { estudianteRut: '25252525', asignatura: 'Matemáticas', curso: '3°A', nota: '6.8', tipoEvaluacion: 'tarea', fecha: '2026-04-01', profesorRut: '11111111', coeficiente: 1 },
  { estudianteRut: '25252525', asignatura: 'Matemáticas', curso: '3°A', nota: '6.0', tipoEvaluacion: 'prueba_sintesis', fecha: '2026-06-15', profesorRut: '11111111', coeficiente: 2 },
  // 3°A - Lenguaje
  { estudianteRut: '23232323', asignatura: 'Lenguaje', curso: '3°A', nota: '5.5', tipoEvaluacion: 'prueba', fecha: '2026-03-20', profesorRut: '22222222', coeficiente: 1 },
  { estudianteRut: '23232323', asignatura: 'Lenguaje', curso: '3°A', nota: '6.0', tipoEvaluacion: 'trabajo', fecha: '2026-04-10', profesorRut: '22222222', coeficiente: 1 },
  { estudianteRut: '23232323', asignatura: 'Lenguaje', curso: '3°A', nota: '5.0', tipoEvaluacion: 'prueba_sintesis', fecha: '2026-06-20', profesorRut: '22222222', coeficiente: 2 },
  { estudianteRut: '24242424', asignatura: 'Lenguaje', curso: '3°A', nota: '4.5', tipoEvaluacion: 'prueba', fecha: '2026-03-20', profesorRut: '22222222', coeficiente: 1 },
  { estudianteRut: '24242424', asignatura: 'Lenguaje', curso: '3°A', nota: '5.0', tipoEvaluacion: 'trabajo', fecha: '2026-04-10', profesorRut: '22222222', coeficiente: 1 },
  { estudianteRut: '24242424', asignatura: 'Lenguaje', curso: '3°A', nota: '4.0', tipoEvaluacion: 'prueba_sintesis', fecha: '2026-06-20', profesorRut: '22222222', coeficiente: 2 },
  { estudianteRut: '25252525', asignatura: 'Lenguaje', curso: '3°A', nota: '6.5', tipoEvaluacion: 'prueba', fecha: '2026-03-20', profesorRut: '22222222', coeficiente: 1 },
  { estudianteRut: '25252525', asignatura: 'Lenguaje', curso: '3°A', nota: '7.0', tipoEvaluacion: 'trabajo', fecha: '2026-04-10', profesorRut: '22222222', coeficiente: 1 },
  { estudianteRut: '25252525', asignatura: 'Lenguaje', curso: '3°A', nota: '6.5', tipoEvaluacion: 'prueba_sintesis', fecha: '2026-06-20', profesorRut: '22222222', coeficiente: 2 },
  // 3°B - Matemáticas
  { estudianteRut: '26262626', asignatura: 'Matemáticas', curso: '3°B', nota: '4.0', tipoEvaluacion: 'prueba', fecha: '2026-03-15', profesorRut: '11111111', coeficiente: 1 },
  { estudianteRut: '26262626', asignatura: 'Matemáticas', curso: '3°B', nota: '5.5', tipoEvaluacion: 'tarea', fecha: '2026-04-01', profesorRut: '11111111', coeficiente: 1 },
  { estudianteRut: '27272727', asignatura: 'Matemáticas', curso: '3°B', nota: '3.5', tipoEvaluacion: 'prueba', fecha: '2026-03-15', profesorRut: '11111111', coeficiente: 1 },
  { estudianteRut: '28282828', asignatura: 'Matemáticas', curso: '3°B', nota: '6.0', tipoEvaluacion: 'prueba', fecha: '2026-03-15', profesorRut: '11111111', coeficiente: 1 },
  // 4°A - Ciencias
  { estudianteRut: '29292929', asignatura: 'Ciencias', curso: '4°A', nota: '5.0', tipoEvaluacion: 'laboratorio', fecha: '2026-03-25', profesorRut: '33333333', coeficiente: 1 },
  { estudianteRut: '29292929', asignatura: 'Ciencias', curso: '4°A', nota: '6.0', tipoEvaluacion: 'prueba', fecha: '2026-04-05', profesorRut: '33333333', coeficiente: 1 },
  { estudianteRut: '30303030', asignatura: 'Ciencias', curso: '4°A', nota: '4.5', tipoEvaluacion: 'laboratorio', fecha: '2026-03-25', profesorRut: '33333333', coeficiente: 1 },
  { estudianteRut: '31313131', asignatura: 'Ciencias', curso: '4°A', nota: '7.0', tipoEvaluacion: 'prueba', fecha: '2026-04-05', profesorRut: '33333333', coeficiente: 1 },
];

async function seed() {
  try {
    const existing = await sql`SELECT COUNT(*) as count FROM "notas"."notas"`;
    if (existing[0].count > 10) {
      console.log('Ya hay notas cargadas, saltando seed.');
      return;
    }
    for (const n of NOTAS_SEED) {
      await sql`
        INSERT INTO "notas"."notas" (estudiante_rut, asignatura, curso, nota, tipo_evaluacion, fecha, profesor_rut, coeficiente)
        VALUES (${n.estudianteRut}, ${n.asignatura}, ${n.curso}, ${n.nota}, ${n.tipoEvaluacion}, ${n.fecha}, ${n.profesorRut}, ${n.coeficiente})
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
