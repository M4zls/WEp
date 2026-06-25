import postgres from 'postgres';

declare const process: { env: { DATABASE_URL?: string } };

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error('DATABASE_URL is required');

const sql = postgres(connectionString, { max: 1 });

const COURSES: { name: string; level: string; letter: string; year: string }[] = [
  { name: '3°A', level: '3°', letter: 'A', year: '2026' },
  { name: '3°B', level: '3°', letter: 'B', year: '2026' },
  { name: '4°A', level: '4°', letter: 'A', year: '2026' },
  { name: '4°B', level: '4°', letter: 'B', year: '2026' },
  { name: '5°A', level: '5°', letter: 'A', year: '2026' },
  { name: '5°B', level: '5°', letter: 'B', year: '2026' },
];

const SUBJECTS: { name: string; code: string; description: string }[] = [
  { name: 'Matemáticas', code: 'MAT', description: 'Matemáticas' },
  { name: 'Lenguaje', code: 'LEN', description: 'Lenguaje y Comunicación' },
  { name: 'Inglés', code: 'ING', description: 'Inglés' },
  { name: 'Historia', code: 'HIS', description: 'Historia y Ciencias Sociales' },
  { name: 'Ciencias', code: 'CIE', description: 'Ciencias Naturales' },
];

async function seed() {
  try {
    const existingCourses = await sql`SELECT COUNT(*) as count FROM "courses"."courses"`;
    if (existingCourses[0].count === 0) {
      for (const c of COURSES) {
        await sql`
          INSERT INTO "courses"."courses" (name, level, letter, year)
          VALUES (${c.name}, ${c.level}, ${c.letter}, ${c.year})
        `;
      }
      console.log(`${COURSES.length} cursos insertados.`);

      for (const s of SUBJECTS) {
        await sql`
          INSERT INTO "courses"."subjects" (name, code, description)
          VALUES (${s.name}, ${s.code}, ${s.description})
        `;
      }
      console.log(`${SUBJECTS.length} asignaturas insertadas.`);

      const courseRows = await sql`SELECT id, name FROM "courses"."courses" ORDER BY id`;
      const subjectRows = await sql`SELECT id, code FROM "courses"."subjects" ORDER BY id`;

      for (const course of courseRows) {
        for (const subject of subjectRows) {
          await sql`
            INSERT INTO "courses"."course_subject" (course_id, subject_id)
            VALUES (${course.id}, ${subject.id})
          `;
        }
      }
      console.log(`${courseRows.length * subjectRows.length} relaciones curso-asignatura insertadas.`);
    } else {
      console.log('Ya hay cursos cargados, saltando inserción.');
    }

    const csRows = await sql`SELECT cs.id, s.name as subject_name FROM "courses"."course_subject" cs JOIN "courses"."subjects" s ON s.id = cs.subject_id WHERE cs.professor_id IS NULL`;
    if (csRows.length > 0) {
      const teacherRows = await sql`SELECT id, materia FROM "teachers"."teachers" ORDER BY id`;
      let assigned = 0;
      for (const cs of csRows) {
        const prof = teacherRows.find((t: any) => t.materia.toLowerCase() === cs.subject_name.toLowerCase());
        if (prof) {
          await sql`
            UPDATE "courses"."course_subject" SET professor_id = ${prof.id}
            WHERE id = ${cs.id}
          `;
          assigned++;
        }
      }
      console.log(`${assigned} profesores asignados a relaciones curso-asignatura.`);
    }
  } catch (error) {
    console.error('Error en seed:', error);
  } finally {
    await sql.end();
  }
}

await seed();