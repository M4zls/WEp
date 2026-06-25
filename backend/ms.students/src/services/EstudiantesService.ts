import { EstudiantesRepository } from '../repositories/EstudiantesRepository.js';
import type { IEstudiante } from '../types/Estudiante.js';
import { STUDENT_ERRORS, STUDENT_RUT_REGEX } from '../common/Consts.js';

/**
 * Servicio de negocio para estudiantes.
 */
export class EstudiantesService {
    private repository: EstudiantesRepository;

    constructor() {
        this.repository = new EstudiantesRepository();
    }

    /**
     * Obtiene todos los estudiantes.
     * @returns {Promise<IEstudiante[]>} Listado de estudiantes.
     */
    async getAllStudents(): Promise<IEstudiante[]> {
        return await this.repository.getAllStudents();
    }

    /** Obtiene un estudiante por su RUT. */
    /**
     * Obtiene un estudiante por su RUT.
     * @param {string} rut - RUT del estudiante a buscar.
     * @returns {Promise<IEstudiante | null>} El estudiante encontrado o null.
     */
    async getStudentByRut(rut: string): Promise<IEstudiante | null> {
        if(!rut || rut.trim() === '') {
            throw new Error(STUDENT_ERRORS.RUT_REQUIRED_QUERY);
        }
        const estudiante = await this.repository.findStudentByRut(rut);
        if (!estudiante) {
            throw new Error(STUDENT_ERRORS.NOT_FOUND);
        }
        return estudiante;
    }

    /**
     * Autentica un estudiante usando email y contraseña.
     * @param {string} email - Email del estudiante.
     * @param {string} password - Contraseña del estudiante.
     * @returns {Promise<IEstudiante | null>} Estudiante autenticado sin contraseña, o null.
     */
    async authenticateStudent(email: string, password: string): Promise<IEstudiante | null> {
        if (!email || email.trim() === '') {
            throw new Error(STUDENT_ERRORS.EMAIL_REQUIRED);
        }
        if (!password || password.trim() === '') {
            throw new Error(STUDENT_ERRORS.PASSWORD_REQUIRED);
        }

        const estudiante = await this.repository.findStudentByEmail(email);
        if (!estudiante) {
            throw new Error(STUDENT_ERRORS.NOT_FOUND);
        }

        if (estudiante.password !== password) {
            throw new Error('Contraseña incorrecta');
        }

        const { password: _, ...estudianteSeguro } = estudiante as any;
        return estudianteSeguro as IEstudiante;
    }

    /**
     * Crea un estudiante validando sus campos principales.
     * @param {IEstudiante} datos - Datos completos del estudiante a crear.
     * @returns {Promise<void>} Resuelve cuando el estudiante es creado.
     */
    async createStudent(datos: IEstudiante): Promise<void> {
        if (!datos.rut || datos.rut.trim() === '') {
            throw new Error(STUDENT_ERRORS.RUT_REQUIRED);
        }

        if (!datos.dv || datos.dv.trim() === '') {
            throw new Error(STUDENT_ERRORS.DV_REQUIRED);
        }

        if (!STUDENT_RUT_REGEX.test(datos.rut)) {
            throw new Error(STUDENT_ERRORS.RUT_INVALID);
        }

        if (!datos.cursos || datos.cursos.trim() === '') {
            throw new Error(STUDENT_ERRORS.COURSE_REQUIRED);
        }

        if (!datos.email || datos.email.trim() === '') {
            throw new Error(STUDENT_ERRORS.EMAIL_REQUIRED);
        }

        if (!datos.password || datos.password.trim() === '') {
            throw new Error(STUDENT_ERRORS.PASSWORD_REQUIRED);
        }

        const existente = await this.repository.findStudentByRut(datos.rut);
        if (existente) {
            throw new Error(STUDENT_ERRORS.DUPLICATE_RUT);
        }

        await this.repository.createStudent(datos);
    }

    /**
     * Actualiza un estudiante por su RUT.
     * @param {string} rut - RUT del estudiante a actualizar.
     * @param {Partial<IEstudiante>} datos - Campos a actualizar.
     * @returns {Promise<void>} Resuelve cuando la actualización finaliza.
     */
    async updateStudent(rut: string, datos: Partial<IEstudiante>): Promise<void> {
        const estudiante = await this.repository.findStudentByRut(rut);
        if (!estudiante) {
            throw new Error(STUDENT_ERRORS.NOT_FOUND);
        }

        await this.repository.updateStudent(rut, datos);
    }

    /**
     * Elimina un estudiante por su RUT.
     * @param {string} rut - RUT del estudiante a eliminar.
     * @returns {Promise<void>} Resuelve cuando el estudiante es eliminado.
     */
    async deleteStudent(rut: string): Promise<void> {
        const estudiante = await this.repository.findStudentByRut(rut);
        if (!estudiante) {
            throw new Error(STUDENT_ERRORS.NOT_FOUND);
        }

        await this.repository.deleteStudent(rut);
    }

    /**
     * Obtiene estudiantes filtrando por curso.
     * @param {string} curso - Nombre del curso para filtrar.
     * @returns {Promise<IEstudiante[]>} Lista de estudiantes del curso.
     */
    async getStudentsByCourse(curso: string): Promise<IEstudiante[]> {
        if (!curso || curso.trim() === '') {
            throw new Error(STUDENT_ERRORS.COURSE_REQUIRED_QUERY);
        }
        return await this.repository.findStudentsByCourse(curso);
    }
}
