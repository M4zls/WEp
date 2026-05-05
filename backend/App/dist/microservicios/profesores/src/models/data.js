import path from 'path';
import { fileURLToPath } from 'url';
import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import * as schema from './schema.js';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
let db = null;
export const getDatabaseinstance = () => {
    if (!db) {
        const dbPath = path.join(__dirname, '../../data/profesores.db');
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
            console.log('Creando tablas de la base de datos de profesores');
            sqlite.exec(`
        CREATE TABLE IF NOT EXISTS profesores (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          rut TEXT NOT NULL UNIQUE,
          dv TEXT NOT NULL,
          nombre TEXT NOT NULL,
          apellido TEXT NOT NULL,
          email TEXT NOT NULL UNIQUE,
          telefono TEXT,
          asignatura TEXT NOT NULL,
          curso TEXT NOT NULL,
          activo INTEGER NOT NULL DEFAULT 1,
          fecha_ingreso TEXT DEFAULT CURRENT_TIMESTAMP
        );
      `);
            sqlite.exec(`
        CREATE TABLE IF NOT EXISTS horarios (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          profesor_id INTEGER NOT NULL,
          dia TEXT NOT NULL,
          hora_inicio TEXT NOT NULL,
          hora_fin TEXT NOT NULL,
          sala TEXT,
          curso_id TEXT NOT NULL,
          FOREIGN KEY (profesor_id) REFERENCES profesores(id) ON DELETE CASCADE
        );
      `);
            sqlite.exec(`
        CREATE TABLE IF NOT EXISTS clases (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          profesor_id INTEGER NOT NULL,
          curso_id TEXT NOT NULL,
          asignatura TEXT NOT NULL,
          fecha TEXT NOT NULL,
          tema TEXT,
          descripcion TEXT,
          sala TEXT,
          FOREIGN KEY (profesor_id) REFERENCES profesores(id) ON DELETE CASCADE
        );
      `);
            sqlite.exec(`
        CREATE TABLE IF NOT EXISTS disponibilidad (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          profesor_id INTEGER NOT NULL,
          dia TEXT NOT NULL,
          hora_inicio TEXT NOT NULL,
          hora_fin TEXT NOT NULL,
          tipo TEXT NOT NULL,
          ubicacion TEXT,
          FOREIGN KEY (profesor_id) REFERENCES profesores(id) ON DELETE CASCADE
        );
      `);
            console.log('Tablas de profesores creadas correctamente');
        }
        else {
            console.log('Las tablas de profesores ya existen');
        }
    }
    return db;
};
//# sourceMappingURL=data.js.map