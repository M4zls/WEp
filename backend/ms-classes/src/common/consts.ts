export const CLASS_STATUSES = {
  PENDING: 'pending',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
} as const;

export const CLASS_ERRORS = {
  NOT_FOUND: 'Clase no encontrada',
  COURSE_SUBJECT_REQUIRED: 'El ID del curso-asignatura es obligatorio',
  TITLE_REQUIRED: 'El título es obligatorio',
  DATE_REQUIRED: 'La fecha es obligatoria',
  START_TIME_REQUIRED: 'La hora de inicio es obligatoria',
  END_TIME_REQUIRED: 'La hora de término es obligatoria',
  INVALID_STATUS: 'Estado inválido. Debe ser: pendiente, realizada o cancelada',
} as const;
