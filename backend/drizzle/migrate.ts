// Orquesta las migraciones de cada microservicio.
// Requiere que el runtime soporte top-level await e import dinámico (ej. Bun o Node+ESM).
const migrators = [
  '../ms.authentication/drizzle/migrate.ts',
  '../ms.students/drizzle/migrate.ts',
  '../ms.courses/drizzle/migrate.ts',
  '../ms.notifications/drizzle/migrate.ts',
  '../ms.teachers/drizzle/migrate.ts'
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