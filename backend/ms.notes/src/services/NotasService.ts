import { NotasRepository } from '../repositories/NotasRepository.js';
import type { INota, ICalificacionesAlumno, IAsignaturaCalificaciones } from '../types/Nota.js';
import { NOTA_ERRORS } from '../common/Consts.js';

/**
 * Servicio de negocio para la gestión de calificaciones.
 * Maneja la lógica de consulta y modificación de notas,
 * validando permisos de profesores y agrupando datos por alumno.
 */
export class NotasService {
    private repository: NotasRepository;

    constructor() {
        this.repository = new NotasRepository();
    }

    /**
     * Obtiene las calificaciones de un estudiante agrupadas por asignatura.
     * @param rut RUT del estudiante
     * @returns Objeto con datos del alumno y sus notas agrupadas
     */
    async getStudentGrades(rut: string): Promise<ICalificacionesAlumno | null> {
        if (!rut || rut.trim() === '') {
            throw new Error(NOTA_ERRORS.RUT_REQUIRED);
        }
        const notas = await this.repository.findByStudentRut(rut);
        if (notas.length === 0) {
            throw new Error(NOTA_ERRORS.ESTUDIANTE_NOT_FOUND);
        }

        const asignaturas = this.groupByAsignatura(notas);
        const curso = notas[0].curso;
        const estudianteData = notas[0];
        const nombre = this.extractStudentName(estudianteData);
        const apellido = this.extractStudentLastName(estudianteData);

        return {
            rut,
            nombre,
            apellido,
            curso,
            asignaturas,
        };
    }

    /**
     * Obtiene todas las notas de un curso filtradas por profesor.
     * @param curso Nombre del curso
     * @param profesorRut RUT del profesor
     * @returns Lista de notas agrupadas por alumno
     */
    async getCourseGrades(curso: string, profesorRut: string): Promise<INota[]> {
        if (!curso || curso.trim() === '') {
            throw new Error(NOTA_ERRORS.CURSO_REQUIRED_QUERY);
        }
        if (!profesorRut || profesorRut.trim() === '') {
            throw new Error(NOTA_ERRORS.PROFESOR_RUT_REQUIRED);
        }
        return await this.repository.findByCursoAndProfesor(curso, profesorRut);
    }

    /** Obtiene todas las notas registradas por un profesor */
    async getTeacherGrades(profesorRut: string): Promise<INota[]> {
        if (!profesorRut || profesorRut.trim() === '') {
            throw new Error(NOTA_ERRORS.PROFESOR_RUT_REQUIRED);
        }
        return await this.repository.findByProfesorRut(profesorRut);
    }

    /**
     * Crea una nueva calificación.
     * @param datos Datos de la nota a crear
     */
    async createGrade(datos: INota): Promise<void> {
        const notaNum = parseFloat(datos.nota);
        if (isNaN(notaNum) || notaNum < 1.0 || notaNum > 7.0) {
            throw new Error(NOTA_ERRORS.NOTA_INVALID);
        }
        if (!datos.estudianteRut || datos.estudianteRut.trim() === '') {
            throw new Error(NOTA_ERRORS.RUT_REQUIRED);
        }
        if (!datos.asignatura || datos.asignatura.trim() === '') {
            throw new Error(NOTA_ERRORS.ASIGNATURA_REQUIRED);
        }
        if (!datos.curso || datos.curso.trim() === '') {
            throw new Error(NOTA_ERRORS.CURSO_REQUIRED);
        }
        if (!datos.tipoEvaluacion || datos.tipoEvaluacion.trim() === '') {
            throw new Error(NOTA_ERRORS.TIPO_EVALUACION_REQUIRED);
        }
        if (!datos.fecha || datos.fecha.trim() === '') {
            throw new Error(NOTA_ERRORS.FECHA_REQUIRED);
        }
        if (!datos.profesorRut || datos.profesorRut.trim() === '') {
            throw new Error(NOTA_ERRORS.PROFESOR_RUT_REQUIRED);
        }

        await this.repository.create(datos);
    }

    /**
     * Actualiza una calificación existente.
     * @param id ID de la nota
     * @param datos Campos a actualizar
     */
    async updateGrade(id: number, datos: Partial<INota>): Promise<void> {
        const existing = await this.repository.findById(id);
        if (!existing) {
            throw new Error(NOTA_ERRORS.NOTA_NOT_FOUND);
        }
        if (datos.nota !== undefined) {
            const notaNum = parseFloat(datos.nota);
            if (isNaN(notaNum) || notaNum < 1.0 || notaNum > 7.0) {
                throw new Error(NOTA_ERRORS.NOTA_INVALID);
            }
        }
        await this.repository.update(id, datos);
    }

    /**
     * Crea múltiples calificaciones en batch.
     * @param notasData Array de datos de notas a crear
     */
    async createGradesBatch(notasData: INota[]): Promise<void> {
        for (const datos of notasData) {
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
    private groupByAsignatura(notas: INota[]): IAsignaturaCalificaciones[] {
        const grouped = new Map<string, INota[]>();

        for (const nota of notas) {
            const existing = grouped.get(nota.asignatura) || [];
            existing.push(nota);
            grouped.set(nota.asignatura, existing);
        }

    const result: IAsignaturaCalificaciones[] = [];
    for (const [asignatura, notasAsig] of grouped.entries()) {
      let sumaPonderada = 0;
      let sumaCoeficientes = 0;
      for (const n of notasAsig) {
        const coef = n.coeficiente ?? 1;
        sumaPonderada += parseFloat(n.nota) * coef;
        sumaCoeficientes += coef;
      }
      const promedio = sumaCoeficientes > 0 ? (sumaPonderada / sumaCoeficientes).toFixed(1) : '0.0';
      result.push({ asignatura, notas: notasAsig, promedio });
    }

        return result;
    }

    /** Extrae nombre del estudiante desde la primera nota (placeholder) */
    private extractStudentName(_nota: INota): string {
        return '';
    }

    /** Extrae apellido del estudiante desde la primera nota (placeholder) */
    private extractStudentLastName(_nota: INota): string {
        return '';
    }
}
