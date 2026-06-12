export const DIAS_SEMANA = {
  1: 'Lunes',
  2: 'Martes',
  3: 'Miércoles',
  4: 'Jueves',
  5: 'Viernes',
} as const;

export const BLOQUES_HORARIOS = [
  { horaInicio: '08:00', horaTermino: '08:45', label: '1° bloque' },
  { horaInicio: '08:45', horaTermino: '09:30', label: '2° bloque' },
  { horaInicio: '09:45', horaTermino: '10:30', label: '3° bloque' },
  { horaInicio: '10:30', horaTermino: '11:15', label: '4° bloque' },
  { horaInicio: '11:30', horaTermino: '12:15', label: '5° bloque' },
  { horaInicio: '12:15', horaTermino: '13:00', label: '6° bloque' },
  { horaInicio: '14:00', horaTermino: '14:45', label: '7° bloque' },
  { horaInicio: '14:45', horaTermino: '15:30', label: '8° bloque' },
  { horaInicio: '15:30', horaTermino: '16:00', label: '9° bloque' },
] as const;

export const HORARIO_ERRORS = {
  NOT_FOUND: 'Horario no encontrado',
} as const;

export const ASISTENCIA_ERRORS = {
  NOT_FOUND: 'Registro de asistencia no encontrado',
} as const;
