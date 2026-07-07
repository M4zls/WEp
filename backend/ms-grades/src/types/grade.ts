/**
 * @fileoverview Interfaces del microservicio de notas
 */

/** Representa una calificación en el sistema */
export interface IGrade {
  /** Identificador único */
  id?: number;
  /** RUT del estudiante al que pertenece la nota */
  studentRut: string;
  /** Nombre de la asignatura */
  subject: string;
  /** Curso al que pertenece (ej: 3°A) */
  course: string;
  /** Valor de la nota (escala 1.0 - 7.0) */
  grade: string;
  /** Tipo de evaluación (prueba, tarea, trabajo, etc.) */
  evaluationType: string;
  /** Fecha de la evaluación */
  date: string;
  /** RUT del profesor que registró la nota */
  professorRut: string;
  /** Coeficiente de la nota (1 = normal, 2 = Prueba de Síntesis, etc.) */
  coefficient?: number;
}

/** Datos del alumno con sus calificaciones */
export interface IStudentGrades {
  /** RUT del alumno */
  rut: string;
  /** Nombre del alumno */
  firstName: string;
  /** Apellido del alumno */
  lastName: string;
  /** Curso del alumno */
  course: string;
  /** Lista de calificaciones agrupadas por asignatura */
  subjects: ISubjectGrades[];
}

/** Asignatura con sus calificaciones */
export interface ISubjectGrades {
  /** Nombre de la asignatura */
  subject: string;
  /** Lista de notas de esa asignatura */
  grades: IGrade[];
  /** Promedio de la asignatura */
  average: string;
}
