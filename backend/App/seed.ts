import postgres from 'postgres';
import { createHash } from 'crypto';

const sql = postgres(process.env.DATABASE_URL!, { max: 1 });

function sha256(pass: string): string {
  return createHash('sha256').update(pass).digest('hex');
}

async function seed() {
  // Limpiar datos existentes
  await sql`DELETE FROM cursos.curso_asignatura`;
  await sql`DELETE FROM cursos.asignaturas`;
  await sql`DELETE FROM cursos.cursos`;
  await sql`DELETE FROM estudiantes.estudiantes`;
  await sql`DELETE FROM profesores.profesores`;
  await sql`DELETE FROM autentificacion.usuarios`;

  // Reset sequences
  await sql`ALTER SEQUENCE cursos.cursos_id_seq RESTART WITH 1`;
  await sql`ALTER SEQUENCE cursos.asignaturas_id_seq RESTART WITH 1`;
  await sql`ALTER SEQUENCE cursos.curso_asignatura_id_seq RESTART WITH 1`;
  await sql`ALTER SEQUENCE estudiantes.estudiantes_id_seq RESTART WITH 1`;
  await sql`ALTER SEQUENCE profesores.profesores_id_seq RESTART WITH 1`;
  await sql`ALTER SEQUENCE autentificacion.usuarios_id_seq RESTART WITH 1`;

  console.log('Datos anteriores eliminados.');

  // === CURSOS ===
  const cursosData = [
    { nombre: '3°A', nivel: '3', letra: 'A', anio: '2026' },
    { nombre: '3°B', nivel: '3', letra: 'B', anio: '2026' },
    { nombre: '4°A', nivel: '4', letra: 'A', anio: '2026' },
    { nombre: '4°B', nivel: '4', letra: 'B', anio: '2026' },
    { nombre: '5°A', nivel: '5', letra: 'A', anio: '2026' },
    { nombre: '5°B', nivel: '5', letra: 'B', anio: '2026' },
  ];
  for (const c of cursosData) {
    await sql`INSERT INTO cursos.cursos (nombre, nivel, letra, anio) VALUES (${c.nombre}, ${c.nivel}, ${c.letra}, ${c.anio})`;
  }
  console.log(`+ ${cursosData.length} cursos`);

  // === ASIGNATURAS ===
  const asignaturasData = [
    { nombre: 'Matemáticas', codigo: 'MAT-01', descripcion: 'Matemáticas básicas y avanzadas' },
    { nombre: 'Lenguaje', codigo: 'LEN-02', descripcion: 'Lengua y literatura' },
    { nombre: 'Inglés', codigo: 'ING-03', descripcion: 'Inglés intermedio' },
  ];
  for (const a of asignaturasData) {
    await sql`INSERT INTO cursos.asignaturas (nombre, codigo, descripcion) VALUES (${a.nombre}, ${a.codigo}, ${a.descripcion})`;
  }
  console.log(`+ ${asignaturasData.length} asignaturas`);

  // === PROFESORES (para auth y tabla profesores) ===
  const profesoresData = [
    { rut: '22222222', dv: '2', nombre: 'Carlos', apellido: 'Muñoz', email: 'carlos.munoz@profesorCBO.cl', telefono: '+56912345678' },
    { rut: '33333333', dv: '3', nombre: 'María', apellido: 'López', email: 'maria.lopez@profesorCBO.cl', telefono: '+56923456789' },
    { rut: '44444444', dv: '4', nombre: 'Pedro', apellido: 'Ramírez', email: 'pedro.ramirez@profesorCBO.cl', telefono: '+56934567890' },
    { rut: '55555555', dv: '5', nombre: 'Ana', apellido: 'Martínez', email: 'ana.martinez@profesorCBO.cl', telefono: '+56945678901' },
    { rut: '66666666', dv: '6', nombre: 'Luis', apellido: 'González', email: 'luis.gonzalez@profesorCBO.cl', telefono: '+56956789012' },
  ];
  for (const p of profesoresData) {
    await sql`INSERT INTO profesores.profesores (rut, dv, nombre, apellido, email, password, telefono, materia) VALUES (${p.rut}, ${p.dv}, ${p.nombre}, ${p.apellido}, ${p.email}, '123456', ${p.telefono}, 'General')`;
  }
  console.log(`+ ${profesoresData.length} profesores (tabla)`);

  // === AUTH usuarios (profesores + admin) ===
  const password = sha256('123456');
  // Admin
  await sql`INSERT INTO autentificacion.usuarios (rut, dv, nombre, apellido, email, password, rol) VALUES ('11111111', '1', 'Admin', 'Sistema', 'admin@profesorCBO.cl', ${password}, 'admin')`;
  for (const p of profesoresData) {
    await sql`INSERT INTO autentificacion.usuarios (rut, dv, nombre, apellido, email, password, rol) VALUES (${p.rut}, ${p.dv}, ${p.nombre}, ${p.apellido}, ${p.email}, ${password}, 'profesor')`;
  }
  console.log(`+ ${profesoresData.length + 1} usuarios auth`);

  // === ESTUDIANTES ===
  const estudiantesData = [
    { rut: '12121212', dv: '1', nombre: 'Benjamín', apellido: 'Soto', cursos: '3°A', email: 'benjamin.soto@alumnoCBO.cl', password: '123456' },
    { rut: '13131313', dv: '2', nombre: 'Camila', apellido: 'Torres', cursos: '3°B', email: 'camila.torres@alumnoCBO.cl', password: '123456' },
    { rut: '14141414', dv: '3', nombre: 'Daniel', apellido: 'Vargas', cursos: '4°A', email: 'daniel.vargas@alumnoCBO.cl', password: '123456' },
    { rut: '15151515', dv: '4', nombre: 'Emma', apellido: 'Pérez', cursos: '4°B', email: 'emma.perez@alumnoCBO.cl', password: '123456' },
    { rut: '16161616', dv: '5', nombre: 'Felipe', apellido: 'Castro', cursos: '5°A', email: 'felipe.castro@alumnoCBO.cl', password: '123456' },
    { rut: '17171717', dv: '6', nombre: 'Gabriela', apellido: 'Morales', cursos: '5°B', email: 'gabriela.morales@alumnoCBO.cl', password: '123456' },
    { rut: '18181818', dv: '7', nombre: 'Hugo', apellido: 'Díaz', cursos: '3°A', email: 'hugo.diaz@alumnoCBO.cl', password: '123456' },
    { rut: '19191919', dv: '8', nombre: 'Isabella', apellido: 'Flores', cursos: '3°B', email: 'isabella.flores@alumnoCBO.cl', password: '123456' },
    { rut: '20202020', dv: '9', nombre: 'Javier', apellido: 'Reyes', cursos: '4°A', email: 'javier.reyes@alumnoCBO.cl', password: '123456' },
    { rut: '21212121', dv: '0', nombre: 'Valentina', apellido: 'Aguilar', cursos: '4°B', email: 'valentina.aguilar@alumnoCBO.cl', password: '123456' },
  ];
  for (const e of estudiantesData) {
    await sql`INSERT INTO estudiantes.estudiantes (rut, dv, nombre, apellido, cursos, email, password) VALUES (${e.rut}, ${e.dv}, ${e.nombre}, ${e.apellido}, ${e.cursos}, ${e.email}, ${e.password})`;
  }
  console.log(`+ ${estudiantesData.length} estudiantes`);

  // === CURSO-ASIGNATURA ===
  const caData = [
    { curso_nombre: '3°A', asignatura_codigo: 'MAT-01', profesor_email: 'carlos.munoz@profesorCBO.cl' },
    { curso_nombre: '3°A', asignatura_codigo: 'LEN-02', profesor_email: 'maria.lopez@profesorCBO.cl' },
    { curso_nombre: '3°A', asignatura_codigo: 'ING-03', profesor_email: 'pedro.ramirez@profesorCBO.cl' },
    { curso_nombre: '3°B', asignatura_codigo: 'MAT-01', profesor_email: 'ana.martinez@profesorCBO.cl' },
    { curso_nombre: '3°B', asignatura_codigo: 'LEN-02', profesor_email: 'luis.gonzalez@profesorCBO.cl' },
    { curso_nombre: '3°B', asignatura_codigo: 'ING-03', profesor_email: 'carlos.munoz@profesorCBO.cl' },
    { curso_nombre: '4°A', asignatura_codigo: 'MAT-01', profesor_email: 'maria.lopez@profesorCBO.cl' },
    { curso_nombre: '4°A', asignatura_codigo: 'LEN-02', profesor_email: 'pedro.ramirez@profesorCBO.cl' },
    { curso_nombre: '4°A', asignatura_codigo: 'ING-03', profesor_email: 'ana.martinez@profesorCBO.cl' },
    { curso_nombre: '4°B', asignatura_codigo: 'MAT-01', profesor_email: 'luis.gonzalez@profesorCBO.cl' },
    { curso_nombre: '4°B', asignatura_codigo: 'LEN-02', profesor_email: 'carlos.munoz@profesorCBO.cl' },
    { curso_nombre: '4°B', asignatura_codigo: 'ING-03', profesor_email: 'maria.lopez@profesorCBO.cl' },
    { curso_nombre: '5°A', asignatura_codigo: 'MAT-01', profesor_email: 'pedro.ramirez@profesorCBO.cl' },
    { curso_nombre: '5°A', asignatura_codigo: 'LEN-02', profesor_email: 'ana.martinez@profesorCBO.cl' },
    { curso_nombre: '5°A', asignatura_codigo: 'ING-03', profesor_email: 'luis.gonzalez@profesorCBO.cl' },
    { curso_nombre: '5°B', asignatura_codigo: 'MAT-01', profesor_email: 'carlos.munoz@profesorCBO.cl' },
    { curso_nombre: '5°B', asignatura_codigo: 'LEN-02', profesor_email: 'maria.lopez@profesorCBO.cl' },
    { curso_nombre: '5°B', asignatura_codigo: 'ING-03', profesor_email: 'pedro.ramirez@profesorCBO.cl' },
  ];
  for (const ca of caData) {
    await sql`
      INSERT INTO cursos.curso_asignatura (curso_id, asignatura_id, profesor_id)
      VALUES (
        (SELECT id FROM cursos.cursos WHERE nombre = ${ca.curso_nombre}),
        (SELECT id FROM cursos.asignaturas WHERE codigo = ${ca.asignatura_codigo}),
        (SELECT id FROM profesores.profesores WHERE email = ${ca.profesor_email})
      )
    `;
  }
  console.log(`+ ${caData.length} curso-asignatura`);

  console.log('\n✅ Seed completado exitosamente');
  await sql.end();
}

seed().catch((e) => {
  console.error('Error en seed:', e);
  process.exit(1);
});
