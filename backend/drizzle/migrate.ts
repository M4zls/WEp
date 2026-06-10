// Orquesta las migraciones de cada microservicio.
// Requiere que el runtime soporte top-level await e import dinámico (ej. Bun o Node+ESM).
const migrators = [
  './microservicios/autentificacion/drizzle/migrate.ts',
  './microservicios/estudiantes/drizzle/migrate.ts',
  './microservicios/cursos/drizzle/migrate.ts',
  './microservicios/notificaciones/drizzle/migrate.ts',
  './microservicios/profesores/drizzle/migrate.ts'
];

for (const m of migrators) {
  try {
    // Resuelve rutas relativas respecto a este archivo y ejecuta el migrador.
    await import(new URL(m, import.meta.url).toString());
    console.log(`Migrador ejecutado: ${m}`);
  } catch (err) {
    console.error(`Error ejecutando migrador ${m}:`, err);
    throw err;
  }
}

console.log('Migraciones orquestadas ejecutadas');

export {};