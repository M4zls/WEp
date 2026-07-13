import postgres from 'postgres';
import bcrypt from 'bcryptjs';

declare const process: { env: { DATABASE_URL?: string } };

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error('DATABASE_URL is required');

const sql = postgres(connectionString, { max: 1 });

async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

const PROFESORES_AUTH = [
  { rut: '22222222', dv: '2', firstName: 'Carlos', lastName: 'Muñoz', email: 'carlos.munoz@profesorCBO.cl' },
  { rut: '33333333', dv: '3', firstName: 'María', lastName: 'López', email: 'maria.lopez@profesorCBO.cl' },
  { rut: '44444444', dv: '4', firstName: 'Pedro', lastName: 'Ramírez', email: 'pedro.ramirez@profesorCBO.cl' },
  { rut: '55555555', dv: '5', firstName: 'Ana', lastName: 'Martínez', email: 'ana.martinez@profesorCBO.cl' },
  { rut: '66666666', dv: '6', firstName: 'Luis', lastName: 'González', email: 'luis.gonzalez@profesorCBO.cl' },
];

async function seed() {
  try {
    const hashedPassword = await hashPassword('123456');
    let total = 0;

    for (const p of PROFESORES_AUTH) {
      const result = await sql`
        INSERT INTO "auth"."users" (rut, dv, first_name, last_name, email, password, role)
        VALUES (${p.rut}, ${p.dv}, ${p.firstName}, ${p.lastName}, ${p.email}, ${hashedPassword}, 'teacher')
        ON CONFLICT (rut) DO UPDATE SET
          first_name = EXCLUDED.first_name,
          last_name = EXCLUDED.last_name,
          email = EXCLUDED.email,
          password = EXCLUDED.password,
          role = 'teacher',
          active = true
        RETURNING id
      `;
      if (result.length > 0) total++;
    }

    console.log(`Seed completado: ${total} profesores sincronizados en auth.`);
  } catch (error) {
    console.error('Error en seed:', error);
  } finally {
    await sql.end();
  }
}

await seed();
