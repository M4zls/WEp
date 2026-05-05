import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core';
// Tabla de Profesores
export const profesores = sqliteTable('profesores', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    rut: text('rut').notNull().unique(),
    dv: text('dv').notNull(),
    nombre: text('nombre').notNull(),
    apellido: text('apellido').notNull(),
    email: text('email').notNull().unique(),
    telefono: text('telefono'),
    asignatura: text('asignatura').notNull(),
    curso: text('curso').notNull(),
    activo: integer('activo', { mode: 'boolean' }).default(true),
    fechaIngreso: text('fecha_ingreso').default(new Date().toISOString()),
});
// Tabla de Horarios
export const horarios = sqliteTable('horarios', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    profesorId: integer('profesor_id')
        .notNull()
        .references(() => profesores.id, { onDelete: 'cascade' }),
    dia: text('dia').notNull(), // lunes, martes, etc
    horaInicio: text('hora_inicio').notNull(),
    horaFin: text('hora_fin').notNull(),
    sala: text('sala'),
    cursoId: text('curso_id').notNull(),
});
// Tabla de Clases
export const clases = sqliteTable('clases', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    profesorId: integer('profesor_id')
        .notNull()
        .references(() => profesores.id, { onDelete: 'cascade' }),
    cursoId: text('curso_id').notNull(),
    asignatura: text('asignatura').notNull(),
    fecha: text('fecha').notNull(),
    tema: text('tema'),
    descripcion: text('descripcion'),
    sala: text('sala'),
});
// Tabla de Disponibilidad
export const disponibilidad = sqliteTable('disponibilidad', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    profesorId: integer('profesor_id')
        .notNull()
        .references(() => profesores.id, { onDelete: 'cascade' }),
    dia: text('dia').notNull(),
    horaInicio: text('hora_inicio').notNull(),
    horaFin: text('hora_fin').notNull(),
    tipo: text('tipo').notNull(), // atencion, reunion, libre
    ubicacion: text('ubicacion'),
});
//# sourceMappingURL=schema.js.map