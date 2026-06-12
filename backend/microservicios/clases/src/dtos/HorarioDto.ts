import { z } from 'zod';

const diasValidos = [1, 2, 3, 4, 5] as const;

export const crearHorarioSchema = z.object({
  cursoAsignaturaId: z
    .number({ error: 'El ID del curso-asignatura es obligatorio' })
    .int()
    .positive(),
  diaSemana: z
    .number({ error: 'El día de semana es obligatorio' })
    .int()
    .refine(d => diasValidos.includes(d as any), 'Debe ser 1=Lun, 2=Mar, 3=Mié, 4=Jue, 5=Vie'),
  horaInicio: z
    .string({ error: 'La hora de inicio es obligatoria' })
    .regex(/^\d{2}:\d{2}$/, 'Formato HH:MM'),
  horaTermino: z
    .string({ error: 'La hora de término es obligatoria' })
    .regex(/^\d{2}:\d{2}$/, 'Formato HH:MM'),
});

export const actualizarHorarioSchema = z.object({
  diaSemana: z
    .number()
    .int()
    .refine(d => diasValidos.includes(d as any), 'Debe ser 1=Lun, 2=Mar, 3=Mié, 4=Jue, 5=Vie')
    .optional(),
  horaInicio: z.string().regex(/^\d{2}:\d{2}$/, 'Formato HH:MM').optional(),
  horaTermino: z.string().regex(/^\d{2}:\d{2}$/, 'Formato HH:MM').optional(),
});

export type CrearHorarioDto = z.infer<typeof crearHorarioSchema>;
export type ActualizarHorarioDto = z.infer<typeof actualizarHorarioSchema>;
