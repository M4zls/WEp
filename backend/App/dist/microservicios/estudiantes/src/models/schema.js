import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core';
// Tabla de Estudiantes
export const estudiantes = sqliteTable('estudiantes', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    rut: text('rut').notNull().unique(),
    dv: text('dv').notNull(),
    nombre: text('nombre').notNull(),
    apellido: text('apellido').notNull(),
    cursos: text('cursos').notNull(),
    email: text('email').notNull().unique(),
    password: text('password').notNull(),
    telefono: text('telefono'),
    apoderado: text('apoderado'),
    fechaRegistro: text('fecha_registro').default(new Date().toISOString()),
});
//# sourceMappingURL=schema.js.map