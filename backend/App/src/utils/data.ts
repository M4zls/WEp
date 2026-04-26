import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import * as schema from './schema.js';


let db: ReturnType<typeof drizzle> | null = null;

export const getDatabaseinstance = () => {
  if (!db) {
    const sqlite = new Database('./data/clase.db');
    db = drizzle(sqlite, { schema });

    // Crear las tablas si no existen
    const tables = sqlite
      .prepare(`
        SELECT name FROM sqlite_master 
        WHERE type='table' AND name NOT LIKE 'sqlite_%';
      `)
      .all();

    if (tables.length === 0) {
      console.log('Creando tablas de la base de datos');

      sqlite.exec(`
        CREATE TABLE IF NOT EXISTS estudiantes (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          rut TEXT NOT NULL UNIQUE,
          dv TEXT NOT NULL,
          nombre TEXT NOT NULL,
          apellido TEXT NOT NULL,
          cursos TEXT NOT NULL,
          email TEXT,
          telefono TEXT,
          apoderado TEXT,
          fecha_registro TEXT DEFAULT CURRENT_TIMESTAMP
        );
      `);

      sqlite.exec(`
        CREATE TABLE IF NOT EXISTS asistencias (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          rut TEXT NOT NULL,
          fecha TEXT NOT NULL,
          presente INTEGER NOT NULL,
          justificacion TEXT,
          FOREIGN KEY (rut) REFERENCES estudiantes(rut) ON DELETE CASCADE
        );
      `);

      sqlite.exec(`
        CREATE TABLE IF NOT EXISTS calificaciones (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          rut TEXT NOT NULL,
          asignatura TEXT NOT NULL,
          nota REAL NOT NULL,
          fecha TEXT NOT NULL,
          descripcion TEXT,
          FOREIGN KEY (rut) REFERENCES estudiantes(rut) ON DELETE CASCADE
        );
      `);

      sqlite.exec(`
        CREATE TABLE IF NOT EXISTS profesores (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          rut TEXT NOT NULL UNIQUE,
          dv TEXT NOT NULL,
          nombre TEXT NOT NULL,
          apellido TEXT NOT NULL,
          email TEXT NOT NULL UNIQUE,
          asignatura TEXT NOT NULL,
          curso TEXT NOT NULL
        );
      `);

      console.log('tablas creadas correctamente');
    } else {
      console.log('las tablas ya existen');
    }
  }
  return db;
};