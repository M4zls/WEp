import path from 'path';
import { fileURLToPath } from 'url';
import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import * as schema from './schema.js';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
let db = null;
export const getDatabaseinstance = () => {
    if (!db) {
        const dbPath = path.join(__dirname, '../../data/autentificacion.db');
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
            console.log('Creando tablas de la base de datos de autentificacion');
            sqlite.exec(`
        CREATE TABLE IF NOT EXISTS usuarios (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          rut TEXT NOT NULL UNIQUE,
          dv TEXT NOT NULL,
          nombre TEXT NOT NULL,
          apellido TEXT NOT NULL,
          email TEXT NOT NULL UNIQUE,
          password TEXT NOT NULL,
          rol TEXT NOT NULL DEFAULT 'estudiante',
          activo INTEGER NOT NULL DEFAULT 1,
          fecha_creacion TEXT DEFAULT CURRENT_TIMESTAMP
        );
      `);
            sqlite.exec(`
        CREATE TABLE IF NOT EXISTS sesiones (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          usuario_id INTEGER NOT NULL,
          token TEXT NOT NULL UNIQUE,
          expires_at TEXT NOT NULL,
          created_at TEXT DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
        );
      `);
            sqlite.exec(`
        CREATE TABLE IF NOT EXISTS tokens_recuperacion (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          usuario_id INTEGER NOT NULL,
          token TEXT NOT NULL UNIQUE,
          expires_at TEXT NOT NULL,
          usado INTEGER NOT NULL DEFAULT 0,
          created_at TEXT DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
        );
      `);
            sqlite.exec(`
        CREATE TABLE IF NOT EXISTS permisos (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          usuario_id INTEGER NOT NULL,
          modulo TEXT NOT NULL,
          lectura INTEGER NOT NULL DEFAULT 0,
          escritura INTEGER NOT NULL DEFAULT 0,
          eliminacion INTEGER NOT NULL DEFAULT 0,
          FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
        );
      `);
            console.log('Tablas de autentificacion creadas correctamente');
        }
        else {
            console.log('Las tablas de autentificacion ya existen');
        }
    }
    return db;
};
//# sourceMappingURL=data.js.map