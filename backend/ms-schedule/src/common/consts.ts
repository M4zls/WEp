export const DIAS_SEMANA = {
  1: 'Lunes',
  2: 'Martes',
  3: 'Miércoles',
  4: 'Jueves',
  5: 'Viernes',
} as const;

export const TIME_SLOTS = [
  { startTime: '08:00', endTime: '08:45', label: '1° bloque' },
  { startTime: '08:45', endTime: '09:30', label: '2° bloque' },
  { startTime: '09:45', endTime: '10:30', label: '3° bloque' },
  { startTime: '10:30', endTime: '11:15', label: '4° bloque' },
  { startTime: '11:30', endTime: '12:15', label: '5° bloque' },
  { startTime: '12:15', endTime: '13:00', label: '6° bloque' },
  { startTime: '14:00', endTime: '14:45', label: '7° bloque' },
  { startTime: '14:45', endTime: '15:30', label: '8° bloque' },
  { startTime: '15:30', endTime: '16:00', label: '9° bloque' },
] as const;

export const SCHEDULE_ERRORS = {
  NOT_FOUND: 'Horario no encontrado',
} as const;

export const ASISTENCIA_ERRORS = {
  NOT_FOUND: 'Registro de asistencia no encontrado',
} as const;
