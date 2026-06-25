import postgres from 'postgres';
import bcrypt from 'bcryptjs';

declare const process: { env: { DATABASE_URL?: string } };

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error('DATABASE_URL is required');

const sql = postgres(connectionString, { max: 1 });

const PROFESORES: { rut: string; dv: string; nombre: string; apellido: string; email: string; materia: string }[] = [
  { rut: '22222222', dv: '2', nombre: 'Carlos', apellido: 'Muñoz', email: 'carlos.munoz@profesorCBO.cl', materia: 'Matemáticas' },
  { rut: '33333333', dv: '3', nombre: 'María', apellido: 'López', email: 'maria.lopez@profesorCBO.cl', materia: 'Lenguaje' },
  { rut: '44444444', dv: '4', nombre: 'Pedro', apellido: 'Ramírez', email: 'pedro.ramirez@profesorCBO.cl', materia: 'Inglés' },
  { rut: '55555555', dv: '5', nombre: 'Ana', apellido: 'Martínez', email: 'ana.martinez@profesorCBO.cl', materia: 'Matemáticas' },
  { rut: '66666666', dv: '6', nombre: 'Luis', apellido: 'González', email: 'luis.gonzalez@profesorCBO.cl', materia: 'Lenguaje' },
];

async function seed() {
  try {
    const existing = await sql`SELECT COUNT(*) as count FROM "teachers"."teachers"`;
    if (existing[0].count > 0) {
      console.log('Ya hay profesores cargados, saltando seed.');
      return;
    }

    const password = await bcrypt.hash('123456', 10);
    for (const p of PROFESORES) {
      await sql`
        INSERT INTO "teachers"."teachers" (rut, dv, nombre, apellido, email, password, materia)
        VALUES (${p.rut}, ${p.dv}, ${p.nombre}, ${p.apellido}, ${p.email}, ${password}, ${p.materia})
        ON CONFLICT (rut) DO UPDATE SET materia = EXCLUDED.materia
      `;
    }
    console.log(`Seed completado: ${PROFESORES.length} profesores insertados.`);
  } catch (error) {
    console.error('Error en seed:', error);
  } finally {
    await sql.end();
  }
}

await seed();