import postgres from 'postgres';

declare const process: { env: { DATABASE_URL?: string } };

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error('DATABASE_URL is required');

const sql = postgres(connectionString, { max: 1 });

async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

const PROFESORES_AUTH = [
  { rut: '22222222', dv: '2', nombre: 'Carlos', apellido: 'Muñoz', email: 'carlos.munoz@profesorCBO.cl' },
  { rut: '33333333', dv: '3', nombre: 'María', apellido: 'López', email: 'maria.lopez@profesorCBO.cl' },
  { rut: '44444444', dv: '4', nombre: 'Pedro', apellido: 'Ramírez', email: 'pedro.ramirez@profesorCBO.cl' },
  { rut: '55555555', dv: '5', nombre: 'Ana', apellido: 'Martínez', email: 'ana.martinez@profesorCBO.cl' },
  { rut: '66666666', dv: '6', nombre: 'Luis', apellido: 'González', email: 'luis.gonzalez@profesorCBO.cl' },
];

async function seed() {
  const hashedPassword = await hashPassword('123456');
  let total = 0;

  for (const p of PROFESORES_AUTH) {
    const result = await sql`
      INSERT INTO "autentificacion"."usuarios" (rut, dv, nombre, apellido, email, password, rol)
      VALUES (${p.rut}, ${p.dv}, ${p.nombre}, ${p.apellido}, ${p.email}, ${hashedPassword}, 'profesor')
      ON CONFLICT (rut) DO UPDATE SET
        nombre = EXCLUDED.nombre,
        apellido = EXCLUDED.apellido,
        email = EXCLUDED.email,
        password = EXCLUDED.password,
        rol = 'profesor',
        activo = true
      RETURNING id
    `;
    if (result.length > 0) total++;
  }

  console.log(`Seed completado: ${total} profesores sincronizados en auth.`);
  await sql.end();
}

seed();
