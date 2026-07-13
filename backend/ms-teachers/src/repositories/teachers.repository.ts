import { getDatabaseInstance } from '../models/data.js';
import { teachers } from '../models/schema.js';
import { eq } from 'drizzle-orm';
import type { ITeacher } from '../types/teacher.js';
import type { ITeachersRepository } from './teachers.repository.interface.js';

/**
 * Repositorio encargado del acceso a datos de profesores.
 */
export class TeachersRepository implements ITeachersRepository {
    private db = getDatabaseInstance();

    /**
     * Obtiene todos los profesores almacenados.
     * @returns {Promise<ITeacher[]>} Todos los profesores en la base de datos.
     */
    async getAllTeachers(): Promise<ITeacher[]> {
        const resultado = await this.db.select().from(teachers);
        return resultado;
    }

    /**
     * Busca un profesor por su RUT.
     * @param {string} rut - RUT del profesor a buscar.
     * @returns {Promise<ITeacher | null>} Profesor encontrado o null.
     */
    async findTeacherByRut(rut: string): Promise<ITeacher | null> {
        const resultado = await this.db
            .select()
            .from(teachers)
            .where(eq(teachers.rut, rut));
        return resultado.length > 0 ? resultado[0] : null;
    }

    /**
     * Busca un profesor por su correo electrónico.
     * @param {string} email - Email del profesor a buscar.
     * @returns {Promise<ITeacher | null>} Profesor encontrado o null.
     */
    async findTeacherById(id: number): Promise<ITeacher | null> {
        const resultado = await this.db
            .select()
            .from(teachers)
            .where(eq(teachers.id, id));
        return resultado.length > 0 ? resultado[0] : null;
    }

    async findTeacherByEmail(email: string): Promise<ITeacher | null> {
        const resultado = await this.db
            .select()
            .from(teachers)
            .where(eq(teachers.email, email));
        return resultado.length > 0 ? resultado[0] : null;
    }

    /**
     * Crea un nuevo profesor.
     * @param {ITeacher} datos - Datos del profesor a insertar.
     * @returns {Promise<void>} Resuelve cuando la inserción termina.
     */
    async createTeacher(datos: ITeacher): Promise<void> {
        await this.db.insert(teachers).values({
            rut: datos.rut,
            dv: datos.dv,
            firstName: datos.firstName,
            lastName: datos.lastName,
            email: datos.email,
            password: datos.password,
            phone: datos.phone,
            subject: datos.subject,
        });
    }

    /**
     * Actualiza los datos de un profesor por su RUT.
     * @param {string} rut - RUT del profesor a actualizar.
     * @param {Partial<ITeacher>} datos - Campos a actualizar.
     * @returns {Promise<void>} Resuelve cuando la actualización termina.
     */
    async updateTeacher(rut: string, datos: Partial<ITeacher>): Promise<void> {
        await this.db
            .update(teachers)
            .set(datos)
            .where(eq(teachers.rut, rut));
    }

    /**
     * Elimina un profesor por su RUT.
     * @param {string} rut - RUT del profesor a eliminar.
     * @returns {Promise<void>} Resuelve cuando la eliminación termina.
     */
    async deleteTeacher(rut: string): Promise<void> {
        await this.db
        .delete(teachers)
        .where(eq(teachers.rut, rut));
    }

    /**
     * Obtiene el nombre del profesor asociado a una materia.
     * Nota: actualmente la implementación devuelve el campo `subject` (el nombre de la materia)
     * en lugar del nombre del profesor. Revisar si esto es intencional o un error de la consulta.
     * @param {string} materia - Materia a consultar.
     * @returns {Promise<string | null>} Nombre de la materia o null.
     */
    async findTeacherSubject(subject: string): Promise<string | null> {
        const resultado = await this.db
            .select()
            .from(teachers)
            .where(eq(teachers.subject, subject));
        return resultado.length > 0 ? resultado[0].subject : null;
    }
}
