export const ESTADOS_CLASE = {
  PENDIENTE: 'pendiente',
  REALIZADA: 'realizada',
  CANCELADA: 'cancelada',
} as const;

export const CLASE_ERRORS = {
  NOT_FOUND: 'Clase no encontrada',
  CURSO_ASIGNATURA_REQUIRED: 'El ID del curso-asignatura es obligatorio',
  TITULO_REQUIRED: 'El título es obligatorio',
  FECHA_REQUIRED: 'La fecha es obligatoria',
  HORA_INICIO_REQUIRED: 'La hora de inicio es obligatoria',
  HORA_TERMINO_REQUIRED: 'La hora de término es obligatoria',
  INVALID_ESTADO: 'Estado inválido. Debe ser: pendiente, realizada o cancelada',
} as const;
