import postgres from 'postgres';

declare const process: { env: { DATABASE_URL?: string } };

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error('DATABASE_URL is required');

const sql = postgres(connectionString, { max: 1 });

type Estudiante = { rut: string; firstName: string; lastName: string; courses: string };

const HARDCODED_CLASES = [
  { courseSubjectId: 1, date: '2026-03-01' },
  { courseSubjectId: 1, date: '2026-03-03' },
  { courseSubjectId: 2, date: '2026-03-01' },
  { courseSubjectId: 3, date: '2026-03-02' },
];
const HARDCODED_ESTUDIANTES: Estudiante[] = [
  { rut: '11111111', firstName: 'Mateo', lastName: 'Sánchez', courses: '3°A' },
  { rut: '22222222', firstName: 'Valentina', lastName: 'Muñoz', courses: '3°A' },
];

async function seed() {
  try {
    const existing = await sql`SELECT COUNT(*) as count FROM "attendance"."attendance"`;
    if (existing[0].count > 0) {
      console.log('Attendance seed: datos ya existen, se omite');
      return;
    }

    let totalInsertados = 0;
    for (const clase of HARDCODED_CLASES) {
      for (const est of HARDCODED_ESTUDIANTES) {
        const presente = Math.random() > 0.15;
        const justificacion = presente ? null : (['Enfermedad', 'Permiso médico', 'Familiar', 'Problemas personales', 'Cita médica'][Math.floor(Math.random() * 5)]);

        const result = await sql`
          INSERT INTO "attendance"."attendance" (class_id, course_subject_id, student_rut, student_name, present, justification, date)
          VALUES (${1}, ${clase.courseSubjectId}, ${est.rut}, ${est.firstName + ' ' + est.lastName}, ${presente}, ${justificacion}, ${clase.date})
          ON CONFLICT (class_id, student_rut) DO NOTHING
          RETURNING id
        `;
        if (result.length > 0) totalInsertados++;
      }
    }

    console.log(`Seed completado: ${totalInsertados} nuevos registros de asistencia creados.`);
  } catch (error) {
    console.error('Error en seed:', error);
  } finally {
    await sql.end();
  }
}

await seed();
