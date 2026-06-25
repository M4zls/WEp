import { ProfesoresRepository } from "../repositories/ProfesoresRepository.js";
import type { IProfesor } from "../types/Profesor.js";
import { PROFESSOR_ERRORS } from "../common/Consts.js";

/**
 * Servicio de negocio para profesores.
 */
export class ProfesoresService {
    private repository: ProfesoresRepository;

    constructor() {
        this.repository = new ProfesoresRepository();
    }

    /**
     * Obtiene todos los profesores.
     * @returns {Promise<IProfesor[]>} Listado de profesores.
     */
    async getAllTeachers(): Promise<IProfesor[]> {
        return await this.repository.getAllTeachers();
    }

    /**
     * Obtiene un profesor por su RUT.
     * @param {string} rut - RUT del profesor a buscar.
     * @returns {Promise<IProfesor | null>} Profesor encontrado o null.
     */
    async getTeacherByRut(rut: string): Promise<IProfesor | null> {
        if (!rut || rut.trim() === '') {
            throw new Error(PROFESSOR_ERRORS.RUT_REQUIRED_QUERY);
        }
        const profesor = await this.repository.findTeacherByRut(rut);
        if (!profesor) {
            throw new Error(PROFESSOR_ERRORS.NOT_FOUND);
        }
        return profesor;
    }

    /**
     * Autentica un profesor usando email y contraseña.
     * @param {string} email - Email del profesor.
     * @param {string} password - Contraseña del profesor.
     * @returns {Promise<IProfesor | null>} Profesor autenticado sin contraseña, o null.
     */
    async authenticateTeacher(email: string, password:string): Promise<IProfesor | null> {
        if (!email || email.trim() === ''){
            throw new Error(PROFESSOR_ERRORS.EMAIL_REQUIRED);
        }
        if (!password || password.trim() === '') {
            throw new Error(PROFESSOR_ERRORS.PASSWORD_REQUIRED);
        }

        const profesor = await this.repository.findTeacherByEmail(email);
        if (!profesor) {
            throw new Error(PROFESSOR_ERRORS.NOT_FOUND);
        }
        if (profesor.password !== password) {
            throw new Error('Contraseña incorrecta');
        }

        const { password: _, ...profesorSeguro } = profesor as any;
        return profesorSeguro as IProfesor;
    }

    /**
     * Crea un profesor validando sus campos principales.
     * @param {IProfesor} datos - Datos del profesor a crear.
     * @returns {Promise<void>} Resuelve cuando el profesor es creado.
     */
    async createTeacher(datos: IProfesor): Promise<void> {
        if (!datos.rut || datos.rut.trim() === '') {
            throw new Error(PROFESSOR_ERRORS.RUT_REQUIRED);
        }

        if (!datos.dv || datos.dv.trim() === '') {
            throw new Error(PROFESSOR_ERRORS.DV_REQUIRED);
        }
        if (!datos.nombre || datos.nombre.trim() === '') {
            throw new Error(PROFESSOR_ERRORS.NAME_REQUIRED);
        }
        if (!datos.email || datos.email.trim() === '') {
            throw new Error(PROFESSOR_ERRORS.EMAIL_REQUIRED);
        }
        if (!datos.password || datos.password.trim() === '') {
            throw new Error(PROFESSOR_ERRORS.PASSWORD_REQUIRED);
        }

        await this.repository.createTeacher(datos);
    }

    /**
     * Actualiza un profesor por su RUT.
     * @param {string} rut - RUT del profesor a actualizar.
     * @param {Partial<IProfesor>} datos - Campos a actualizar.
     * @returns {Promise<void>} Resuelve cuando la actualización finaliza.
     */
    async updateTeacher(rut: string, datos: Partial<IProfesor>): Promise<void> {
        if (!rut || rut.trim() === '') {
            throw new Error(PROFESSOR_ERRORS.RUT_REQUIRED_QUERY);
        }

        await this.repository.updateTeacher(rut, datos);
    }

    /**
     * Elimina un profesor por su RUT.
     * @param {string} rut - RUT del profesor a eliminar.
     * @returns {Promise<void>} Resuelve cuando el profesor es eliminado.
     */
    async deleteTeacher(rut: string): Promise<void> {
        if (!rut || rut.trim() === '') {
            throw new Error(PROFESSOR_ERRORS.RUT_REQUIRED_QUERY);
        }

        await this.repository.deleteTeacher(rut);
    }
    
}    