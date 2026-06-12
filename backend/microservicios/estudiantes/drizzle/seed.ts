import postgres from 'postgres';

declare const process: { env: { DATABASE_URL?: string } };

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error('DATABASE_URL is required');

const sql = postgres(connectionString, { max: 1 });

const NUEVOS_ESTUDIANTES = [
  // 3°A (+3)
  { rut: '23232323', dv: '3', nombre: 'Mateo', apellido: 'Sánchez', cursos: '3°A', email: 'mateo.sanchez@alumnoCBO.cl' },
  { rut: '24242424', dv: '4', nombre: 'Sofía', apellido: 'Martínez', cursos: '3°A', email: 'sofia.martinez@alumnoCBO.cl' },
  { rut: '25252525', dv: '5', nombre: 'Tomás', apellido: 'González', cursos: '3°A', email: 'tomas.gonzalez@alumnoCBO.cl' },
  // 3°B (+3)
  { rut: '26262626', dv: '6', nombre: 'Valentina', apellido: 'López', cursos: '3°B', email: 'valentina.lopez@alumnoCBO.cl' },
  { rut: '27272727', dv: '7', nombre: 'Sebastián', apellido: 'Rodríguez', cursos: '3°B', email: 'sebastian.rodriguez@alumnoCBO.cl' },
  { rut: '28282828', dv: '8', nombre: 'Emilia', apellido: 'Fernández', cursos: '3°B', email: 'emilia.fernandez@alumnoCBO.cl' },
  // 4°A (+3)
  { rut: '29292929', dv: '9', nombre: 'Nicolás', apellido: 'Moreno', cursos: '4°A', email: 'nicolas.moreno@alumnoCBO.cl' },
  { rut: '30303030', dv: '0', nombre: 'Antonia', apellido: 'Castillo', cursos: '4°A', email: 'antonia.castillo@alumnoCBO.cl' },
  { rut: '31313131', dv: '1', nombre: 'Maximiliano', apellido: 'Ríos', cursos: '4°A', email: 'maximiliano.rios@alumnoCBO.cl' },
  // 4°B (+3)
  { rut: '32323232', dv: '2', nombre: 'Isidora', apellido: 'Torres', cursos: '4°B', email: 'isidora.torres@alumnoCBO.cl' },
  { rut: '33333333', dv: '3', nombre: 'Benjamín', apellido: 'Vega', cursos: '4°B', email: 'benjamin.vega@alumnoCBO.cl' },
  { rut: '34343434', dv: '4', nombre: 'Florencia', apellido: 'Muñoz', cursos: '4°B', email: 'florencia.munoz@alumnoCBO.cl' },
  // 5°A (+3)
  { rut: '35353535', dv: '5', nombre: 'Cristóbal', apellido: 'Herrera', cursos: '5°A', email: 'cristobal.herrera@alumnoCBO.cl' },
  { rut: '36363636', dv: '6', nombre: 'Martina', apellido: 'Silva', cursos: '5°A', email: 'martina.silva@alumnoCBO.cl' },
  { rut: '37373737', dv: '7', nombre: 'Joaquín', apellido: 'Peña', cursos: '5°A', email: 'joaquin.pena@alumnoCBO.cl' },
  // 5°B (+3)
  { rut: '39393939', dv: '9', nombre: 'Gaspar', apellido: 'Núñez', cursos: '5°B', email: 'gaspar.nunez@alumnoCBO.cl' },
  { rut: '40404040', dv: '0', nombre: 'Trinidad', apellido: 'Bravo', cursos: '5°B', email: 'trinidad.bravo@alumnoCBO.cl' },
  { rut: '41414141', dv: '1', nombre: 'Alonso', apellido: 'Guzmán', cursos: '5°B', email: 'alonso.guzman@alumnoCBO.cl' },
];

async function seed() {
  const existing = await sql`SELECT COUNT(*) as count FROM "estudiantes"."estudiantes"`;
  if (existing[0].count > 10) {
    console.log('Ya hay estudiantes cargados, saltando seed.');
    await sql.end();
    return;
  }

  for (const e of NUEVOS_ESTUDIANTES) {
    await sql`
      INSERT INTO "estudiantes"."estudiantes" (rut, dv, nombre, apellido, cursos, email, password)
      VALUES (${e.rut}, ${e.dv}, ${e.nombre}, ${e.apellido}, ${e.cursos}, ${e.email}, '123456')
    `;
  }

  console.log(`Seed completado: ${NUEVOS_ESTUDIANTES.length} nuevos estudiantes creados.`);
  await sql.end();
}

seed();
