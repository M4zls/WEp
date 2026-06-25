/** Expresión regular para RUT chileno (solo dígitos) */
export const RUT_REGEX = /^\d{7,8}$/;

/** Escala de notas válida */
export const NOTA_MIN = 1.0;
export const NOTA_MAX = 7.0;

/** Tipos de evaluación permitidos */
export const TIPOS_EVALUACION = [
  'prueba',
  'tarea',
  'trabajo',
  'exposicion',
  'laboratorio',
  'taller',
] as const;

export type TipoEvaluacion = typeof TIPOS_EVALUACION[number];

export const NOTA_ERRORS = {
  RUT_REQUIRED: 'El RUT del estudiante es obligatorio',
  ASIGNATURA_REQUIRED: 'La asignatura es obligatoria',
  CURSO_REQUIRED: 'El curso es obligatorio',
  NOTA_INVALID: 'La nota debe estar entre 1.0 y 7.0',
  TIPO_EVALUACION_REQUIRED: 'El tipo de evaluación es obligatorio',
  TIPO_EVALUACION_INVALID: `Tipo de evaluación inválido. Permitidos: ${TIPOS_EVALUACION.join(', ')}`,
  FECHA_REQUIRED: 'La fecha es obligatoria',
  PROFESOR_RUT_REQUIRED: 'El RUT del profesor es obligatorio',
  NOTA_NOT_FOUND: 'Nota no encontrada',
  ESTUDIANTE_NOT_FOUND: 'Estudiante no encontrado',
  CURSO_REQUIRED_QUERY: 'El curso es requerido',
  NOTA_REQUIRED: 'El valor de la nota es obligatorio',
} as const;
