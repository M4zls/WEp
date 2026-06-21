import postgres from 'postgres';

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

async function seed() {
  // ── 1. PROFESORES ──────────────────────────────────────
  console.log('--- Sembrando profesores ---');
  const profExisting = await sql`SELECT COUNT(*) as count FROM "profesores"."profesores"`;
  if (profExisting[0].count > 0) {
    console.log('Ya hay profesores, saltando inserción.');
  } else {
    const PROFESORES = [
      { rut: '22222222', dv: '2', nombre: 'Carlos', apellido: 'Muñoz', email: 'carlos.munoz@profesorCBO.cl', password: '123456', materia: 'Matemáticas' },
      { rut: '33333333', dv: '3', nombre: 'María', apellido: 'López', email: 'maria.lopez@profesorCBO.cl', password: '123456', materia: 'Lenguaje' },
      { rut: '44444444', dv: '4', nombre: 'Pedro', apellido: 'Ramírez', email: 'pedro.ramirez@profesorCBO.cl', password: '123456', materia: 'Inglés' },
      { rut: '55555555', dv: '5', nombre: 'Ana', apellido: 'Martínez', email: 'ana.martinez@profesorCBO.cl', password: '123456', materia: 'Matemáticas' },
      { rut: '66666666', dv: '6', nombre: 'Luis', apellido: 'González', email: 'luis.gonzalez@profesorCBO.cl', password: '123456', materia: 'Lenguaje' },
    ];
    for (const p of PROFESORES) {
      await sql`
        INSERT INTO "profesores"."profesores" (rut, dv, nombre, apellido, email, password, materia)
        VALUES (${p.rut}, ${p.dv}, ${p.nombre}, ${p.apellido}, ${p.email}, ${p.password}, ${p.materia})
      `;
    }
    console.log(`${PROFESORES.length} profesores insertados.`);
  }

  // ── 2. CURSOS ──────────────────────────────────────────
  console.log('--- Sembrando cursos ---');
  const cursosExisting = await sql`SELECT COUNT(*) as count FROM "cursos"."cursos"`;
  if (cursosExisting[0].count > 0) {
    console.log('Ya hay cursos, saltando.');
  } else {
    const CURSOS = [
      { nombre: '3°A', nivel: '3', letra: 'A' },
      { nombre: '3°B', nivel: '3', letra: 'B' },
      { nombre: '4°A', nivel: '4', letra: 'A' },
      { nombre: '4°B', nivel: '4', letra: 'B' },
      { nombre: '5°A', nivel: '5', letra: 'A' },
      { nombre: '5°B', nivel: '5', letra: 'B' },
    ];
    for (const c of CURSOS) {
      await sql`
        INSERT INTO "cursos"."cursos" (nombre, nivel, letra)
        VALUES (${c.nombre}, ${c.nivel}, ${c.letra})
      `;
    }
    console.log(`${CURSOS.length} cursos insertados.`);
  }

  // ── 3. ASIGNATURAS ─────────────────────────────────────
  console.log('--- Sembrando asignaturas ---');
  const asigExisting = await sql`SELECT COUNT(*) as count FROM "cursos"."asignaturas"`;
  if (asigExisting[0].count > 0) {
    console.log('Ya hay asignaturas, saltando.');
  } else {
    const ASIGNATURAS = [
      { nombre: 'Matemáticas', codigo: 'MAT' },
      { nombre: 'Lenguaje', codigo: 'LEN' },
      { nombre: 'Inglés', codigo: 'ING' },
    ];
    for (const a of ASIGNATURAS) {
      await sql`
        INSERT INTO "cursos"."asignaturas" (nombre, codigo)
        VALUES (${a.nombre}, ${a.codigo})
      `;
    }
    console.log(`${ASIGNATURAS.length} asignaturas insertadas.`);
  }

  // ── 4. CURSO_ASIGNATURA ────────────────────────────────
  console.log('--- Sembrando curso_asignatura ---');
  const caExisting = await sql`SELECT COUNT(*) as count FROM "cursos"."curso_asignatura"`;
  if (caExisting[0].count > 0) {
    console.log('Ya hay curso_asignatura, saltando.');
  } else {
    // (curso_id, asignatura_id) for each combo
    const combos: [number, number][] = [];
    for (let cursoId = 1; cursoId <= 6; cursoId++) {
      for (let asigId = 1; asigId <= 3; asigId++) {
        combos.push([cursoId, asigId]);
      }
    }
    for (const [cursoId, asigId] of combos) {
      await sql`
        INSERT INTO "cursos"."curso_asignatura" (curso_id, asignatura_id)
        VALUES (${cursoId}, ${asigId})
      `;
    }
    console.log(`${combos.length} curso_asignatura insertados.`);
  }

  // ── 5. ASIGNAR PROFESORES A CURSO_ASIGNATURA ───────────
  console.log('--- Asignando profesores a curso_asignatura ---');
  const ASIGNACIONES: [number, number][] = [
    [1, 1], [2, 2], [3, 3], [4, 4], [5, 5], [6, 3],
    [7, 4], [8, 5], [9, 3], [10, 1], [11, 2], [12, 3],
    [13, 4], [14, 5], [15, 3], [16, 1], [17, 2], [18, 3],
  ];
  for (const [caId, profId] of ASIGNACIONES) {
    await sql`
      UPDATE "cursos"."curso_asignatura"
      SET profesor_id = ${profId}
      WHERE id = ${caId}
    `;
  }
  console.log(`${ASIGNACIONES.length} curso_asignatura actualizados con profesor.`);

  // ── 6. ESTUDIANTES ─────────────────────────────────────
  console.log('--- Sembrando estudiantes ---');
  const estExisting = await sql`SELECT COUNT(*) as count FROM "estudiantes"."estudiantes"`;
  if (estExisting[0].count > 10) {
    console.log('Ya hay estudiantes, saltando.');
  } else {
    const NUEVOS_ESTUDIANTES = [
      { rut: '23232323', dv: '3', nombre: 'Mateo', apellido: 'Sánchez', cursos: '3°A', email: 'mateo.sanchez@alumnoCBO.cl' },
      { rut: '24242424', dv: '4', nombre: 'Sofía', apellido: 'Martínez', cursos: '3°A', email: 'sofia.martinez@alumnoCBO.cl' },
      { rut: '25252525', dv: '5', nombre: 'Tomás', apellido: 'González', cursos: '3°A', email: 'tomas.gonzalez@alumnoCBO.cl' },
      { rut: '26262626', dv: '6', nombre: 'Valentina', apellido: 'López', cursos: '3°B', email: 'valentina.lopez@alumnoCBO.cl' },
      { rut: '27272727', dv: '7', nombre: 'Sebastián', apellido: 'Rodríguez', cursos: '3°B', email: 'sebastian.rodriguez@alumnoCBO.cl' },
      { rut: '28282828', dv: '8', nombre: 'Emilia', apellido: 'Fernández', cursos: '3°B', email: 'emilia.fernandez@alumnoCBO.cl' },
      { rut: '29292929', dv: '9', nombre: 'Nicolás', apellido: 'Moreno', cursos: '4°A', email: 'nicolas.moreno@alumnoCBO.cl' },
      { rut: '30303030', dv: '0', nombre: 'Antonia', apellido: 'Castillo', cursos: '4°A', email: 'antonia.castillo@alumnoCBO.cl' },
      { rut: '31313131', dv: '1', nombre: 'Maximiliano', apellido: 'Ríos', cursos: '4°A', email: 'maximiliano.rios@alumnoCBO.cl' },
      { rut: '32323232', dv: '2', nombre: 'Isidora', apellido: 'Torres', cursos: '4°B', email: 'isidora.torres@alumnoCBO.cl' },
      { rut: '33333333', dv: '3', nombre: 'Benjamín', apellido: 'Vega', cursos: '4°B', email: 'benjamin.vega@alumnoCBO.cl' },
      { rut: '34343434', dv: '4', nombre: 'Florencia', apellido: 'Muñoz', cursos: '4°B', email: 'florencia.munoz@alumnoCBO.cl' },
      { rut: '35353535', dv: '5', nombre: 'Cristóbal', apellido: 'Herrera', cursos: '5°A', email: 'cristobal.herrera@alumnoCBO.cl' },
      { rut: '36363636', dv: '6', nombre: 'Martina', apellido: 'Silva', cursos: '5°A', email: 'martina.silva@alumnoCBO.cl' },
      { rut: '37373737', dv: '7', nombre: 'Joaquín', apellido: 'Peña', cursos: '5°A', email: 'joaquin.pena@alumnoCBO.cl' },
      { rut: '39393939', dv: '9', nombre: 'Gaspar', apellido: 'Núñez', cursos: '5°B', email: 'gaspar.nunez@alumnoCBO.cl' },
      { rut: '40404040', dv: '0', nombre: 'Trinidad', apellido: 'Bravo', cursos: '5°B', email: 'trinidad.bravo@alumnoCBO.cl' },
      { rut: '41414141', dv: '1', nombre: 'Alonso', apellido: 'Guzmán', cursos: '5°B', email: 'alonso.guzman@alumnoCBO.cl' },
    ];
    for (const e of NUEVOS_ESTUDIANTES) {
      await sql`
        INSERT INTO "estudiantes"."estudiantes" (rut, dv, nombre, apellido, cursos, email, password)
        VALUES (${e.rut}, ${e.dv}, ${e.nombre}, ${e.apellido}, ${e.cursos}, ${e.email}, '123456')
      `;
    }
    console.log(`${NUEVOS_ESTUDIANTES.length} estudiantes insertados.`);
  }

  // ── 7. AUTENTIFICACION ─────────────────────────────────
  console.log('--- Sembrando usuarios de autentificación ---');
  const authExisting = await sql`SELECT COUNT(*) as count FROM "autentificacion"."usuarios"`;
  if (authExisting[0].count > 0) {
    console.log('Ya hay usuarios, saltando.');
  } else {
    const hashedPassword = await hashPassword('123456');
    const PROFESORES_AUTH = [
      { rut: '22222222', dv: '2', nombre: 'Carlos', apellido: 'Muñoz', email: 'carlos.munoz@profesorCBO.cl' },
      { rut: '33333333', dv: '3', nombre: 'María', apellido: 'López', email: 'maria.lopez@profesorCBO.cl' },
      { rut: '44444444', dv: '4', nombre: 'Pedro', apellido: 'Ramírez', email: 'pedro.ramirez@profesorCBO.cl' },
      { rut: '55555555', dv: '5', nombre: 'Ana', apellido: 'Martínez', email: 'ana.martinez@profesorCBO.cl' },
      { rut: '66666666', dv: '6', nombre: 'Luis', apellido: 'González', email: 'luis.gonzalez@profesorCBO.cl' },
    ];
    for (const p of PROFESORES_AUTH) {
      await sql`
        INSERT INTO "autentificacion"."usuarios" (rut, dv, nombre, apellido, email, password, rol)
        VALUES (${p.rut}, ${p.dv}, ${p.nombre}, ${p.apellido}, ${p.email}, ${hashedPassword}, 'profesor')
        ON CONFLICT (rut) DO UPDATE SET
          nombre = EXCLUDED.nombre, apellido = EXCLUDED.apellido,
          email = EXCLUDED.email, password = EXCLUDED.password,
          rol = 'profesor', activo = true
      `;
    }
    console.log(`${PROFESORES_AUTH.length} usuarios de autentificación insertados.`);
  }

  // ── 8. CLASES ──────────────────────────────────────────
  console.log('--- Sembrando clases ---');
  const clasesExisting = await sql`SELECT COUNT(*) as count FROM "clases"."clases"`;
  if (clasesExisting[0].count > 23) {
    console.log('Ya hay clases, saltando.');
  } else {
    const NUEVAS_CLASES = [
      { caId: 6, titulo: 'Inglés - Vocabulario básico', fecha: '2026-06-02', horaInicio: '08:00', horaTermino: '08:45', estado: 'realizada' },
      { caId: 6, titulo: 'Inglés - Comprensión lectora', fecha: '2026-06-04', horaInicio: '08:00', horaTermino: '08:45', estado: 'realizada' },
      { caId: 6, titulo: 'Inglés - Gramática', fecha: '2026-06-09', horaInicio: '08:00', horaTermino: '08:45', estado: 'pendiente' },
      { caId: 6, titulo: 'Inglés - Conversación', fecha: '2026-06-11', horaInicio: '08:00', horaTermino: '08:45', estado: 'pendiente' },
      { caId: 7, titulo: 'Matemáticas - Álgebra', fecha: '2026-06-01', horaInicio: '11:30', horaTermino: '12:15', estado: 'realizada' },
      { caId: 7, titulo: 'Matemáticas - Ecuaciones', fecha: '2026-06-03', horaInicio: '11:30', horaTermino: '12:15', estado: 'realizada' },
      { caId: 7, titulo: 'Matemáticas - Geometría', fecha: '2026-06-08', horaInicio: '11:30', horaTermino: '12:15', estado: 'pendiente' },
      { caId: 7, titulo: 'Matemáticas - Estadística', fecha: '2026-06-10', horaInicio: '11:30', horaTermino: '12:15', estado: 'pendiente' },
      { caId: 8, titulo: 'Lenguaje - Análisis literario', fecha: '2026-06-02', horaInicio: '09:45', horaTermino: '10:30', estado: 'realizada' },
      { caId: 8, titulo: 'Lenguaje - Redacción', fecha: '2026-06-04', horaInicio: '09:45', horaTermino: '10:30', estado: 'realizada' },
      { caId: 8, titulo: 'Lenguaje - Ortografía', fecha: '2026-06-09', horaInicio: '09:45', horaTermino: '10:30', estado: 'pendiente' },
      { caId: 8, titulo: 'Lenguaje - Comprensión', fecha: '2026-06-11', horaInicio: '09:45', horaTermino: '10:30', estado: 'pendiente' },
      { caId: 9, titulo: 'Inglés - Verbos', fecha: '2026-06-01', horaInicio: '08:00', horaTermino: '08:45', estado: 'realizada' },
      { caId: 9, titulo: 'Inglés - Lectura', fecha: '2026-06-03', horaInicio: '08:00', horaTermino: '08:45', estado: 'realizada' },
      { caId: 9, titulo: 'Inglés - Escritura', fecha: '2026-06-08', horaInicio: '08:00', horaTermino: '08:45', estado: 'pendiente' },
      { caId: 9, titulo: 'Inglés - Evaluación', fecha: '2026-06-10', horaInicio: '08:00', horaTermino: '08:45', estado: 'pendiente' },
      { caId: 10, titulo: 'Matemáticas - Fracciones', fecha: '2026-06-02', horaInicio: '08:00', horaTermino: '08:45', estado: 'realizada' },
      { caId: 10, titulo: 'Matemáticas - Decimales', fecha: '2026-06-04', horaInicio: '08:00', horaTermino: '08:45', estado: 'realizada' },
      { caId: 10, titulo: 'Matemáticas - Porcentajes', fecha: '2026-06-09', horaInicio: '08:00', horaTermino: '08:45', estado: 'pendiente' },
      { caId: 10, titulo: 'Matemáticas - Razones', fecha: '2026-06-11', horaInicio: '08:00', horaTermino: '08:45', estado: 'pendiente' },
      { caId: 11, titulo: 'Lenguaje - Poesía', fecha: '2026-06-01', horaInicio: '09:45', horaTermino: '10:30', estado: 'realizada' },
      { caId: 11, titulo: 'Lenguaje - Narrativa', fecha: '2026-06-05', horaInicio: '09:45', horaTermino: '10:30', estado: 'realizada' },
      { caId: 11, titulo: 'Lenguaje - Ensayo', fecha: '2026-06-10', horaInicio: '09:45', horaTermino: '10:30', estado: 'pendiente' },
      { caId: 11, titulo: 'Lenguaje - Debate', fecha: '2026-06-12', horaInicio: '09:45', horaTermino: '10:30', estado: 'pendiente' },
      { caId: 12, titulo: 'Inglés - Listening', fecha: '2026-06-01', horaInicio: '14:00', horaTermino: '14:45', estado: 'realizada' },
      { caId: 12, titulo: 'Inglés - Speaking', fecha: '2026-06-03', horaInicio: '14:00', horaTermino: '14:45', estado: 'realizada' },
      { caId: 12, titulo: 'Inglés - Reading', fecha: '2026-06-08', horaInicio: '14:00', horaTermino: '14:45', estado: 'pendiente' },
      { caId: 12, titulo: 'Inglés - Writing', fecha: '2026-06-10', horaInicio: '14:00', horaTermino: '14:45', estado: 'pendiente' },
      { caId: 13, titulo: 'Matemáticas - Funciones', fecha: '2026-06-01', horaInicio: '08:00', horaTermino: '08:45', estado: 'realizada' },
      { caId: 13, titulo: 'Matemáticas - Derivadas', fecha: '2026-06-03', horaInicio: '08:00', horaTermino: '08:45', estado: 'realizada' },
      { caId: 13, titulo: 'Matemáticas - Integrales', fecha: '2026-06-08', horaInicio: '08:00', horaTermino: '08:45', estado: 'pendiente' },
      { caId: 13, titulo: 'Matemáticas - Probabilidad', fecha: '2026-06-10', horaInicio: '08:00', horaTermino: '08:45', estado: 'pendiente' },
      { caId: 14, titulo: 'Lenguaje - Literatura', fecha: '2026-06-02', horaInicio: '08:00', horaTermino: '08:45', estado: 'realizada' },
      { caId: 14, titulo: 'Lenguaje - Gramática', fecha: '2026-06-04', horaInicio: '08:00', horaTermino: '08:45', estado: 'realizada' },
      { caId: 14, titulo: 'Lenguaje - Sintaxis', fecha: '2026-06-09', horaInicio: '08:00', horaTermino: '08:45', estado: 'pendiente' },
      { caId: 14, titulo: 'Lenguaje - Vocabulario', fecha: '2026-06-11', horaInicio: '08:00', horaTermino: '08:45', estado: 'pendiente' },
      { caId: 15, titulo: 'Inglés - Advanced vocab', fecha: '2026-06-02', horaInicio: '08:00', horaTermino: '08:45', estado: 'realizada' },
      { caId: 15, titulo: 'Inglés - Grammar advanced', fecha: '2026-06-05', horaInicio: '08:00', horaTermino: '08:45', estado: 'realizada' },
      { caId: 15, titulo: 'Inglés - Essay writing', fecha: '2026-06-10', horaInicio: '08:00', horaTermino: '08:45', estado: 'pendiente' },
      { caId: 15, titulo: 'Inglés - Presentation', fecha: '2026-06-12', horaInicio: '08:00', horaTermino: '08:45', estado: 'pendiente' },
      { caId: 16, titulo: 'Matemáticas - Repaso', fecha: '2026-06-01', horaInicio: '11:30', horaTermino: '12:15', estado: 'realizada' },
      { caId: 16, titulo: 'Matemáticas - Ejercicios', fecha: '2026-06-03', horaInicio: '11:30', horaTermino: '12:15', estado: 'realizada' },
      { caId: 16, titulo: 'Matemáticas - Evaluación', fecha: '2026-06-08', horaInicio: '11:30', horaTermino: '12:15', estado: 'pendiente' },
      { caId: 16, titulo: 'Matemáticas - Proyecto', fecha: '2026-06-10', horaInicio: '11:30', horaTermino: '12:15', estado: 'pendiente' },
      { caId: 17, titulo: 'Lenguaje - Textos', fecha: '2026-06-02', horaInicio: '09:45', horaTermino: '10:30', estado: 'realizada' },
      { caId: 17, titulo: 'Lenguaje - Argumentación', fecha: '2026-06-04', horaInicio: '09:45', horaTermino: '10:30', estado: 'realizada' },
      { caId: 17, titulo: 'Lenguaje - Informes', fecha: '2026-06-09', horaInicio: '09:45', horaTermino: '10:30', estado: 'pendiente' },
      { caId: 17, titulo: 'Lenguaje - Exposición', fecha: '2026-06-11', horaInicio: '09:45', horaTermino: '10:30', estado: 'pendiente' },
      { caId: 18, titulo: 'Inglés - Review', fecha: '2026-06-01', horaInicio: '14:00', horaTermino: '14:45', estado: 'realizada' },
      { caId: 18, titulo: 'Inglés - Practice', fecha: '2026-06-05', horaInicio: '14:00', horaTermino: '14:45', estado: 'realizada' },
      { caId: 18, titulo: 'Inglés - Test prep', fecha: '2026-06-10', horaInicio: '14:00', horaTermino: '14:45', estado: 'pendiente' },
      { caId: 18, titulo: 'Inglés - Final project', fecha: '2026-06-12', horaInicio: '14:00', horaTermino: '14:45', estado: 'pendiente' },
    ];
    for (const c of NUEVAS_CLASES) {
      await sql`
        INSERT INTO "clases"."clases" (curso_asignatura_id, titulo, fecha, hora_inicio, hora_termino, estado)
        VALUES (${c.caId}, ${c.titulo}, ${c.fecha}, ${c.horaInicio}, ${c.horaTermino}, ${c.estado})
      `;
    }
    console.log(`${NUEVAS_CLASES.length} clases insertadas.`);
  }

  // ── 9. HORARIO ─────────────────────────────────────────
  console.log('--- Sembrando horarios ---');
  const horarioExisting = await sql`SELECT COUNT(*) as count FROM "horario"."horarios"`;
  if (horarioExisting[0].count > 0) {
    console.log('Ya hay horarios, saltando.');
  } else {
    const BLOQUES = [
      { horaInicio: '08:00', horaTermino: '08:45' },
      { horaInicio: '08:45', horaTermino: '09:30' },
      { horaInicio: '09:45', horaTermino: '10:30' },
      { horaInicio: '10:30', horaTermino: '11:15' },
      { horaInicio: '11:30', horaTermino: '12:15' },
      { horaInicio: '12:15', horaTermino: '13:00' },
      { horaInicio: '14:00', horaTermino: '14:45' },
      { horaInicio: '14:45', horaTermino: '15:30' },
      { horaInicio: '15:30', horaTermino: '16:00' },
    ];
    const SCHEDULE: [number, number, number][] = [
      [1, 1, 0], [1, 1, 1], [1, 3, 0], [1, 3, 1], [1, 5, 0], [1, 5, 1],
      [2, 1, 2], [2, 1, 3], [2, 2, 2], [2, 2, 3], [2, 4, 2], [2, 4, 3],
      [3, 2, 4], [3, 2, 5], [3, 3, 4], [3, 3, 5], [3, 5, 4], [3, 5, 5],
      [4, 2, 0], [4, 2, 1], [4, 4, 0], [4, 4, 1], [4, 5, 2], [4, 5, 3],
      [5, 1, 4], [5, 1, 5], [5, 3, 2], [5, 3, 3], [5, 5, 0], [5, 5, 1],
      [6, 1, 0], [6, 1, 1], [6, 2, 4], [6, 2, 5], [6, 4, 4], [6, 4, 5],
      [7, 1, 4], [7, 1, 5], [7, 3, 0], [7, 3, 1], [7, 5, 2], [7, 5, 3],
      [8, 2, 2], [8, 2, 3], [8, 4, 0], [8, 4, 1], [8, 5, 4], [8, 5, 5],
      [9, 1, 0], [9, 1, 1], [9, 3, 4], [9, 3, 5], [9, 4, 2], [9, 4, 3],
      [10, 2, 0], [10, 2, 1], [10, 4, 4], [10, 4, 5], [10, 5, 0], [10, 5, 1],
      [11, 1, 2], [11, 1, 3], [11, 3, 2], [11, 3, 3], [11, 5, 4], [11, 5, 5],
      [12, 1, 6], [12, 1, 7], [12, 2, 4], [12, 2, 5], [12, 4, 0], [12, 4, 1],
      [13, 3, 0], [13, 3, 1], [13, 5, 0], [13, 5, 1], [13, 2, 6], [13, 2, 7],
      [14, 1, 0], [14, 1, 1], [14, 4, 2], [14, 4, 3], [14, 3, 4], [14, 3, 5],
      [15, 2, 0], [15, 2, 1], [15, 5, 4], [15, 5, 5], [15, 4, 0], [15, 4, 1],
      [16, 1, 4], [16, 1, 5], [16, 3, 2], [16, 3, 3], [16, 5, 2], [16, 5, 3],
      [17, 2, 2], [17, 2, 3], [17, 4, 4], [17, 4, 5], [17, 1, 0], [17, 1, 1],
      [18, 3, 6], [18, 3, 7], [18, 5, 6], [18, 5, 7], [18, 2, 0], [18, 2, 1],
    ];
    for (const [caId, dia, bloqueIdx] of SCHEDULE) {
      await sql`
        INSERT INTO "horario"."horarios" (curso_asignatura_id, dia_semana, hora_inicio, hora_termino)
        VALUES (${caId}, ${dia}, ${BLOQUES[bloqueIdx].horaInicio}, ${BLOQUES[bloqueIdx].horaTermino})
      `;
    }
    console.log(`${SCHEDULE.length} bloques horarios insertados.`);
  }

  // ── 10. ASISTENCIA ──────────────────────────────────────
  console.log('--- Sembrando asistencia ---');
  const asisExisting = await sql`SELECT COUNT(*) as count FROM "asistencia"."asistencia"`;
  if (asisExisting[0].count > 0) {
    console.log('Ya hay asistencia, saltando.');
  } else {
    const clasesRealizadas = await sql`SELECT id, curso_asignatura_id, fecha FROM "clases"."clases" WHERE estado = 'realizada' ORDER BY id`;
    const estudiantes = await sql`SELECT rut, nombre, apellido, cursos FROM "estudiantes"."estudiantes" ORDER BY id`;

    if (clasesRealizadas.length > 0 && estudiantes.length > 0) {
      const caRows = await sql`SELECT id, curso_id FROM "cursos"."curso_asignatura" ORDER BY id`;
      const cursoRows = await sql`SELECT id, nombre FROM "cursos"."cursos" ORDER BY id`;
      const cursoMap: Record<number, string> = {};
      for (const r of cursoRows) cursoMap[r.id] = r.nombre;
      const cursoPorCa: Record<number, string> = {};
      for (const r of caRows) cursoPorCa[r.id] = cursoMap[r.cursoId] || '';

      const presentes = [true, true, true, true, true, true, true, false, true, true, true, true, false, true, true, true, true, true];
      const justificaciones = ['Enfermedad', 'Permiso médico', 'Familiar', 'Problemas personales', 'Cita médica'];

      let total = 0;
      for (const clase of clasesRealizadas) {
        const cursoNombre = cursoPorCa[clase.cursoAsignaturaId];
        if (!cursoNombre) continue;
        const estudiantesCurso = estudiantes.filter((e: any) => e.cursos === cursoNombre);
        for (let i = 0; i < estudiantesCurso.length; i++) {
          const est = estudiantesCurso[i];
          const presente = presentes[i % presentes.length];
          const justificacion = presente ? null : justificaciones[i % justificaciones.length];
          await sql`
            INSERT INTO "asistencia"."asistencia" (clase_id, curso_asignatura_id, estudiante_rut, estudiante_nombre, presente, justificacion, fecha)
            VALUES (${clase.id}, ${clase.cursoAsignaturaId}, ${est.rut}, ${est.nombre + ' ' + est.apellido}, ${presente}, ${justificacion}, ${clase.fecha})
            ON CONFLICT (clase_id, estudiante_rut) DO NOTHING
          `;
          total++;
        }
      }
      console.log(`${total} registros de asistencia insertados.`);
    }
  }

  // ── 11. NOTAS ───────────────────────────────────────────
  console.log('--- Sembrando notas ---');
  const notasExisting = await sql`SELECT COUNT(*) as count FROM "notas"."notas"`;
  if (notasExisting[0].count > 10) {
    console.log('Ya hay notas, saltando.');
  } else {
    const NOTAS_SEED = [
      { estudianteRut: '23232323', asignatura: 'Matemáticas', curso: '3-A', nota: '6.5', tipoEvaluacion: 'prueba', fecha: '2026-03-15', profesorRut: '22222222', coeficiente: 1 },
      { estudianteRut: '23232323', asignatura: 'Matemáticas', curso: '3-A', nota: '5.0', tipoEvaluacion: 'tarea', fecha: '2026-04-01', profesorRut: '22222222', coeficiente: 1 },
      { estudianteRut: '23232323', asignatura: 'Matemáticas', curso: '3-A', nota: '4.5', tipoEvaluacion: 'prueba_sintesis', fecha: '2026-06-15', profesorRut: '22222222', coeficiente: 2 },
      { estudianteRut: '24242424', asignatura: 'Matemáticas', curso: '3-A', nota: '4.0', tipoEvaluacion: 'prueba', fecha: '2026-03-15', profesorRut: '22222222', coeficiente: 1 },
      { estudianteRut: '24242424', asignatura: 'Matemáticas', curso: '3-A', nota: '6.0', tipoEvaluacion: 'tarea', fecha: '2026-04-01', profesorRut: '22222222', coeficiente: 1 },
      { estudianteRut: '24242424', asignatura: 'Matemáticas', curso: '3-A', nota: '5.0', tipoEvaluacion: 'prueba_sintesis', fecha: '2026-06-15', profesorRut: '22222222', coeficiente: 2 },
      { estudianteRut: '25252525', asignatura: 'Matemáticas', curso: '3-A', nota: '7.0', tipoEvaluacion: 'prueba', fecha: '2026-03-15', profesorRut: '22222222', coeficiente: 1 },
      { estudianteRut: '25252525', asignatura: 'Matemáticas', curso: '3-A', nota: '6.8', tipoEvaluacion: 'tarea', fecha: '2026-04-01', profesorRut: '22222222', coeficiente: 1 },
      { estudianteRut: '25252525', asignatura: 'Matemáticas', curso: '3-A', nota: '6.0', tipoEvaluacion: 'prueba_sintesis', fecha: '2026-06-15', profesorRut: '22222222', coeficiente: 2 },
      { estudianteRut: '23232323', asignatura: 'Lenguaje', curso: '3-A', nota: '5.5', tipoEvaluacion: 'prueba', fecha: '2026-03-20', profesorRut: '33333333', coeficiente: 1 },
      { estudianteRut: '23232323', asignatura: 'Lenguaje', curso: '3-A', nota: '6.0', tipoEvaluacion: 'trabajo', fecha: '2026-04-10', profesorRut: '33333333', coeficiente: 1 },
      { estudianteRut: '23232323', asignatura: 'Lenguaje', curso: '3-A', nota: '5.0', tipoEvaluacion: 'prueba_sintesis', fecha: '2026-06-20', profesorRut: '33333333', coeficiente: 2 },
      { estudianteRut: '24242424', asignatura: 'Lenguaje', curso: '3-A', nota: '4.5', tipoEvaluacion: 'prueba', fecha: '2026-03-20', profesorRut: '33333333', coeficiente: 1 },
      { estudianteRut: '24242424', asignatura: 'Lenguaje', curso: '3-A', nota: '5.0', tipoEvaluacion: 'trabajo', fecha: '2026-04-10', profesorRut: '33333333', coeficiente: 1 },
      { estudianteRut: '24242424', asignatura: 'Lenguaje', curso: '3-A', nota: '4.0', tipoEvaluacion: 'prueba_sintesis', fecha: '2026-06-20', profesorRut: '33333333', coeficiente: 2 },
      { estudianteRut: '25252525', asignatura: 'Lenguaje', curso: '3-A', nota: '6.5', tipoEvaluacion: 'prueba', fecha: '2026-03-20', profesorRut: '33333333', coeficiente: 1 },
      { estudianteRut: '25252525', asignatura: 'Lenguaje', curso: '3-A', nota: '7.0', tipoEvaluacion: 'trabajo', fecha: '2026-04-10', profesorRut: '33333333', coeficiente: 1 },
      { estudianteRut: '25252525', asignatura: 'Lenguaje', curso: '3-A', nota: '6.5', tipoEvaluacion: 'prueba_sintesis', fecha: '2026-06-20', profesorRut: '33333333', coeficiente: 2 },
      { estudianteRut: '26262626', asignatura: 'Matemáticas', curso: '3-B', nota: '4.0', tipoEvaluacion: 'prueba', fecha: '2026-03-15', profesorRut: '55555555', coeficiente: 1 },
      { estudianteRut: '26262626', asignatura: 'Matemáticas', curso: '3-B', nota: '5.5', tipoEvaluacion: 'tarea', fecha: '2026-04-01', profesorRut: '55555555', coeficiente: 1 },
      { estudianteRut: '27272727', asignatura: 'Matemáticas', curso: '3-B', nota: '3.5', tipoEvaluacion: 'prueba', fecha: '2026-03-15', profesorRut: '55555555', coeficiente: 1 },
      { estudianteRut: '28282828', asignatura: 'Matemáticas', curso: '3-B', nota: '6.0', tipoEvaluacion: 'prueba', fecha: '2026-03-15', profesorRut: '55555555', coeficiente: 1 },
      { estudianteRut: '32323232', asignatura: 'Matemáticas', curso: '4-B', nota: '5.5', tipoEvaluacion: 'prueba', fecha: '2026-03-15', profesorRut: '22222222', coeficiente: 1 },
      { estudianteRut: '32323232', asignatura: 'Matemáticas', curso: '4-B', nota: '6.0', tipoEvaluacion: 'tarea', fecha: '2026-04-01', profesorRut: '22222222', coeficiente: 1 },
      { estudianteRut: '32323232', asignatura: 'Matemáticas', curso: '4-B', nota: '4.5', tipoEvaluacion: 'prueba_sintesis', fecha: '2026-06-15', profesorRut: '22222222', coeficiente: 2 },
      { estudianteRut: '33333333', asignatura: 'Matemáticas', curso: '4-B', nota: '4.0', tipoEvaluacion: 'prueba', fecha: '2026-03-15', profesorRut: '22222222', coeficiente: 1 },
      { estudianteRut: '33333333', asignatura: 'Matemáticas', curso: '4-B', nota: '5.0', tipoEvaluacion: 'tarea', fecha: '2026-04-01', profesorRut: '22222222', coeficiente: 1 },
      { estudianteRut: '33333333', asignatura: 'Matemáticas', curso: '4-B', nota: '5.5', tipoEvaluacion: 'prueba_sintesis', fecha: '2026-06-15', profesorRut: '22222222', coeficiente: 2 },
      { estudianteRut: '34343434', asignatura: 'Matemáticas', curso: '4-B', nota: '6.5', tipoEvaluacion: 'prueba', fecha: '2026-03-15', profesorRut: '22222222', coeficiente: 1 },
      { estudianteRut: '34343434', asignatura: 'Matemáticas', curso: '4-B', nota: '7.0', tipoEvaluacion: 'tarea', fecha: '2026-04-01', profesorRut: '22222222', coeficiente: 1 },
      { estudianteRut: '34343434', asignatura: 'Matemáticas', curso: '4-B', nota: '6.0', tipoEvaluacion: 'prueba_sintesis', fecha: '2026-06-15', profesorRut: '22222222', coeficiente: 2 },
      { estudianteRut: '32323232', asignatura: 'Lenguaje', curso: '4-B', nota: '6.0', tipoEvaluacion: 'prueba', fecha: '2026-03-20', profesorRut: '33333333', coeficiente: 1 },
      { estudianteRut: '32323232', asignatura: 'Lenguaje', curso: '4-B', nota: '5.5', tipoEvaluacion: 'trabajo', fecha: '2026-04-10', profesorRut: '33333333', coeficiente: 1 },
      { estudianteRut: '33333333', asignatura: 'Lenguaje', curso: '4-B', nota: '3.5', tipoEvaluacion: 'prueba', fecha: '2026-03-20', profesorRut: '33333333', coeficiente: 1 },
      { estudianteRut: '33333333', asignatura: 'Lenguaje', curso: '4-B', nota: '4.0', tipoEvaluacion: 'trabajo', fecha: '2026-04-10', profesorRut: '33333333', coeficiente: 1 },
      { estudianteRut: '34343434', asignatura: 'Lenguaje', curso: '4-B', nota: '5.0', tipoEvaluacion: 'prueba', fecha: '2026-03-20', profesorRut: '33333333', coeficiente: 1 },
      { estudianteRut: '34343434', asignatura: 'Lenguaje', curso: '4-B', nota: '6.0', tipoEvaluacion: 'trabajo', fecha: '2026-04-10', profesorRut: '33333333', coeficiente: 1 },
    ];
    for (const n of NOTAS_SEED) {
      await sql`
        INSERT INTO "notas"."notas" (estudiante_rut, asignatura, curso, nota, tipo_evaluacion, fecha, profesor_rut, coeficiente)
        VALUES (${n.estudianteRut}, ${n.asignatura}, ${n.curso}, ${n.nota}, ${n.tipoEvaluacion}, ${n.fecha}, ${n.profesorRut}, ${n.coeficiente})
      `;
    }
    console.log(`${NOTAS_SEED.length} notas insertadas.`);
  }

  // ── 12. MENSAJERIA ─────────────────────────────────────
  console.log('--- Sembrando mensajería ---');
  const convExisting = await sql`SELECT COUNT(*) as count FROM "mensajeria"."conversaciones"`;
  if (convExisting[0].count > 0) {
    console.log('Ya hay conversaciones, saltando.');
  } else {
    const estud = await sql`SELECT rut, nombre, apellido FROM "estudiantes"."estudiantes" LIMIT 1`;
    const prof = await sql`SELECT rut, nombre, apellido FROM "profesores"."profesores" LIMIT 1`;
    if (estud.length > 0 && prof.length > 0) {
      const e = estud[0], p = prof[0];
      const conv = await sql`INSERT INTO "mensajeria"."conversaciones" ("created_at") VALUES (now()::text) RETURNING id`;
      const convId = conv[0].id;
      await sql`
        INSERT INTO "mensajeria"."conversacion_participantes" (conversacion_id, usuario_id, usuario_nombre, usuario_apellido, usuario_rol) VALUES
        (${convId}, ${e.rut}, ${e.nombre}, ${e.apellido}, 'estudiante'),
        (${convId}, ${p.rut}, ${p.nombre}, ${p.apellido}, 'profesor')
      `;
      await sql`
        INSERT INTO "mensajeria"."mensajes" (conversacion_id, remitente_id, remitente_nombre, remitente_apellido, remitente_rol, contenido, created_at) VALUES
        (${convId}, ${e.rut}, ${e.nombre}, ${e.apellido}, 'estudiante', 'Hola profesor, tengo una consulta sobre la tarea', (now()::text)),
        (${convId}, ${p.rut}, ${p.nombre}, ${p.apellido}, 'profesor', 'Hola, claro dime cuál es tu duda', ((now() + interval '1 minute')::text)),
        (${convId}, ${e.rut}, ${e.nombre}, ${e.apellido}, 'estudiante', 'No entendi el ejercicio 3, podria explicarmelo?', ((now() + interval '2 minutes')::text)),
        (${convId}, ${p.rut}, ${p.nombre}, ${p.apellido}, 'profesor', 'Claro, mañana despues de clases te explico.', ((now() + interval '3 minutes')::text))
      `;
      console.log('Mensajería: datos de ejemplo insertados.');
    }
  }

  console.log('¡Seed completado exitosamente!');
}

try {
  await seed();
} finally {
  await sql.end();
}
