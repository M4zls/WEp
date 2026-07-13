import postgres from 'postgres';
import bcrypt from 'bcryptjs';

declare const process: { env: { DATABASE_URL?: string } };

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error('DATABASE_URL is required');

const sql = postgres(connectionString, { max: 1 });

const PROFESORES: { rut: string; dv: string; firstName: string; lastName: string; email: string; subject: string }[] = [
  { rut: '22222222', dv: '2', firstName: 'Carlos', lastName: 'Muñoz', email: 'carlos.munoz@profesorCBO.cl', subject: 'Matemáticas' },
  { rut: '33333333', dv: '3', firstName: 'María', lastName: 'López', email: 'maria.lopez@profesorCBO.cl', subject: 'Lenguaje' },
  { rut: '44444444', dv: '4', firstName: 'Pedro', lastName: 'Ramírez', email: 'pedro.ramirez@profesorCBO.cl', subject: 'Inglés' },
  { rut: '55555555', dv: '5', firstName: 'Ana', lastName: 'Martínez', email: 'ana.martinez@profesorCBO.cl', subject: 'Matemáticas' },
  { rut: '66666666', dv: '6', firstName: 'Luis', lastName: 'González', email: 'luis.gonzalez@profesorCBO.cl', subject: 'Lenguaje' },
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
        INSERT INTO "teachers"."teachers" (rut, dv, first_name, last_name, email, password, subject)
        VALUES (${p.rut}, ${p.dv}, ${p.firstName}, ${p.lastName}, ${p.email}, ${password}, ${p.subject})
        ON CONFLICT (rut) DO UPDATE SET subject = EXCLUDED.subject
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