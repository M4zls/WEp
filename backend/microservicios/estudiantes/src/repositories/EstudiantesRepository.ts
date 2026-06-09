import { getDatabaseInstance } from '../models/data.js';
import { estudiantes } from '../models/schema.js';
import { eq } from 'drizzle-orm';
import type { IEstudiante } from '../types/Estudiante.js';

/**
 * Repositorio encargado del acceso a datos de estudiantes.
 */
export class EstudiantesRepository {
    private db = getDatabaseInstance();

    /**
     * Obtiene todos los estudiantes almacenados.
     * @returns {Promise<IEstudiante[]>} Todos los estudiantes en la base de datos.
     */
    async getAllStudents(): Promise<IEstudiante[]> {
        const resultado = await this.db.select().from(estudiantes);
        return resultado;
    }

    /**
     * Busca un estudiante por su RUT.
     * @param {string} rut - RUT del estudiante a buscar.
     * @returns {Promise<IEstudiante | null>} El estudiante encontrado o null.
     */
    async findStudentByRut(rut: string): Promise<IEstudiante | null> {
        const resultado = await this.db
            .select()
            .from(estudiantes)
            .where(eq(estudiantes.rut, rut));

        return resultado.length > 0 ? resultado[0] : null;
    }

    /**
     * Busca un estudiante por su correo electrónico.
     * @param {string} email - Email del estudiante a buscar.
     * @returns {Promise<IEstudiante | null>} El estudiante encontrado o null.
     */
    async findStudentByEmail(email: string): Promise<IEstudiante | null> {
        const resultado = await this.db
            .select()
            .from(estudiantes)
            .where(eq(estudiantes.email, email));

        return resultado.length > 0 ? resultado[0] : null;
    }

    /**
     * Crea un nuevo estudiante.
     * @param {IEstudiante} datos - Datos del estudiante a insertar.
     * @returns {Promise<void>} Resuelve cuando la inserción termina.
     */
    async createStudent(datos: IEstudiante): Promise<void> {
        await this.db.insert(estudiantes).values({
            rut: datos.rut,
            dv: datos.dv,
            nombre: datos.nombre,
            apellido: datos.apellido,
            cursos: datos.cursos,
            email: datos.email,
            password: datos.password,
            telefono: datos.telefono,
            apoderado: datos.apoderado,
        });
    }

    /**
     * Actualiza los datos de un estudiante por su RUT.
     * @param {string} rut - RUT del estudiante a actualizar.
     * @param {Partial<IEstudiante>} datos - Campos a actualizar.
     * @returns {Promise<void>} Resuelve cuando la actualización termina.
     */
    async updateStudent(rut: string, datos: Partial<IEstudiante>): Promise<void> {
        await this.db
            .update(estudiantes)
            .set(datos)
            .where(eq(estudiantes.rut, rut));
    }

    /**
     * Elimina un estudiante por su RUT.
     * @param {string} rut - RUT del estudiante a eliminar.
     * @returns {Promise<void>} Resuelve cuando la eliminación termina.
     */
    async deleteStudent(rut: string): Promise<void> {
        await this.db
            .delete(estudiantes)
            .where(eq(estudiantes.rut, rut));
    }

    /**
     * Obtiene los estudiantes asociados a un curso.
     * @param {string} curso - Curso por el cual filtrar estudiantes.
     * @returns {Promise<IEstudiante[]>} Lista de estudiantes en el curso.
     */
    async findStudentsByCourse(curso: string): Promise<IEstudiante[]> {
        const resultado = await this.db
            .select()
            .from(estudiantes)
            .where(eq(estudiantes.cursos, curso));

        return resultado;
    }
}
