import postgres from 'postgres';
import bcrypt from 'bcryptjs';

declare const process: { env: { DATABASE_URL?: string } };

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error('DATABASE_URL is required');

const sql = postgres(connectionString, { max: 1 });

const NEW_STUDENTS = [
  // 3°A (+3)
  { rut: '23232323', dv: '3', name: 'Mateo', lastName: 'Sánchez', courses: '3°A', email: 'mateo.sanchez@alumnoCBO.cl' },
  { rut: '24242424', dv: '4', name: 'Sofía', lastName: 'Martínez', courses: '3°A', email: 'sofia.martinez@alumnoCBO.cl' },
  { rut: '25252525', dv: '5', name: 'Tomás', lastName: 'González', courses: '3°A', email: 'tomas.gonzalez@alumnoCBO.cl' },
  // 3°B (+3)
  { rut: '26262626', dv: '6', name: 'Valentina', lastName: 'López', courses: '3°B', email: 'valentina.lopez@alumnoCBO.cl' },
  { rut: '27272727', dv: '7', name: 'Sebastián', lastName: 'Rodríguez', courses: '3°B', email: 'sebastian.rodriguez@alumnoCBO.cl' },
  { rut: '28282828', dv: '8', name: 'Emilia', lastName: 'Fernández', courses: '3°B', email: 'emilia.fernandez@alumnoCBO.cl' },
  // 4°A (+3)
  { rut: '29292929', dv: '9', name: 'Nicolás', lastName: 'Moreno', courses: '4°A', email: 'nicolas.moreno@alumnoCBO.cl' },
  { rut: '30303030', dv: '0', name: 'Antonia', lastName: 'Castillo', courses: '4°A', email: 'antonia.castillo@alumnoCBO.cl' },
  { rut: '31313131', dv: '1', name: 'Maximiliano', lastName: 'Ríos', courses: '4°A', email: 'maximiliano.rios@alumnoCBO.cl' },
  // 4°B (+3)
  { rut: '32323232', dv: '2', name: 'Isidora', lastName: 'Torres', courses: '4°B', email: 'isidora.torres@alumnoCBO.cl' },
  { rut: '33333333', dv: '3', name: 'Benjamín', lastName: 'Vega', courses: '4°B', email: 'benjamin.vega@alumnoCBO.cl' },
  { rut: '34343434', dv: '4', name: 'Florencia', lastName: 'Muñoz', courses: '4°B', email: 'florencia.munoz@alumnoCBO.cl' },
  // 5°A (+3)
  { rut: '35353535', dv: '5', name: 'Cristóbal', lastName: 'Herrera', courses: '5°A', email: 'cristobal.herrera@alumnoCBO.cl' },
  { rut: '36363636', dv: '6', name: 'Martina', lastName: 'Silva', courses: '5°A', email: 'martina.silva@alumnoCBO.cl' },
  { rut: '37373737', dv: '7', name: 'Joaquín', lastName: 'Peña', courses: '5°A', email: 'joaquin.pena@alumnoCBO.cl' },
  // 5°B (+3)
  { rut: '39393939', dv: '9', name: 'Gaspar', lastName: 'Núñez', courses: '5°B', email: 'gaspar.nunez@alumnoCBO.cl' },
  { rut: '40404040', dv: '0', name: 'Trinidad', lastName: 'Bravo', courses: '5°B', email: 'trinidad.bravo@alumnoCBO.cl' },
  { rut: '41414141', dv: '1', name: 'Alonso', lastName: 'Guzmán', courses: '5°B', email: 'alonso.guzman@alumnoCBO.cl' },
];

async function seed() {
  try {
    const existing = await sql`SELECT COUNT(*) as count FROM "students"."students"`;
    if (existing[0].count > 10) {
      console.log('Ya hay estudiantes cargados, saltando seed.');
      return;
    }

    const password = await bcrypt.hash('123456', 10);
    for (const e of NEW_STUDENTS) {
      await sql`
        INSERT INTO "students"."students" (rut, dv, nombre, apellido, cursos, email, password)
        VALUES (${e.rut}, ${e.dv}, ${e.name}, ${e.lastName}, ${e.courses}, ${e.email}, ${password})
      `;
    }

    console.log(`Seed completado: ${NEW_STUDENTS.length} nuevos estudiantes creados.`);
  } catch (error) {
    console.error('Error en seed:', error);
  } finally {
    await sql.end();
  }
}

await seed();
