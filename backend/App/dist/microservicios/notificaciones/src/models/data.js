import path from 'path';
import { fileURLToPath } from 'url';
import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import * as schema from './schema.js';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
let db = null;
export const getDatabaseinstance = () => {
    if (!db) {
        const dbPath = path.join(__dirname, '../../data/notificaciones.db');
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
            console.log('Creando tablas de la base de datos de notificaciones');
            sqlite.exec(`
        CREATE TABLE IF NOT EXISTS notificaciones (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          usuario_id INTEGER NOT NULL,
          titulo TEXT NOT NULL,
          mensaje TEXT NOT NULL,
          tipo TEXT NOT NULL,
          leida INTEGER NOT NULL DEFAULT 0,
          url TEXT,
          fecha_creacion TEXT DEFAULT CURRENT_TIMESTAMP,
          fecha_lectura TEXT
        );
      `);
            sqlite.exec(`
        CREATE TABLE IF NOT EXISTS eventos (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          titulo TEXT NOT NULL,
          descripcion TEXT,
          tipo TEXT NOT NULL,
          datos TEXT,
          activo INTEGER NOT NULL DEFAULT 1,
          fecha_creacion TEXT DEFAULT CURRENT_TIMESTAMP,
          fecha_programada TEXT
        );
      `);
            sqlite.exec(`
        CREATE TABLE IF NOT EXISTS logs (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          usuario_id INTEGER,
          accion TEXT NOT NULL,
          modulo TEXT NOT NULL,
          detalles TEXT,
          ip TEXT,
          estado TEXT NOT NULL,
          fecha_creacion TEXT DEFAULT CURRENT_TIMESTAMP
        );
      `);
            console.log('Tablas de notificaciones creadas correctamente');
        }
        else {
            console.log('Las tablas de notificaciones ya existen');
        }
    }
    return db;
};
//# sourceMappingURL=data.js.map