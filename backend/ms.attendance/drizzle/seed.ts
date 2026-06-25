import postgres from 'postgres';

declare const process: { env: { DATABASE_URL?: string } };

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error('DATABASE_URL is required');

const sql = postgres(connectionString, { max: 1 });

type ClaseRealizada = { id: number; cursoAsignaturaId: number; fecha: string };
type Estudiante = { rut: string; nombre: string; apellido: string; cursos: string };

async function seed() {
  try {
    const clasesRealizadas: ClaseRealizada[] = await sql`SELECT id, curso_asignatura_id, fecha FROM "clases"."clases" WHERE estado = 'realizada' ORDER BY id`;
    const estudiantes: Estudiante[] = await sql`SELECT rut, nombre, apellido, cursos FROM "estudiantes"."estudiantes" ORDER BY id`;

    if (clasesRealizadas.length === 0 || estudiantes.length === 0) {
      console.log('No hay clases realizadas o estudiantes disponibles. Saltando seed de asistencia.');
      return;
    }

    const cursoPorCa: Record<number, string> = {};
    const caRows = await sql`SELECT id, curso_id FROM "cursos"."curso_asignatura" ORDER BY id`;
    const cursoRows = await sql`SELECT id, nombre FROM "cursos"."cursos" ORDER BY id`;
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
          INSERT INTO "asistencia"."asistencia" (clase_id, curso_asignatura_id, estudiante_rut, estudiante_nombre, presente, justificacion, fecha)
          VALUES (${clase.id}, ${clase.cursoAsignaturaId}, ${est.rut}, ${est.nombre + ' ' + est.apellido}, ${presente}, ${justificacion}, ${clase.fecha})
          ON CONFLICT (clase_id, estudiante_rut) DO NOTHING
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
