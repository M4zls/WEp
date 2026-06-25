/**
 * @fileoverview Interfaces del microservicio de notas
 */

/** Representa una calificación en el sistema */
export interface INota {
  /** Identificador único */
  id?: number;
  /** RUT del estudiante al que pertenece la nota */
  estudianteRut: string;
  /** Nombre de la asignatura */
  asignatura: string;
  /** Curso al que pertenece (ej: 3°A) */
  curso: string;
  /** Valor de la nota (escala 1.0 - 7.0) */
  nota: string;
  /** Tipo de evaluación (prueba, tarea, trabajo, etc.) */
  tipoEvaluacion: string;
  /** Fecha de la evaluación */
  fecha: string;
  /** RUT del profesor que registró la nota */
  profesorRut: string;
  /** Coeficiente de la nota (1 = normal, 2 = Prueba de Síntesis, etc.) */
  coeficiente?: number;
}

/** Datos del alumno con sus calificaciones */
export interface ICalificacionesAlumno {
  /** RUT del alumno */
  rut: string;
  /** Nombre del alumno */
  nombre: string;
  /** Apellido del alumno */
  apellido: string;
  /** Curso del alumno */
  curso: string;
  /** Lista de calificaciones agrupadas por asignatura */
  asignaturas: IAsignaturaCalificaciones[];
}

/** Asignatura con sus calificaciones */
export interface IAsignaturaCalificaciones {
  /** Nombre de la asignatura */
  asignatura: string;
  /** Lista de notas de esa asignatura */
  notas: INota[];
  /** Promedio de la asignatura */
  promedio: string;
}
