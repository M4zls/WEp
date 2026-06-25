import postgres from 'postgres';

declare const process: { env: { DATABASE_URL?: string } };

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error('DATABASE_URL is required');

const sql = postgres(connectionString, { max: 1 });

type ClaseRealizada = { id: number; cursoAsignaturaId: number; fecha: string };
type Estudiante = { rut: string; nombre: string; apellido: string; cursos: string };

async function seed() {
  try {
    const clasesRealizadas: ClaseRealizada[] = await sql`SELECT id, course_subject_id as "cursoAsignaturaId", date as fecha FROM "classes"."classes" WHERE status = 'completed' ORDER BY id`;
    const estudiantes: Estudiante[] = await sql`SELECT rut, nombre, apellido, cursos FROM "students"."students" ORDER BY id`;

    if (clasesRealizadas.length === 0 || estudiantes.length === 0) {
      console.log('No hay clases realizadas o estudiantes disponibles. Saltando seed de asistencia.');
      return;
    }

    const cursoPorCa: Record<number, string> = {};
    const caRows = await sql`SELECT id, course_id as "curso_id" FROM "courses"."course_subject" ORDER BY id`;
    const cursoRows = await sql`SELECT id, name as nombre FROM "courses"."courses" ORDER BY id`;
    const cursoMap: Record<number, string> = {};
    for (const r of cursoRows) cursoMap[r.id] = r.nombre;
    for (const r of caRows) cursoPorCa[r.id] = cursoMap[r.curso_id] || '';

    let totalInsertados = 0;
    for (const clase of clasesRealizadas) {
      const cursoNombre = cursoPorCa[clase.cursoAsignaturaId];
      if (!cursoNombre) continue;

      const estudiantesCurso = estudiantes.filter(e => e.cursos === cursoNombre);
      for (const est of estudiantesCurso) {
        const presente = Math.random() > 0.15;
        const justificacion = presente ? null : (['Enfermedad', 'Permiso médico', 'Familiar', 'Problemas personales', 'Cita médica'][Math.floor(Math.random() * 5)]);

        const result = await sql`
          INSERT INTO "attendance"."attendance" (class_id, course_subject_id, student_rut, student_name, present, justification, fecha)
          VALUES (${clase.id}, ${clase.cursoAsignaturaId}, ${est.rut}, ${est.nombre + ' ' + est.apellido}, ${presente}, ${justificacion}, ${clase.fecha})
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
