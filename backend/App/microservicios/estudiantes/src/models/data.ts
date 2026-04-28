import path from 'path';
import { fileURLToPath } from 'url';
import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import * as schema from './schema.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

let db: ReturnType<typeof drizzle> | null = null;

export const getDatabaseinstance = () => {
  if (!db) {
    const dbPath = path.join(__dirname, '../../data/estudiantes.db');
    const sqlite = new Database(dbPath);
    db = drizzle(sqlite, { schema });

    // Crear las tablas si no existen
    const tables = sqlite
      .prepare(`
        SELECT name FROM sqlite_master 
        WHERE type='table' AND name NOT LIKE 'sqlite_%';
      `)
      .all();

    if (tables.length === 0) {
      console.log('Creando tabla de estudiantes');

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

      console.log('Tabla de estudiantes creada correctamente');
    } else {
      console.log('La tabla de estudiantes ya existe');
    }
  }
  return db;
};
