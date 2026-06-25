import { GradesRepository } from '../repositories/grades.repository.js';
import type { IGrade, IStudentGrades, ISubjectGrades } from '../types/grade.js';
import type { IGradesRepository } from '../repositories/grades.repository.interface.js';
import type { IGradesService } from './grades.service.interface.js';
import { NOTA_ERRORS } from '../common/consts.js';

/**
 * Servicio de negocio para la gestión de calificaciones.
 * Maneja la lógica de consulta y modificación de notas,
 * validando permisos de profesores y agrupando datos por alumno.
 */
export class GradesService implements IGradesService {
    private repository: IGradesRepository;

    constructor(repository?: IGradesRepository) {
        this.repository = repository ?? new GradesRepository();
    }

    /**
     * Obtiene las calificaciones de un estudiante agrupadas por asignatura.
     * @param rut RUT del estudiante
     * @returns Objeto con datos del alumno y sus notas agrupadas
     */
    async getStudentGrades(rut: string): Promise<IStudentGrades | null> {
        if (!rut || rut.trim() === '') {
            throw new Error(NOTA_ERRORS.RUT_REQUIRED);
        }
        const notas = await this.repository.findByStudentRut(rut);
        if (notas.length === 0) {
            throw new Error(NOTA_ERRORS.ESTUDIANTE_NOT_FOUND);
        }

        const subjects = this.groupByAsignatura(notas);
        const curso = notas[0].curso;

        return {
            rut,
            nombre: notas[0].studentName ?? '',
            apellido: notas[0].studentLastName ?? '',
            curso,
            subjects,
        };
    }

    /**
     * Obtiene todas las notas de un curso filtradas por profesor.
     * @param curso Nombre del curso
     * @param professorRut RUT del profesor
     * @returns Lista de notas agrupadas por alumno
     */
    async getCourseGrades(curso: string, professorRut: string): Promise<IGrade[]> {
        if (!curso || curso.trim() === '') {
            throw new Error(NOTA_ERRORS.CURSO_REQUIRED_QUERY);
        }
        if (!professorRut || professorRut.trim() === '') {
            throw new Error(NOTA_ERRORS.PROFESOR_RUT_REQUIRED);
        }
        return  this.repository.findByCursoAndProfesor(curso, professorRut);
    }

    /** Obtiene todas las notas registradas por un profesor */
    async getTeacherGrades(professorRut: string): Promise<IGrade[]> {
        if (!professorRut || professorRut.trim() === '') {
            throw new Error(NOTA_ERRORS.PROFESOR_RUT_REQUIRED);
        }
        return  this.repository.findByProfesorRut(professorRut);
    }

    /**
     * Crea una nueva calificación.
     * @param datos Datos de la nota a crear
     */
    async createGrade(datos: IGrade): Promise<void> {
        const gradeNum = parseFloat(datos.grade);
        if (isNaN(gradeNum) || gradeNum < 1.0 || gradeNum > 7.0) {
            throw new Error(NOTA_ERRORS.NOTA_INVALID);
        }
        if (!datos.studentRut || datos.studentRut.trim() === '') {
            throw new Error(NOTA_ERRORS.RUT_REQUIRED);
        }
        if (!datos.subject || datos.subject.trim() === '') {
            throw new Error(NOTA_ERRORS.ASIGNATURA_REQUIRED);
        }
        if (!datos.curso || datos.curso.trim() === '') {
            throw new Error(NOTA_ERRORS.CURSO_REQUIRED);
        }
        if (!datos.evaluationType || datos.evaluationType.trim() === '') {
            throw new Error(NOTA_ERRORS.TIPO_EVALUACION_REQUIRED);
        }
        if (!datos.date || datos.date.trim() === '') {
            throw new Error(NOTA_ERRORS.FECHA_REQUIRED);
        }
        if (!datos.professorRut || datos.professorRut.trim() === '') {
            throw new Error(NOTA_ERRORS.PROFESOR_RUT_REQUIRED);
        }

        await this.repository.create(datos);
    }

    /**
     * Actualiza una calificación existente.
     * @param id ID de la nota
     * @param datos Campos a actualizar
     */
    async updateGrade(id: number, datos: Partial<IGrade>): Promise<void> {
        const existing = await this.repository.findById(id);
        if (!existing) {
            throw new Error(NOTA_ERRORS.NOTA_NOT_FOUND);
        }
        if (datos.grade !== undefined) {
            const gradeNum = parseFloat(datos.grade);
            if (isNaN(gradeNum) || gradeNum < 1.0 || gradeNum > 7.0) {
                throw new Error(NOTA_ERRORS.NOTA_INVALID);
            }
        }
        await this.repository.update(id, datos);
    }

    /**
     * Crea múltiples calificaciones en batch.
     * @param gradesData Array de datos de notas a crear
     */
    async createGradesBatch(gradesData: IGrade[]): Promise<void> {
        for (const datos of gradesData) {
            await this.createGrade(datos);
        }
    }

    /**
     * Elimina una calificación por su ID.
     * @param id ID de la nota
     */
    async deleteGrade(id: number): Promise<void> {
        const existing = await this.repository.findById(id);
        if (!existing) {
            throw new Error(NOTA_ERRORS.NOTA_NOT_FOUND);
        }
        await this.repository.delete(id);
    }

    /**
     * Agrupa una lista de notas por asignatura y calcula promedios.
     * @param notas Lista plana de notas
     * @returns Array de asignaturas con sus notas y promedio
     */
    private groupByAsignatura(notas: IGrade[]): ISubjectGrades[] {
        const grouped = new Map<string, IGrade[]>();

        for (const nota of notas) {
            const existing = grouped.get(nota.subject) || [];
            existing.push(nota);
            grouped.set(nota.subject, existing);
        }

    const result: ISubjectGrades[] = [];
    for (const [subject, gradeList] of grouped.entries()) {
      let sumaPonderada = 0;
      let sumaCoeficientes = 0;
      for (const n of gradeList) {
        const coef = n.coefficient ?? 1;
        sumaPonderada += parseFloat(n.grade) * coef;
        sumaCoeficientes += coef;
      }
      const promedio = sumaCoeficientes > 0 ? (sumaPonderada / sumaCoeficientes).toFixed(1) : '0.0';
      result.push({ subject, grades: gradeList, promedio });
    }

        return result;
    }

}
