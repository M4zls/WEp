import { getDatabaseInstance } from '../models/data.js';
import { profesores } from '../models/schema.js';
import { eq } from 'drizzle-orm';
import type { IProfesor } from '../types/Profesor.js';

/**
 * Repositorio encargado del acceso a datos de profesores.
 */
export class ProfesoresRepository {
    private db = getDatabaseInstance();

    /**
     * Obtiene todos los profesores almacenados.
     * @returns {Promise<IProfesor[]>} Todos los profesores en la base de datos.
     */
    async getAllTeachers(): Promise<IProfesor[]> {
        const resultado = await this.db.select().from(profesores);
        return resultado;
    }

    /**
     * Busca un profesor por su RUT.
     * @param {string} rut - RUT del profesor a buscar.
     * @returns {Promise<IProfesor | null>} Profesor encontrado o null.
     */
    async findTeacherByRut(rut: string): Promise<IProfesor | null> {
        const resultado = await this.db
            .select()
            .from(profesores)
            .where(eq(profesores.rut, rut));
        return resultado.length > 0 ? resultado[0] : null;
    }

    /**
     * Busca un profesor por su correo electrónico.
     * @param {string} email - Email del profesor a buscar.
     * @returns {Promise<IProfesor | null>} Profesor encontrado o null.
     */
    async findTeacherByEmail(email: string): Promise<IProfesor | null> {
        const resultado = await this.db
            .select()
            .from(profesores)
            .where(eq(profesores.email, email));
        return resultado.length > 0 ? resultado[0] : null;
    }

    /**
     * Crea un nuevo profesor.
     * @param {IProfesor} datos - Datos del profesor a insertar.
     * @returns {Promise<void>} Resuelve cuando la inserción termina.
     */
    async createTeacher(datos: IProfesor): Promise<void> {
        await this.db.insert(profesores).values({
            rut: datos.rut,
            dv: datos.dv,
            nombre: datos.nombre,
            apellido: datos.apellido,
            email: datos.email,
            password: datos.password,
            telefono: datos.telefono,
            materia: datos.materia,
        });
    }

    /**
     * Actualiza los datos de un profesor por su RUT.
     * @param {string} rut - RUT del profesor a actualizar.
     * @param {Partial<IProfesor>} datos - Campos a actualizar.
     * @returns {Promise<void>} Resuelve cuando la actualización termina.
     */
    async updateTeacher(rut: string, datos: Partial<IProfesor>): Promise<void> {
        await this.db
            .update(profesores)
            .set(datos)
            .where(eq(profesores.rut, rut));
    }

    /**
     * Elimina un profesor por su RUT.
     * @param {string} rut - RUT del profesor a eliminar.
     * @returns {Promise<void>} Resuelve cuando la eliminación termina.
     */
    async deleteTeacher(rut: string): Promise<void> {
        await this.db
        .delete(profesores)
        .where(eq(profesores.rut, rut));
    }

    /**
     * Obtiene el nombre del profesor asociado a una materia.
     * Nota: actualmente la implementación devuelve el campo `materia` (el nombre de la materia)
     * en lugar del nombre del profesor. Revisar si esto es intencional o un error de la consulta.
     * @param {string} materia - Materia a consultar.
     * @returns {Promise<string | null>} Nombre de la materia o null.
     */
    async findTeacherSubject(materia: string): Promise<string | null> {
        const resultado = await this.db
            .select()
            .from(profesores)
            .where(eq(profesores.materia, materia));
        return resultado.length > 0 ? resultado[0].materia : null;
    }
}